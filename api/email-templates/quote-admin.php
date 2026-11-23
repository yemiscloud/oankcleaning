<?php

declare(strict_types=1);

if (!defined('COMPANY_DOMAIN')) {
    http_response_code(403);
    exit;
}

if (!function_exists('oankFormatQuoteServiceLabel')) {
    function oankFormatQuoteServiceLabel(string $serviceType): string
    {
        $map = [
            'domestic-regular' => 'Regular Home Cleaning',
            'deep-cleaning' => 'Deep & Spring Cleaning',
            'end-of-tenancy' => 'End of Tenancy Cleaning',
            'commercial-office' => 'Office & Commercial Cleaning',
            'healthcare-carehome' => 'Healthcare & Care Home Cleaning',
            'carpet-upholstery' => 'Carpet & Upholstery Cleaning',
        ];

        return $map[$serviceType] ?? $serviceType;
    }
}

if (!function_exists('oankFormatQuotePropertyLabel')) {
    function oankFormatQuotePropertyLabel(string $propertyType): string
    {
        $map = [
            'house' => 'House',
            'flat' => 'Flat',
            'office' => 'Office',
            'commercial' => 'Business / Commercial',
            'residential' => 'Residential',
        ];

        return $map[$propertyType] ?? ucfirst($propertyType);
    }
}

if (!function_exists('buildQuoteAdminEmailText')) {
    function buildQuoteAdminEmailText(array $data): string
    {
        $quoteId = trim((string) ($data['quoteId'] ?? ''));
        $name = trim((string) ($data['name'] ?? ''));
        $email = trim((string) ($data['email'] ?? ''));
        $phone = trim((string) ($data['phone'] ?? ''));
        $propertyType = oankFormatQuotePropertyLabel((string) ($data['propertyType'] ?? ''));
        $serviceLabel = oankFormatQuoteServiceLabel((string) ($data['serviceType'] ?? ''));
        $frequency = trim((string) ($data['frequency'] ?? 'one-off'));
        $numberOfTimes = (int) ($data['numberOfTimes'] ?? 1);
        $bedrooms = (int) ($data['bedrooms'] ?? 0);
        $bathrooms = (int) ($data['bathrooms'] ?? 0);
        $livingRoomDiningRoom = !empty($data['livingRoomDiningRoom']);
        $suppliesCleaningMaterials = !empty($data['suppliesCleaningMaterials']);
        $addOnDescription = trim((string) ($data['addOnDescription'] ?? 'None'));
        $postcode = trim((string) ($data['postcode'] ?? ''));
        $preferredDate = trim((string) ($data['preferredDate'] ?? ''));
        $bestDaysString = trim((string) ($data['bestDaysString'] ?? ''));
        $pricePerVisit = (float) ($data['pricePerVisit'] ?? 0);
        $savingsAmount = (float) ($data['savingsAmount'] ?? 0);
        $finalEstimate = (float) ($data['finalEstimate'] ?? 0);
        $notes = trim((string) ($data['notes'] ?? ''));

        $lines = [
            'New Quote Request',
            '',
            "Quote Reference: {$quoteId}",
            "Client: {$name}",
            "Email: {$email}",
        ];

        if ($phone !== '') {
            $lines[] = "Phone: {$phone}";
        }

        $lines[] = '';
        $lines[] = "Property: {$propertyType}";
        $lines[] = "Service: {$serviceLabel}";
        $lines[] = 'Frequency: ' . ucfirst($frequency) . ($frequency !== 'one-off' ? " ({$numberOfTimes} visits)" : '');
        $lines[] = "Bedrooms / Areas: {$bedrooms}";
        $lines[] = "Bathrooms: {$bathrooms}";
        $lines[] = 'Living / Dining Room: ' . ($livingRoomDiningRoom ? 'Yes (+£26.00)' : 'No');
        $lines[] = 'Own Materials (10% off): ' . ($suppliesCleaningMaterials ? 'Yes' : 'No');

        if ($addOnDescription !== '' && $addOnDescription !== 'None') {
            $lines[] = "Add-ons: {$addOnDescription}";
        }

        if ($postcode !== '') {
            $lines[] = "Postcode: {$postcode}";
        }

        if ($preferredDate !== '') {
            $lines[] = "Preferred Date: {$preferredDate}";
        }

        if ($bestDaysString !== '' && $bestDaysString !== 'Flexible / Any') {
            $lines[] = "Preferred Days: {$bestDaysString}";
        }

        $lines[] = '';
        $lines[] = ($frequency === 'one-off' ? 'Estimated Price: ' : 'Estimated Price Per Visit: ') . '£' . number_format($pricePerVisit, 2);

        if ($numberOfTimes > 1) {
            $lines[] = "Estimated Total ({$numberOfTimes} visits): £" . number_format($finalEstimate, 2);
        }

        if ($savingsAmount > 0) {
            $lines[] = 'Total Savings: £' . number_format($savingsAmount, 2);
        }

        if ($notes !== '') {
            $lines[] = '';
            $lines[] = 'Notes:';
            $lines[] = $notes;
        }

        return implode("\n", $lines) . "\n";
    }
}
