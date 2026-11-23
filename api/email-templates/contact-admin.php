<?php

declare(strict_types=1);

if (!defined('COMPANY_DOMAIN')) {
    http_response_code(403);
    exit;
}

if (!function_exists('buildContactAdminEmailText')) {
    function buildContactAdminEmailText(array $data): string
    {
        $name = trim((string) ($data['name'] ?? ''));
        $email = trim((string) ($data['email'] ?? ''));
        $phone = trim((string) ($data['phone'] ?? ''));
        $service = trim((string) ($data['service'] ?? 'General Cleaning Enquiry'));
        $postcode = trim((string) ($data['postcode'] ?? ''));
        $preferredDate = trim((string) ($data['preferredDate'] ?? ''));
        $preferredDays = trim((string) ($data['preferredDays'] ?? ''));
        $quoteEstimate = $data['quoteEstimate'] ?? null;
        $message = trim((string) ($data['message'] ?? ''));

        $lines = [
            'New Contact Enquiry',
            '',
            "Name: {$name}",
            "Email: {$email}",
        ];

        if ($phone !== '') {
            $lines[] = "Phone: {$phone}";
        }

        $lines[] = "Service: {$service}";

        if ($postcode !== '') {
            $lines[] = "Postcode / Town: {$postcode}";
        }

        if ($preferredDate !== '') {
            $lines[] = "Preferred Date: {$preferredDate}";
        }

        if ($preferredDays !== '') {
            $lines[] = "Preferred Days: {$preferredDays}";
        }

        if ($quoteEstimate !== null && is_numeric($quoteEstimate)) {
            $lines[] = 'Estimated Quote: £' . number_format((float) $quoteEstimate, 2);
        }

        $lines[] = '';
        $lines[] = 'Message:';
        $lines[] = $message;

        return implode("\n", $lines) . "\n";
    }
}
