<?php

/**
 * OanK Cleaning
 * MySQL Database Handler
 *
 * Responsibilities:
 * - Establish PDO connection
 * - Insert enquiries into existing enquiries table
 *
 * Database credentials are defined in config.php.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

/**
 * Get PDO database connection.
 */
function getDbConnection(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    try {
        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=utf8mb4',
            DB_HOST,
            DB_NAME
        );

        $pdo = new PDO(
            $dsn,
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => 5,
            ]
        );

        return $pdo;

    } catch (PDOException $e) {

        error_log(
            'OanK Cleaning database connection failed: '
            . $e->getMessage()
        );

        throw new RuntimeException(
            'Database connection failed.'
        );
    }
}


/** Generate a 96-bit random public job reference for new submissions. */
function generateSecureJobReference(): string
{
    return 'OANK-' . strtoupper(bin2hex(random_bytes(12)));
}

/**
 * Get existing column names on the enquiries table (cached per request).
 */
function getEnquiriesTableColumns(PDO $pdo): array
{
    static $columns = null;

    if (is_array($columns)) {
        return $columns;
    }

    try {
        $stmt = $pdo->query('SHOW COLUMNS FROM enquiries');
        $rows = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
        $columns = array_map(
            static fn (array $row): string => (string) ($row['Field'] ?? ''),
            $rows
        );
    } catch (Throwable $e) {
        $columns = [
            'reference_no',
            'name',
            'email',
            'phone',
            'service',
            'postcode',
            'preferred_date',
            'message',
            'quote_estimate',
            'original_estimate',
            'savings_amount',
            'price_per_visit',
            'property_type',
            'bedrooms',
            'bathrooms',
            'frequency',
            'frequency_count',
            'frequency_discount_rate',
            'add_ons',
            'preferred_days',
            'living_room_dining_room',
            'materials_discount_rate',
            'status',
        ];
    }

    return $columns;
}

/**
 * Insert enquiry into the existing enquiries table.
 */
function saveSubmissionToDb(array $data): bool
{
    try {
        $pdo = getDbConnection();
        $availableColumns = getEnquiriesTableColumns($pdo);

        $columnValues = [
            'reference_no' => $data['referenceNo'] ?? '',
            'name' => $data['name'] ?? '',
            'email' => $data['email'] ?? '',
            'phone' => $data['phone'] ?? null,
            'service' => $data['service'] ?? 'General Enquiry',
            'postcode' => $data['postcode'] ?? null,
            'preferred_date' => $data['preferredDate'] ?? 'Flexible',
            'message' => $data['message'] ?? '',
            'quote_estimate' => $data['quoteEstimate'] ?? null,
            'original_estimate' => $data['originalEstimate'] ?? null,
            'savings_amount' => $data['savingsAmount'] ?? 0.00,
            'price_per_visit' => $data['pricePerVisit'] ?? null,
            'property_type' => $data['propertyType'] ?? null,
            'bedrooms' => $data['bedrooms'] ?? null,
            'bathrooms' => $data['bathrooms'] ?? null,
            'frequency' => $data['frequency'] ?? null,
            'frequency_count' => $data['frequencyCount'] ?? 1,
            'frequency_discount_rate' => $data['frequencyDiscountRate'] ?? 0.00,
            'add_ons' => $data['addOns'] ?? null,
            'preferred_days' => $data['preferredDays'] ?? null,
            'living_room_dining_room' => !empty($data['livingRoomDiningRoom']) ? 1 : 0,
            'materials_discount_rate' => $data['materialsDiscountRate'] ?? 0.00,
            'status' => $data['status'] ?? 'Pending',
        ];

        $insertColumns = [];
        $placeholders = [];
        $params = [];

        foreach ($columnValues as $col => $val) {
            if (in_array($col, $availableColumns, true)) {
                $insertColumns[] = $col;
                $placeholders[] = ':' . $col;
                $params[':' . $col] = $val;
            }
        }

        $sql = sprintf(
            'INSERT INTO enquiries (%s) VALUES (%s)',
            implode(', ', $insertColumns),
            implode(', ', $placeholders)
        );

        $statement = $pdo->prepare($sql);

        return $statement->execute($params);

    } catch (Throwable $e) {

        error_log(
            'OanK Cleaning enquiry insert failed: '
            . $e->getMessage()
        );

        return false;
    }
}