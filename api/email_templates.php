<?php

/**
 * OanK Cleaning CIC
 * Centralized Email Templates & Mail Helpers
 *
 * Separation of concerns: all outgoing customer, admin, OTP,
 * and system alert email templates live in this single module.
 */

declare(strict_types=1);

if (basename((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')) === basename(__FILE__)) {
    http_response_code(403);
    exit('Access denied.');
}

if (!function_exists('oankEscHtml')) {
    function oankEscHtml(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('oankFormatPropertyLabel')) {
    function oankFormatPropertyLabel(string $propertyType): string
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

if (!function_exists('oankFormatServiceLabel')) {
    function oankFormatServiceLabel(string $serviceType): string
    {
        $map = [
            'domestic-regular' => 'Regular Home Cleaning',
            'deep-cleaning' => 'Deep Cleaning',
            'end-of-tenancy' => 'End of Tenancy Cleaning',
            'commercial-office' => 'Office & Commercial Cleaning',
            'healthcare-carehome' => 'Healthcare & Care Home Cleaning',
            'carpet-upholstery' => 'Carpet & Upholstery Cleaning',
        ];

        return $map[$serviceType] ?? $serviceType;
    }
}

if (!function_exists('oankFormatFrequencyLabel')) {
    function oankFormatFrequencyLabel(string $frequency): string
    {
        $map = [
            'one-off' => 'One-off',
            'weekly' => 'Weekly',
            'fortnightly' => 'Fortnightly',
            'monthly' => 'Monthly',
        ];

        return $map[$frequency] ?? ucfirst($frequency);
    }
}

if (!function_exists('oankFormatAddOnsLabel')) {
    function oankFormatAddOnsLabel(array $addOns): string
    {
        if ($addOns === []) {
            return 'None';
        }

        $map = [
            'oven' => 'Oven Deep Clean (+£30.00)',
            'carpet' => 'Carpet Steam (+£35.00)',
            'windows' => 'Inside Windows (+£25.00)',
            'fridge' => 'Fridge Clean (+£20.00)',
        ];

        $labels = [];
        foreach ($addOns as $addOn) {
            $labels[] = $map[$addOn] ?? (string) $addOn;
        }

        return implode(', ', $labels);
    }
}

/**
 * Shared responsive HTML shell for customer-facing emails.
 */
if (!function_exists('renderOankEmailLayoutHtml')) {
    function renderOankEmailLayoutHtml(
        string $title,
        string $heading,
        string $bodyHtml
    ): string {
        $safeTitle = oankEscHtml($title);
        $safeHeading = oankEscHtml($heading);
        $companyName = oankEscHtml(COMPANY_NAME);
        $phone = oankEscHtml(COMPANY_PHONE_PRIMARY);
        $year = date('Y');

        return <<<HTML
<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$safeTitle}</title>
</head>
<body style="margin:0;padding:24px 16px;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1e293b;-webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
        <tr>
            <td style="background-color:#0F382C;padding:22px 28px;border-bottom:3px solid #D4AF37;">
                <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;font-family:Georgia,serif;">{$companyName}</p>
            </td>
        </tr>
        <tr>
            <td style="padding:28px;">
                <h1 style="margin:0 0 16px;color:#0F382C;font-size:20px;line-height:1.3;">{$safeHeading}</h1>
                {$bodyHtml}
            </td>
        </tr>
        <tr>
            <td style="background-color:#f8fafc;padding:18px 28px;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.6;color:#64748b;">
                <p style="margin:0;">{$companyName} CIC &bull; Renfrewshire &amp; Glasgow</p>
                <p style="margin:4px 0 0;">
                    <a href="https://oankcleaning.co.uk" style="color:#0F382C;text-decoration:none;">oankcleaning.co.uk</a>
                    &bull;
                    <a href="tel:+447731956727" style="color:#0F382C;text-decoration:none;">{$phone}</a>
                </p>
                <p style="margin:6px 0 0;color:#94a3b8;">&copy; {$year} OANK Cleaning CIC</p>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }
}

/**
 * Standard headers for plain-text internal notifications.
 */
if (!function_exists('buildAdminMailHeaders')) {
    function buildAdminMailHeaders(string $replyToName, string $replyToEmail): string
    {
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'From: OanK Web Portal <no-reply@' . COMPANY_DOMAIN . '>',
            'Reply-To: ' . safeHeaderValue($replyToName) . ' <' . safeHeaderValue($replyToEmail) . '>',
            'Bcc: ' . BACKUP_EMAIL,
            'X-Mailer: PHP/' . phpversion(),
        ];

        return implode("\r\n", $headers);
    }
}

/**
 * Standard headers for HTML customer confirmation emails.
 */
if (!function_exists('buildClientHtmlMailHeaders')) {
    function buildClientHtmlMailHeaders(): string
    {
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'From: OanK Cleaning Team <info@' . COMPANY_DOMAIN . '>',
            'Reply-To: ' . NOTIFICATION_EMAIL,
            'X-Mailer: PHP/' . phpversion(),
        ];

        return implode("\r\n", $headers);
    }
}

/**
 * Contact Form — Admin Notification (no reference code).
 *
 * @return array{subject:string, body:string, headers:string}
 */
if (!function_exists('buildContactAdminEmail')) {
    function buildContactAdminEmail(array $data): array
    {
        $name = (string) ($data['name'] ?? '');
        $email = (string) ($data['email'] ?? '');
        $phone = (string) ($data['phone'] ?? '');
        $service = (string) ($data['service'] ?? 'General Cleaning Enquiry');
        $postcode = (string) ($data['postcode'] ?? '');
        $preferredDate = (string) ($data['preferredDate'] ?? 'Flexible');
        $preferredDays = (string) ($data['preferredDays'] ?? '');
        $quoteEstimate = $data['quoteEstimate'] ?? null;
        $message = (string) ($data['message'] ?? '');

        $subject = 'New Enquiry: ' . safeHeaderValue($service) . ' - ' . safeHeaderValue($name);

        $lines = [
            'New Website Enquiry',
            '',
            'Name: ' . $name,
            'Email: ' . $email,
            'Phone: ' . ($phone !== '' ? $phone : 'Not provided'),
            'Service: ' . $service,
            'Location: ' . ($postcode !== '' ? $postcode : 'Not provided'),
            'Preferred Date: ' . ($preferredDate !== '' ? $preferredDate : 'Flexible'),
        ];

        if ($preferredDays !== '') {
            $lines[] = 'Preferred Days: ' . $preferredDays;
        }

        if ($quoteEstimate !== null && is_numeric($quoteEstimate)) {
            $lines[] = 'Estimated Quote: £' . number_format((float) $quoteEstimate, 2);
        }

        $lines[] = '';
        $lines[] = 'Message:';
        $lines[] = $message;

        return [
            'subject' => $subject,
            'body' => implode("\n", $lines) . "\n",
            'headers' => buildAdminMailHeaders($name, $email),
        ];
    }
}

/**
 * Contact Form — Client Confirmation (no reference code).
 *
 * @return array{subject:string, html:string, headers:string}
 */
if (!function_exists('buildContactClientEmail')) {
    function buildContactClientEmail(array $data): array
    {
        $safeName = oankEscHtml((string) ($data['name'] ?? ''));
        $safeService = oankEscHtml((string) ($data['service'] ?? 'General Cleaning Enquiry'));
        $preferredDateRaw = (string) ($data['preferredDate'] ?? '');
        $safePreferredDate = oankEscHtml($preferredDateRaw !== '' ? $preferredDateRaw : 'Flexible');
        $phone = oankEscHtml(COMPANY_PHONE_PRIMARY);
        $whatsappLink = oankEscHtml(COMPANY_WHATSAPP_LINK);

        $subject = 'We have received your enquiry - ' . COMPANY_NAME;

        $bodyHtml = <<<HTML
<p style="margin:0 0 14px;font-size:15px;line-height:1.6;">Hi {$safeName},</p>
<p style="margin:0 0 18px;font-size:15px;line-height:1.6;">
    Thank you for contacting <strong>OanK Cleaning</strong>. We have received your message and a member of our team will reply shortly.
</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;background-color:#f8fafc;border-left:3px solid #0F382C;border-radius:4px;">
    <tr>
        <td style="padding:14px 16px;font-size:13px;line-height:1.7;color:#475569;">
            <div><strong>Enquiry:</strong> {$safeService}</div>
            <div><strong>Preferred Date:</strong> {$safePreferredDate}</div>
        </td>
    </tr>
</table>
<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">
    Need an urgent update? Call <a href="tel:+447731956727" style="color:#0F382C;font-weight:bold;text-decoration:none;">{$phone}</a>
    or <a href="{$whatsappLink}" target="_blank" rel="noopener noreferrer" style="color:#0F382C;font-weight:bold;text-decoration:underline;">message us on WhatsApp</a>.
</p>
<p style="margin:0;font-size:14px;line-height:1.6;">
    Kind regards,<br>
    <strong>OanK Cleaning Team</strong>
</p>
HTML;

        return [
            'subject' => $subject,
            'html' => renderOankEmailLayoutHtml(
                'Enquiry Received - ' . COMPANY_NAME,
                'Thank you for getting in touch',
                $bodyHtml
            ),
            'headers' => buildClientHtmlMailHeaders(),
        ];
    }
}

/**
 * Quote Request — Admin Notification (includes Quote Reference).
 *
 * @return array{subject:string, body:string, headers:string}
 */
if (!function_exists('buildQuoteAdminEmail')) {
    function buildQuoteAdminEmail(array $data): array
    {
        $quoteId = (string) ($data['quoteId'] ?? '');
        $name = (string) ($data['name'] ?? '');
        $email = (string) ($data['email'] ?? '');
        $phone = (string) ($data['phone'] ?? '');
        $postcode = (string) ($data['postcode'] ?? '');
        $propertyType = oankFormatPropertyLabel((string) ($data['propertyType'] ?? ''));
        $serviceType = oankFormatServiceLabel((string) ($data['serviceType'] ?? ''));
        $frequency = (string) ($data['frequency'] ?? 'one-off');
        $frequencyLabel = oankFormatFrequencyLabel($frequency);
        $bedrooms = (int) ($data['bedrooms'] ?? 0);
        $bathrooms = (int) ($data['bathrooms'] ?? 0);
        $livingRoomDiningRoom = !empty($data['livingRoomDiningRoom']);
        $addOns = is_array($data['addOns'] ?? null) ? $data['addOns'] : [];
        $suppliesMaterials = !empty($data['suppliesCleaningMaterials']);
        $preferredDate = (string) ($data['preferredDate'] ?? 'As soon as possible');
        $bestDays = (string) ($data['bestDays'] ?? 'Flexible / Any');
        $undiscountedPerVisit = (float) ($data['undiscountedPerVisit'] ?? 0.0);
        $pricePerVisit = (float) ($data['pricePerVisit'] ?? 0.0);
        $savingsPerVisit = max(0.0, round($undiscountedPerVisit - $pricePerVisit, 2));
        $frequencyDiscountRate = (float) ($data['frequencyDiscountRate'] ?? 0.0);
        $materialsDiscountRate = (float) ($data['materialsDiscountRate'] ?? 0.0);
        $notes = trim((string) ($data['notes'] ?? ''));

        $subject = 'New Quote Request [' . safeHeaderValue($quoteId) . '] - ' . safeHeaderValue($serviceType);

        $roomLabel = in_array((string) ($data['propertyType'] ?? ''), ['office', 'commercial'], true)
            ? 'Rooms / Workspaces'
            : 'Bedrooms';
        $roomsSummary = "{$bedrooms} {$roomLabel}, {$bathrooms} Bathrooms";
        if ($livingRoomDiningRoom) {
            $roomsSummary .= ', Living / Dining Room (+£26.00)';
        }

        $discountParts = [];
        if ($frequencyDiscountRate > 0) {
            $discountParts[] = rtrim(rtrim(number_format($frequencyDiscountRate, 2), '0'), '.') . '% frequency';
        }
        if ($materialsDiscountRate > 0) {
            $discountParts[] = rtrim(rtrim(number_format($materialsDiscountRate, 2), '0'), '.') . '% own materials';
        }

        $lines = [
            'New Quote Request',
            '',
            'Quote Reference: ' . $quoteId,
            'Client: ' . $name,
            'Email: ' . $email,
            'Phone: ' . ($phone !== '' ? $phone : 'Not provided'),
            'Postcode: ' . ($postcode !== '' ? $postcode : 'Not provided'),
            '',
            'Property: ' . $propertyType,
            'Service: ' . $serviceType,
            'Frequency: ' . $frequencyLabel,
            'Scope: ' . $roomsSummary,
            'Add-ons: ' . oankFormatAddOnsLabel($addOns),
            'Own Materials Supplied: ' . ($suppliesMaterials ? 'Yes (10% discount)' : 'No'),
            'Preferred Date: ' . $preferredDate,
            'Preferred Days: ' . $bestDays,
            '',
            'Estimated Price Per Visit: £' . number_format($pricePerVisit, 2),
        ];

        if ($savingsPerVisit > 0) {
            $lines[] = 'Standard Price Per Visit: £' . number_format($undiscountedPerVisit, 2);
            $discountNote = $discountParts !== [] ? ' (' . implode(', ', $discountParts) . ')' : '';
            $lines[] = 'Customer Savings Per Visit: £' . number_format($savingsPerVisit, 2) . $discountNote;
        }

        if ($notes !== '') {
            $lines[] = '';
            $lines[] = 'Notes:';
            $lines[] = $notes;
        }

        return [
            'subject' => $subject,
            'body' => implode("\n", $lines) . "\n",
            'headers' => buildAdminMailHeaders($name, $email),
        ];
    }
}

/**
 * Quote Request — Client Confirmation (includes Quote Reference & tracking link).
 *
 * @return array{subject:string, html:string, headers:string}
 */
if (!function_exists('buildQuoteClientEmail')) {
    function buildQuoteClientEmail(array $data): array
    {
        $quoteId = (string) ($data['quoteId'] ?? '');
        $safeQuoteId = oankEscHtml($quoteId);
        $safeName = oankEscHtml((string) ($data['name'] ?? ''));
        $serviceLabel = oankFormatServiceLabel((string) ($data['serviceType'] ?? ''));
        $frequency = (string) ($data['frequency'] ?? 'one-off');
        $frequencyLabel = oankFormatFrequencyLabel($frequency);
        $safeServiceSummary = oankEscHtml("{$serviceLabel} ({$frequencyLabel})");
        $safePreferredDate = oankEscHtml((string) ($data['preferredDate'] ?? 'As soon as possible'));

        $pricePerVisit = (float) ($data['pricePerVisit'] ?? 0.0);
        $undiscountedPerVisit = (float) ($data['undiscountedPerVisit'] ?? 0.0);
        $savingsPerVisit = max(0.0, round($undiscountedPerVisit - $pricePerVisit, 2));

        $visitSuffix = $frequency === 'one-off' ? '' : ' per visit';
        $priceHtml = '£' . number_format($pricePerVisit, 2) . $visitSuffix;
        if ($savingsPerVisit > 0) {
            $priceHtml .= ' <span style="display:inline-block;margin-left:6px;padding:2px 8px;background-color:#dcfce7;color:#166534;border-radius:4px;font-size:12px;font-weight:bold;">You save £'
                . number_format($savingsPerVisit, 2) . '</span>';
        }

        $phone = oankEscHtml(COMPANY_PHONE_PRIMARY);
        $whatsappLink = oankEscHtml(COMPANY_WHATSAPP_LINK);

        $subject = 'Your OanK Cleaning Quote Estimate [' . safeHeaderValue($quoteId) . ']';

        $bodyHtml = <<<HTML
<p style="margin:0 0 14px;font-size:15px;line-height:1.6;">Hi {$safeName},</p>
<p style="margin:0 0 18px;font-size:15px;line-height:1.6;">
    Thank you for requesting a quote with <strong>OanK Cleaning</strong>. Our team will review your requirements and contact you shortly to confirm your booking and final price.
</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;background-color:#f8fafc;border-left:3px solid #0F382C;border-radius:4px;">
    <tr>
        <td style="padding:14px 16px;font-size:13px;line-height:1.8;color:#475569;">
            <div><strong>Quote Reference:</strong> <span style="color:#0F382C;font-weight:bold;">{$safeQuoteId}</span></div>
            <div><strong>Service:</strong> {$safeServiceSummary}</div>
            <div><strong>Estimated Price:</strong> <strong style="color:#0F382C;">{$priceHtml}</strong></div>
            <div><strong>Preferred Date:</strong> {$safePreferredDate}</div>
        </td>
    </tr>
</table>
<p style="margin:0 0 16px;">
    <a href="https://oankcleaning.co.uk/track-job" style="display:inline-block;background-color:#0F382C;color:#ffffff;padding:11px 18px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:bold;">Track your quote</a>
</p>
<p style="margin:0 0 16px;font-size:12px;line-height:1.5;color:#64748b;">
    Please keep your quote reference private. If you need to update your request, call <a href="tel:+447731956727" style="color:#0F382C;font-weight:bold;text-decoration:none;">{$phone}</a> or <a href="{$whatsappLink}" target="_blank" rel="noopener noreferrer" style="color:#0F382C;font-weight:bold;text-decoration:underline;">message us on WhatsApp</a>.
</p>
<p style="margin:0;font-size:14px;line-height:1.6;">
    Kind regards,<br>
    <strong>OanK Cleaning Team</strong>
</p>
HTML;

        return [
            'subject' => $subject,
            'html' => renderOankEmailLayoutHtml(
                'Quote Estimate - ' . COMPANY_NAME,
                'Your Quote Estimate',
                $bodyHtml
            ),
            'headers' => buildClientHtmlMailHeaders(),
        ];
    }
}

/**
 * Job Admin OTP Verification Email.
 *
 * @return array{subject:string, body:string, headers:string}
 */
if (!function_exists('buildAdminOtpEmail')) {
    function buildAdminOtpEmail(string $purpose, string $code): array
    {
        $subject = $purpose === 'login'
            ? 'OanK Cleaning admin sign-in code'
            : 'OanK Cleaning delivery confirmation code';

        $body = "Your OanK Cleaning one-time verification code is: {$code}\n\n"
            . "It expires in 10 minutes and can only be used once. "
            . "If you did not request this code, you can ignore this email.\n";

        $headers = implode("\r\n", [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'From: OanK Cleaning <' . NOTIFICATION_EMAIL . '>',
            'X-Mailer: PHP/' . phpversion(),
        ]);

        return [
            'subject' => $subject,
            'body' => $body,
            'headers' => $headers,
        ];
    }
}

/**
 * Critical Database Failure Alert Email.
 */
if (!function_exists('sendDatabaseFailureEmail')) {
    function sendDatabaseFailureEmail(string $subject, string $body): bool
    {
        $safeSubject = 'CRITICAL ALERT: Database Failure - ' . safeHeaderValue($subject);

        $headers = implode("\r\n", [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . COMPANY_NAME . ' <info@' . COMPANY_DOMAIN . '>',
            'Reply-To: info@' . COMPANY_DOMAIN,
            'X-Mailer: PHP/' . phpversion(),
        ]);

        $emailBody = "DATABASE INSERTION FAILURE ALERT\n"
            . "Time: " . date('Y-m-d H:i:s') . "\n\n"
            . $body . "\n";

        return @mail(
            NOTIFICATION_EMAIL,
            $safeSubject,
            $emailBody,
            $headers
        );
    }
}
