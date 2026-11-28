<?php

/**
 * OanK Cleaning
 * Instant Quote Calculation & Booking API
 *
 * Endpoint:
 * POST /api/quote
 *
 * Apache internally routes this to:
 * /backend/api/quote.php
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
| Read Request Body
|--------------------------------------------------------------------------
*/

$rawInput = file_get_contents('php://input');

if ($rawInput === false || trim($rawInput) === '') {

    sendJsonResponse(
        false,
        'No quote request data was received.',
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
| Input Helpers
|--------------------------------------------------------------------------
*/

function getQuoteString(
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

function limitQuoteInput(
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
| Property Type
|--------------------------------------------------------------------------
*/

$allowedPropertyTypes = [
    'house',
    'flat',
    'office',
    'commercial',
    'residential',
];

$rawPropertyType = getQuoteString(
    $input,
    'propertyType',
    ''
);

if ($rawPropertyType !== '' && !in_array($rawPropertyType, $allowedPropertyTypes, true)) {
    sendJsonResponse(
        false,
        'Please select a valid property type (House, Flat, Office, or Business).',
        [],
        400
    );
}

$propertyType = $rawPropertyType;

/*
|--------------------------------------------------------------------------
| Bedrooms
|--------------------------------------------------------------------------
*/

$bedrooms = isset($input['bedrooms'])
    && is_numeric($input['bedrooms'])
    ? (int) $input['bedrooms']
    : 0;

$bedrooms = max(0, min($bedrooms, 20));

/*
|--------------------------------------------------------------------------
| Bathrooms
|--------------------------------------------------------------------------
*/

$bathrooms = isset($input['bathrooms'])
    && is_numeric($input['bathrooms'])
    ? (int) $input['bathrooms']
    : 0;

$bathrooms = max(0, min($bathrooms, 20));

/*
|--------------------------------------------------------------------------
| Service Type
|--------------------------------------------------------------------------
*/

$allowedServiceTypes = [
    'domestic-regular',
    'deep-cleaning',
    'end-of-tenancy',
    'commercial-office',
    'healthcare-carehome',
    'carpet-upholstery',
];

$serviceType = getQuoteString(
    $input,
    'serviceType',
    'domestic-regular'
);

if (!in_array($serviceType, $allowedServiceTypes, true)) {

    sendJsonResponse(
        false,
        'Please select a valid cleaning service.',
        [],
        400
    );
}

/*
|--------------------------------------------------------------------------
| Frequency
|--------------------------------------------------------------------------
*/

$allowedFrequencies = [
    'one-off',
    'weekly',
    'fortnightly',
    'monthly',
];

$frequency = getQuoteString(
    $input,
    'frequency',
    'one-off'
);

if (!in_array($frequency, $allowedFrequencies, true)) {

    sendJsonResponse(
        false,
        'Please select a valid cleaning frequency.',
        [],
        400
    );
}

$frequencyCount = 1;
if ($frequency !== 'one-off') {
    $rawCount = isset($input['frequencyCount']) && is_numeric($input['frequencyCount'])
        ? (int) $input['frequencyCount']
        : 1;
    $frequencyCount = max(1, min($rawCount, 104));
}

/*
|--------------------------------------------------------------------------
| Add-ons
|--------------------------------------------------------------------------
*/

$allowedAddOns = [
    'oven',
    'carpet',
    'windows',
    'fridge',
];

$addOns = [];

if (isset($input['addOns']) && is_array($input['addOns'])) {

    foreach ($input['addOns'] as $addOn) {

        if (
            is_string($addOn)
            && in_array($addOn, $allowedAddOns, true)
        ) {
            $addOns[] = $addOn;
        }
    }
}

$addOns = array_values(
    array_unique($addOns)
);

/*
|--------------------------------------------------------------------------
| Room selection and customer-supplied materials discount
|--------------------------------------------------------------------------
*/

$livingRoomDiningRoom = isset($input['livingRoomDiningRoom'])
    && ($input['livingRoomDiningRoom'] === true || $input['livingRoomDiningRoom'] === 1 || $input['livingRoomDiningRoom'] === '1');

$suppliesCleaningMaterials = isset($input['suppliesCleaningMaterials'])
    && ($input['suppliesCleaningMaterials'] === true || $input['suppliesCleaningMaterials'] === 1 || $input['suppliesCleaningMaterials'] === '1');

$livingRoomDiningRoomCharge = $livingRoomDiningRoom ? 26.00 : 0.00;
$materialsDiscountRate = $suppliesCleaningMaterials ? 10.00 : 0.00;

/*
|--------------------------------------------------------------------------
| Customer Information
|--------------------------------------------------------------------------
*/

$name = limitQuoteInput(
    getQuoteString($input, 'name'),
    255
);

$email = limitQuoteInput(
    getQuoteString($input, 'email'),
    255
);

$phone = limitQuoteInput(
    getQuoteString($input, 'phone'),
    50
);

$postcode = limitQuoteInput(
    getQuoteString(
        $input,
        'postcode',
        ''
    ),
    50
);

$preferredDate = limitQuoteInput(
    getQuoteString(
        $input,
        'preferredDate',
        'As soon as possible'
    ),
    100
);

if ($preferredDate === '') {
    $preferredDate = 'As soon as possible';
}

$notes = limitQuoteInput(
    getQuoteString($input, 'notes'),
    5000
);

/*
|--------------------------------------------------------------------------
| Preferred Days
|--------------------------------------------------------------------------
*/

$bestDays = [];
if (isset($input['bestDays']) && is_array($input['bestDays'])) {
    foreach ($input['bestDays'] as $day) {
        if (is_string($day)) {
            $cleanedDay = limitQuoteInput(trim($day), 50);
            if ($cleanedDay !== '') {
                $bestDays[] = $cleanedDay;
            }
        }
    }
}
$bestDaysString = empty($bestDays) ? 'Flexible / Any' : implode(', ', $bestDays);

/*
|--------------------------------------------------------------------------
| Authoritative Quote Calculation (Aligned with Frontend QuoteCalculator)
|--------------------------------------------------------------------------
*/

$priceGuidance = [
    'domestic-regular' => 'From £18.50 per hour',
    'deep-cleaning' => 'From £85 one-off',
    'end-of-tenancy' => 'From £125 per package',
    'commercial-office' => 'From £19.50 per hour on contract',
    'healthcare-carehome' => 'Custom quote',
    'carpet-upholstery' => 'From £45 per room',
];

$basePrices = [
    'domestic-regular' => ($propertyType === 'house' ? 10.00 : 0.00),
    'deep-cleaning' => 85.00,
    'end-of-tenancy' => 125.00,
    'commercial-office' => 50.00,
    'healthcare-carehome' => 95.00,
    'carpet-upholstery' => 50.00,
];

$frequencyDiscounts = [
    'one-off' => 0.00,
    'weekly' => 0.15,
    'fortnightly' => 0.10,
    'monthly' => 0.05,
];

$addOnPrices = [
    'oven' => 30.00,
    'carpet' => 35.00,
    'windows' => 25.00,
    'fridge' => 20.00,
];

$priceDisplay = $priceGuidance[$serviceType];
$baseRate = $basePrices[$serviceType] ?? 0.00;
$bedroomRate = in_array($propertyType, ['office', 'commercial'], true) ? 22.00 : 18.50;
$bedroomCharge = $bedrooms * $bedroomRate;
$bathroomCharge = $bathrooms * 12.00;

$addOnsTotal = 0.00;
foreach ($addOns as $addOn) {
    $addOnsTotal += $addOnPrices[$addOn] ?? 0.00;
}

$undiscountedPerVisit = round(
    $baseRate + $bedroomCharge + $bathroomCharge + $addOnsTotal + $livingRoomDiningRoomCharge,
    2
);

$frequencyDiscountFraction = $frequencyDiscounts[$frequency] ?? 0.00;
$frequencyDiscountRate = round($frequencyDiscountFraction * 100, 2);

$discountedPerVisit = $undiscountedPerVisit * (1 - $frequencyDiscountFraction);
if ($suppliesCleaningMaterials) {
    $discountedPerVisit *= 0.90;
}

$pricePerVisit = round($discountedPerVisit, 2);
$numberOfTimes = $frequency === 'one-off' ? 1 : $frequencyCount;

$finalEstimate = round($pricePerVisit * $numberOfTimes, 2);
$originalEstimate = round($undiscountedPerVisit * $numberOfTimes, 2);
$savingsAmount = round(max(0.00, $originalEstimate - $finalEstimate), 2);
$subtotal = $originalEstimate;
$discountRate = $frequencyDiscountRate;
$discountAmount = $savingsAmount;

/*
|--------------------------------------------------------------------------
| Generate Quote ID
|--------------------------------------------------------------------------
*/

$quoteId = generateSecureJobReference();

/*
|--------------------------------------------------------------------------
| Customer Submission Validation
|--------------------------------------------------------------------------
|
| Customer details are mandatory for quote requests. Pricing is calculated
| internally for Admin review only and is never returned to the client.
|
*/

if ($rawPropertyType === '') {
    sendJsonResponse(
        false,
        'Please select a property type (House, Flat, Office, or Business).',
        [],
        400
    );
}

if ($name === '' || $email === '') {
    sendJsonResponse(
        false,
        'Please provide your full name and email address to submit your quote request.',
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

$hasCustomerDetails = true;

/*
|--------------------------------------------------------------------------
| Database & Email Status
|--------------------------------------------------------------------------
*/

$dbSaved = false;
$adminMailSent = false;
$userMailSent = false;

/*
|--------------------------------------------------------------------------
| Save Quote Request
|--------------------------------------------------------------------------
*/

if ($hasCustomerDetails) {

    $addOnDescription = empty($addOns)
        ? 'None'
        : implode(', ', $addOns);

    $frequencyLabel = $frequency;

    $quoteMessage =
        "Property Type: {$propertyType}\n"
        . "Bedrooms: {$bedrooms}\n"
        . "Bathrooms: {$bathrooms}\n"
        . "Service Type: {$serviceType}\n"
        . "Frequency: {$frequencyLabel}\n"
        . "Price guidance: {$priceDisplay}\n"
        . "Standard Total (before discount): £" . number_format($originalEstimate, 2) . "\n"
        . "Frequency Discount: {$frequencyDiscountRate}%\n"
        . "Materials Discount: {$materialsDiscountRate}%\n"
        . "Price Per Visit: £" . number_format($pricePerVisit, 2) . "\n"
        . "Number of Visits: {$numberOfTimes}\n"
        . "Estimated Total to Pay: £" . number_format($finalEstimate, 2) . "\n"
        . "Total Savings: £" . number_format($savingsAmount, 2) . "\n"
        . "Final quote: To be confirmed by OANK after reviewing the requested scope.\n"
        . "Preferred Days: {$bestDaysString}\n"
        . "Add-ons: {$addOnDescription}\n"
        . "Living room/dining room: " . ($livingRoomDiningRoom ? 'Yes (+£26.00)' : 'No') . "\n"
        . "Customer supplying cleaning materials/equipment: " . ($suppliesCleaningMaterials ? 'Yes (10% discount applies)' : 'No') . "\n"
        . "Notes: " . ($notes !== '' ? $notes : 'None');

    $dbSaved = saveSubmissionToDb([
        'referenceNo' => $quoteId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone !== '' ? $phone : null,
        'service' => "Quote: {$serviceType} ({$frequencyLabel})",
        'postcode' => $postcode,
        'preferredDate' => $preferredDate,
        'message' => $quoteMessage,
        'quoteEstimate' => $finalEstimate,
        'originalEstimate' => $originalEstimate,
        'savingsAmount' => $savingsAmount,
        'pricePerVisit' => $pricePerVisit,
        'propertyType' => $propertyType,
        'bedrooms' => $bedrooms,
        'bathrooms' => $bathrooms,
        'frequency' => $frequency,
        'frequencyCount' => $numberOfTimes,
        'frequencyDiscountRate' => $frequencyDiscountRate,
        'addOns' => $addOnDescription,
        'preferredDays' => $bestDaysString,
        'livingRoomDiningRoom' => $livingRoomDiningRoom,
        'materialsDiscountRate' => $materialsDiscountRate,
        'status' => 'Pending',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Do not continue pretending the quote was submitted if database
    | storage failed.
    |--------------------------------------------------------------------------
    */

    if (!$dbSaved) {

        error_log(
            "OanK Cleaning quote could not be saved to database. Attempting email fallback. "
            . "Quote ID: {$quoteId}"
        );

        $emailBody = "Quote ID: {$quoteId}\nClient: {$name}\nEmail: {$email}\nMessage: {$quoteMessage}";
        
        sendDatabaseFailureEmail(
            "Quote Request Failure - Quote ID: {$quoteId}",
            $emailBody
        );

        sendJsonResponse(
            false,
            'We encountered a temporary issue saving your quote request, but it has been emailed to our team. We will be in touch shortly.',
            [],
            500
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Build & Send Quote Emails via Centralized Templates
    |--------------------------------------------------------------------------
    */

    $quoteEmailPayload = [
        'quoteId' => $quoteId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'postcode' => $postcode,
        'propertyType' => $propertyType,
        'serviceType' => $serviceType,
        'frequency' => $frequency,
        'numberOfTimes' => $numberOfTimes,
        'bedrooms' => $bedrooms,
        'bathrooms' => $bathrooms,
        'livingRoomDiningRoom' => $livingRoomDiningRoom,
        'addOns' => $addOns,
        'suppliesCleaningMaterials' => $suppliesCleaningMaterials,
        'preferredDate' => $preferredDate,
        'bestDays' => $bestDaysString,
        'baseRate' => $baseRate,
        'bedroomCharge' => $bedroomCharge,
        'bathroomCharge' => $bathroomCharge,
        'addOnsTotal' => $addOnsTotal,
        'livingRoomDiningRoomCharge' => $livingRoomDiningRoomCharge,
        'undiscountedPerVisit' => $undiscountedPerVisit,
        'pricePerVisit' => $pricePerVisit,
        'finalEstimate' => $finalEstimate,
        'savingsAmount' => $savingsAmount,
        'frequencyDiscountRate' => $frequencyDiscountRate,
        'materialsDiscountRate' => $materialsDiscountRate,
        'notes' => $notes,
    ];

    $adminEmail = buildQuoteAdminEmail($quoteEmailPayload);
    $clientEmail = buildQuoteClientEmail($quoteEmailPayload);

    try {

        $adminMailSent = @mail(
            NOTIFICATION_EMAIL,
            $adminEmail['subject'],
            $adminEmail['body'],
            $adminEmail['headers']
        );

    } catch (Throwable $e) {

        error_log(
            'Quote admin email dispatch failed: '
            . $e->getMessage()
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
            'Quote client email dispatch failed: '
            . $e->getMessage()
        );
    }
}

/*
|--------------------------------------------------------------------------
| Final API Response
|--------------------------------------------------------------------------
*/

$responseData = [
    'quoteId' => $quoteId,
    'referenceNo' => $quoteId,

    'propertyType' => $propertyType,
    'bedrooms' => $bedrooms,
    'bathrooms' => $bathrooms,
    'serviceType' => $serviceType,
    'frequency' => $frequency,
    'frequencyCount' => $numberOfTimes,
    'addOns' => $addOns,
    'livingRoomDiningRoom' => $livingRoomDiningRoom,
    'suppliesCleaningMaterials' => $suppliesCleaningMaterials,

    'submission' => [
        'submitted' => true,
        'databaseSaved' => $dbSaved,
        'mail' => [
            'adminSent' => $adminMailSent,
            'clientSent' => $userMailSent,
        ],
    ],
];

if (!$dbSaved || !$adminMailSent) {
    $deliveryFailures = [];
    if (!$dbSaved) {
        $deliveryFailures[] = 'Database table insertion failed';
    }
    if (!$adminMailSent) {
        $deliveryFailures[] = 'Notification email delivery failed';
    }

    error_log(
        "OanK Cleaning quote delivery incomplete [{$quoteId}]: " .
        implode(', ', $deliveryFailures)
    );

    sendJsonResponse(
        false,
        'Quote request could not be fully delivered (' . implode(' and ', $deliveryFailures) . '). Please call our team directly at ' . COMPANY_PHONE_PRIMARY . '.',
        $responseData,
        500
    );
}

sendJsonResponse(
    true,
    "Your quote request [{$quoteId}] has been successfully received by our team. We will review your requirements and send you a tailored quote shortly.",
    $responseData,
    200
);