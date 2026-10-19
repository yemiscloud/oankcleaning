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

/**
 * Insert enquiry into the existing enquiries table.
 *
 * Expected database columns:
 *
 * reference_no
 * name
 * email
 * phone
 * service
 * postcode
 * preferred_date
 * message
 * quote_estimate
 * status
 */
function saveSubmissionToDb(array $data): bool
{
    try {

        $pdo = getDbConnection();

        $sql = "
            INSERT INTO enquiries (
                reference_no,
                name,
                email,
                phone,
                service,
                postcode,
                preferred_date,
                message,
                quote_estimate,
                status
            )
            VALUES (
                :reference_no,
                :name,
                :email,
                :phone,
                :service,
                :postcode,
                :preferred_date,
                :message,
                :quote_estimate,
                :status
            )
        ";

        $statement = $pdo->prepare($sql);

        return $statement->execute([
            ':reference_no' => $data['referenceNo'] ?? '',
            ':name' => $data['name'] ?? '',
            ':email' => $data['email'] ?? '',
            ':phone' => $data['phone'] ?? null,
            ':service' => $data['service'] ?? 'General Enquiry',
            ':postcode' => $data['postcode'] ?? null,
            ':preferred_date' => $data['preferredDate'] ?? 'Flexible',
            ':message' => $data['message'] ?? '',
            ':quote_estimate' => $data['quoteEstimate'] ?? null,
            ':status' => $data['status'] ?? 'Pending',
        ]);

    } catch (Throwable $e) {

        error_log(
            'OanK Cleaning enquiry insert failed: '
            . $e->getMessage()
        );

        return false;
    }
}