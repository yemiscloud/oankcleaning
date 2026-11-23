<?php

/**
 * OanK Cleaning
 * Contact Enquiry API
 *
 * Endpoint:
 * POST /api/contact
 *
 * Apache internally routes this to:
 * /backend/api/contact.php
 */

declare(strict_types=1);

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/email_templates.php';

/*
|--------------------------------------------------------------------------
| Request Method
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    sendJsonResponse(
        false,
        'Invalid request method. Only POST requests are allowed.',
        [],
        405
    );
}

/*
|--------------------------------------------------------------------------
| Read JSON Request
|--------------------------------------------------------------------------
*/

$rawInput = file_get_contents('php://input');

if ($rawInput === false || trim($rawInput) === '') {

    sendJsonResponse(
        false,
        'No request data was received.',
        [],
        400
    );
}

$input = json_decode(
    $rawInput,
    true
);

if (!is_array($input)) {

    sendJsonResponse(
        false,
        'Invalid JSON request.',
        [],
        400
    );
}

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

function getInputString(
    array $input,
    string $key,
    string $default = ''
): string {
    if (!isset($input[$key])) {
        return $default;
    }

    if (!is_string($input[$key])) {
        return $default;
    }

    return trim($input[$key]);
}

function limitInput(
    string $value,
    int $maxLength
): string {
    if (mb_strlen($value) > $maxLength) {
        return mb_substr($value, 0, $maxLength);
    }

    return $value;
}

/*
|--------------------------------------------------------------------------
| Extract Input
|--------------------------------------------------------------------------
*/

$name = limitInput(
    getInputString($input, 'name'),
    255
);

$email = limitInput(
    getInputString($input, 'email'),
    255
);

$phone = limitInput(
    getInputString($input, 'phone'),
    50
);

$service = limitInput(
    getInputString(
        $input,
        'service',
        'General Cleaning Enquiry'
    ),
    255
);

$postcode = limitInput(
    getInputString(
        $input,
        'postcode',
        ''
    ),
    50
);

$preferredDate = limitInput(
    getInputString(
        $input,
        'preferredDate',
        'Flexible'
    ),
    100
);

$preferredDays = limitInput(
    getInputString(
        $input,
        'preferredDays',
        ''
    ),
    100
);

$message = limitInput(
    getInputString($input, 'message'),
    10000
);

/*
|--------------------------------------------------------------------------
| Quote Estimate
|--------------------------------------------------------------------------
*/

$quoteEstimate = null;

if (
    isset($input['quoteEstimate'])
    && $input['quoteEstimate'] !== ''
    && $input['quoteEstimate'] !== null
) {

    if (!is_numeric($input['quoteEstimate'])) {

        sendJsonResponse(
            false,
            'Invalid quote estimate.',
            [],
            400
        );
    }

    $quoteEstimate = round(
        (float) $input['quoteEstimate'],
        2
    );

    if ($quoteEstimate < 0) {

        sendJsonResponse(
            false,
            'Quote estimate cannot be negative.',
            [],
            400
        );
    }
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if ($name === '' || $email === '' || $message === '') {

    sendJsonResponse(
        false,
        'Please fill in all mandatory fields: Full Name, Email Address, and Message.',
        [],
        400
    );
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    sendJsonResponse(
        false,
        'Please provide a valid email address.',
        [],
        400
    );
}

/*
|--------------------------------------------------------------------------
| Internal Database Key (not exposed as a contact reference code)
|--------------------------------------------------------------------------
*/

$internalRecordKey = generateSecureJobReference();

/*
|--------------------------------------------------------------------------
| Save To Database
|--------------------------------------------------------------------------
*/

$dbMessage = $preferredDays !== ''
    ? "Preferred Days: {$preferredDays}\n\n{$message}"
    : $message;

$dbSaved = saveSubmissionToDb([
    'referenceNo' => $internalRecordKey,
    'name' => $name,
    'email' => $email,
    'phone' => $phone !== '' ? $phone : null,
    'service' => $service,
    'postcode' => $postcode,
    'preferredDate' => $preferredDate,
    'preferredDays' => $preferredDays !== '' ? $preferredDays : null,
    'message' => $dbMessage,
    'quoteEstimate' => $quoteEstimate,
    'status' => 'Pending',
]);

/*
|--------------------------------------------------------------------------
| Database Failure
|--------------------------------------------------------------------------
|
| Do not tell the customer the enquiry was accepted if it could not
| be stored.
|
*/

if (!$dbSaved) {

    error_log(
        "OanK Cleaning contact enquiry could not be saved; attempting email fallback for {$email}."
    );

    $emailBody = "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nService: {$service}\nMessage: {$message}";

    sendDatabaseFailureEmail(
        "Contact Enquiry Failure - {$name}",
        $emailBody
    );

    sendJsonResponse(
        false,
        'We encountered a temporary issue saving your request, but it has been emailed to our team. We will be in touch shortly.',
        [],
        500
    );
}

/*
|--------------------------------------------------------------------------
| Build & Send Emails via Centralized Templates
|--------------------------------------------------------------------------
*/

$contactEmailPayload = [
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'service' => $service,
    'postcode' => $postcode,
    'preferredDate' => $preferredDate,
    'preferredDays' => $preferredDays,
    'quoteEstimate' => $quoteEstimate,
    'message' => $message,
];

$adminEmail = buildContactAdminEmail($contactEmailPayload);
$clientEmail = buildContactClientEmail($contactEmailPayload);

$adminMailSent = false;
$userMailSent = false;

try {

    $adminMailSent = @mail(
        NOTIFICATION_EMAIL,
        $adminEmail['subject'],
        $adminEmail['body'],
        $adminEmail['headers']
    );

} catch (Throwable $e) {

    error_log(
        'Admin email dispatch failed: ' .
        $e->getMessage()
    );
}

try {

    $userMailSent = @mail(
        $email,
        $clientEmail['subject'],
        $clientEmail['html'],
        $clientEmail['headers']
    );

} catch (Throwable $e) {

    error_log(
        'Client confirmation email dispatch failed: ' .
        $e->getMessage()
    );
}

/*
|--------------------------------------------------------------------------
| Final Response Delivery Verification
|--------------------------------------------------------------------------
|
| ONLY report success when form data has been successfully delivered
| to both the database table AND the preferred company email.
|
*/

if (!$dbSaved || !$adminMailSent) {
    $deliveryFailures = [];
    if (!$dbSaved) {
        $deliveryFailures[] = 'Database table insertion failed';
    }
    if (!$adminMailSent) {
        $deliveryFailures[] = 'Notification email delivery failed';
    }

    error_log(
        'OanK Cleaning contact delivery incomplete: ' .
        implode(', ', $deliveryFailures)
    );

    sendJsonResponse(
        false,
        'Enquiry could not be fully delivered (' . implode(' and ', $deliveryFailures) . '). Please call our team directly at ' . COMPANY_PHONE_PRIMARY . '.',
        [
            'database' => [
                'saved' => $dbSaved,
            ],
            'mail' => [
                'adminSent' => $adminMailSent,
                'clientSent' => $userMailSent,
            ],
        ],
        500
    );
}

sendJsonResponse(
    true,
    "Thank you, {$name}! Your enquiry has been successfully delivered to our team.",
    [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'service' => $service,
        'postcode' => $postcode,
        'preferredDate' => $preferredDate,

        'database' => [
            'saved' => true,
        ],

        'mail' => [
            'adminSent' => true,
            'clientSent' => $userMailSent,
        ],
    ],
    200
);