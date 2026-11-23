<?php

declare(strict_types=1);

if (!defined('COMPANY_DOMAIN')) {
    http_response_code(403);
    exit;
}

require_once __DIR__ . '/layout.php';

if (!function_exists('buildContactConfirmationEmailHtml')) {
    function buildContactConfirmationEmailHtml(array $data): string
    {
        $safeName = oankEsc(trim((string) ($data['name'] ?? 'there')));
        $service = trim((string) ($data['service'] ?? 'General Cleaning Enquiry'));
        $preferredDate = trim((string) ($data['preferredDate'] ?? ''));
        $phone = oankEsc(COMPANY_PHONE_PRIMARY);
        $whatsappLink = oankEsc(COMPANY_WHATSAPP_LINK);

        $detailsRows = '<p style="margin:0;font-size:13px;color:#475569;"><strong>Service:</strong> ' . oankEsc($service) . '</p>';
        if ($preferredDate !== '') {
            $detailsRows .= '<p style="margin:6px 0 0;font-size:13px;color:#475569;"><strong>Preferred Date:</strong> ' . oankEsc($preferredDate) . '</p>';
        }

        $bodyHtml = <<<HTML
<p style="font-size:15px;line-height:1.6;margin:0 0 14px;">
    Dear <strong>{$safeName}</strong>,
</p>
<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
    Thank you for contacting us. We have received your message and a member of our team will respond shortly.
</p>
<div style="background:#f8fafc;border-left:4px solid #0F382C;padding:12px 16px;margin:0 0 18px;border-radius:4px;">
    {$detailsRows}
</div>
<p style="font-size:14px;line-height:1.6;margin:0;">
    Need a quicker reply? Call <a href="tel:+447731956727" style="color:#0F382C;font-weight:bold;text-decoration:none;">{$phone}</a>
    or <a href="{$whatsappLink}" target="_blank" rel="noopener noreferrer" style="color:#128C7E;font-weight:bold;text-decoration:underline;">message us on WhatsApp</a>.
</p>
HTML;

        return buildOankEmailHtml(
            'Enquiry Received - ' . COMPANY_NAME,
            'We Received Your Enquiry',
            $bodyHtml
        );
    }
}
