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
        'Paisley PA3 2PJ'
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
| Generate Reference Number
|--------------------------------------------------------------------------
*/

$referenceNo = 'OANK-' . random_int(
    100000,
    999999
);

/*
|--------------------------------------------------------------------------
| Save To Database
|--------------------------------------------------------------------------
*/

$dbMessage = $preferredDays !== ''
    ? "Preferred Days: {$preferredDays}\n\n{$message}"
    : $message;

$dbSaved = saveSubmissionToDb([
    'referenceNo' => $referenceNo,
    'name' => $name,
    'email' => $email,
    'phone' => $phone !== '' ? $phone : null,
    'service' => $service,
    'postcode' => $postcode,
    'preferredDate' => $preferredDate,
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
        "OanK Cleaning contact enquiry could not be saved. "
        . "Reference: {$referenceNo}"
    );

    sendJsonResponse(
        false,
        'We were unable to securely record your enquiry. Please try again or contact us directly.',
        [],
        500
    );
}

/*
|--------------------------------------------------------------------------
| Admin Notification Email
|--------------------------------------------------------------------------
*/

$adminSubject =
    'New OanK Cleaning Enquiry [' .
    safeHeaderValue($referenceNo) .
    '] - ' .
    safeHeaderValue($service);

$adminEmailBody = '';
$adminEmailBody .= "==========================================\n";
$adminEmailBody .= " OANK CLEANING - CLIENT ENQUIRY FORM\n";
$adminEmailBody .= " A Subsidiary of Ohkay Limited\n";
$adminEmailBody .= "==========================================\n\n";

$adminEmailBody .=
    "Reference ID: {$referenceNo}\n";

$adminEmailBody .=
    "Full Name: {$name}\n";

$adminEmailBody .=
    "Email: {$email}\n";

$adminEmailBody .=
    "Phone: " .
    ($phone !== '' ? $phone : 'Not provided') .
    "\n";

$adminEmailBody .=
    "Service Requested: {$service}\n";

$adminEmailBody .=
    "Postcode / Location: {$postcode}\n";

$adminEmailBody .=
    "Preferred Date: {$preferredDate}\n";

if ($preferredDays !== '') {
    $adminEmailBody .=
        "Preferred Days: {$preferredDays}\n";
}

if ($quoteEstimate !== null) {

    $adminEmailBody .=
        'Estimated Quote: £' .
        number_format($quoteEstimate, 2) .
        "\n";
}

$adminEmailBody .= "\nClient Message:\n";
$adminEmailBody .= $message . "\n\n";

$adminEmailBody .= "------------------------------------------\n";

$adminEmailBody .=
    'Location: ' .
    COMPANY_ADDRESS .
    "\n";

$adminEmailBody .=
    'Phone Support: ' .
    COMPANY_PHONE_PRIMARY .
    ' / ' .
    COMPANY_PHONE_SECONDARY .
    "\n";

$adminEmailBody .=
    'WhatsApp: ' .
    COMPANY_WHATSAPP_LINK .
    "\n";

/*
|--------------------------------------------------------------------------
| Admin Headers
|--------------------------------------------------------------------------
*/

$adminHeaders = [];

$adminHeaders[] =
    'From: OanK Web Portal <no-reply@' .
    COMPANY_DOMAIN .
    '>';

$adminHeaders[] =
    'Reply-To: ' .
    safeHeaderValue($name) .
    ' <' .
    safeHeaderValue($email) .
    '>';

$adminHeaders[] =
    'Bcc: ' .
    BACKUP_EMAIL;

$adminHeaders[] =
    'X-Mailer: PHP/' .
    phpversion();

$adminHeadersString =
    implode("\r\n", $adminHeaders);

/*
|--------------------------------------------------------------------------
| Client Confirmation Email
|--------------------------------------------------------------------------
*/

$userSubject =
    'Enquiry Received [' .
    safeHeaderValue($referenceNo) .
    '] - OanK Cleaning Team';

$userHtml = buildUserConfirmationEmailHtml(
    $name,
    $referenceNo,
    $service,
    $preferredDate
);

$userHeaders = [];

$userHeaders[] =
    'MIME-Version: 1.0';

$userHeaders[] =
    'Content-Type: text/html; charset=UTF-8';

$userHeaders[] =
    'From: OanK Cleaning Team <info@' .
    COMPANY_DOMAIN .
    '>';

$userHeaders[] =
    'Reply-To: info@' .
    COMPANY_DOMAIN;

$userHeaders[] =
    'X-Mailer: PHP/' .
    phpversion();

$userHeadersString =
    implode("\r\n", $userHeaders);

/*
|--------------------------------------------------------------------------
| Send Emails
|--------------------------------------------------------------------------
*/

$adminMailSent = false;
$userMailSent = false;

try {

    $adminMailSent = @mail(
        NOTIFICATION_EMAIL,
        $adminSubject,
        $adminEmailBody,
        $adminHeadersString
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
        $userSubject,
        $userHtml,
        $userHeadersString
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
        "OanK Cleaning delivery incomplete [{$referenceNo}]: " .
        implode(', ', $deliveryFailures)
    );

    sendJsonResponse(
        false,
        'Enquiry could not be fully delivered (' . implode(' and ', $deliveryFailures) . '). Please call our team directly at ' . COMPANY_PHONE_PRIMARY . '.',
        [
            'referenceNo' => $referenceNo,
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
    "Thank you, {$name}! Your enquiry [{$referenceNo}] has been successfully delivered to our team ",
    [
        'referenceNo' => $referenceNo,
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