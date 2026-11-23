<?php

declare(strict_types=1);

if (!defined('COMPANY_DOMAIN')) {
    http_response_code(403);
    exit;
}

require_once __DIR__ . '/layout.php';

if (!function_exists('buildQuoteConfirmationEmailHtml')) {
    function buildQuoteConfirmationEmailHtml(array $data): string
    {
        $safeName = oankEsc(trim((string) ($data['name'] ?? 'there')));
        $safeQuoteId = oankEsc(trim((string) ($data['quoteId'] ?? '')));
        $serviceType = trim((string) ($data['serviceType'] ?? ''));
        $frequency = trim((string) ($data['frequency'] ?? 'one-off'));
        $preferredDate = trim((string) ($data['preferredDate'] ?? ''));
        $pricePerVisit = (float) ($data['pricePerVisit'] ?? 0);
        $savingsAmount = (float) ($data['savingsAmount'] ?? 0);

        $serviceNames = [
            'domestic-regular' => 'Regular Home Cleaning',
            'deep-cleaning' => 'Deep & Spring Cleaning',
            'end-of-tenancy' => 'End of Tenancy Cleaning',
            'commercial-office' => 'Office & Commercial Cleaning',
            'healthcare-carehome' => 'Healthcare & Care Home Cleaning',
            'carpet-upholstery' => 'Carpet & Upholstery Cleaning',
        ];
        $serviceLabel = oankEsc($serviceNames[$serviceType] ?? $serviceType);
        $frequencyLabel = oankEsc(ucfirst($frequency));
        $perVisitSuffix = $frequency === 'one-off' ? '' : ' per visit';
        $safePrice = '£' . number_format($pricePerVisit, 2) . $perVisitSuffix;

        $phone = oankEsc(COMPANY_PHONE_PRIMARY);
        $whatsappLink = oankEsc(COMPANY_WHATSAPP_LINK);

        $savingsHtml = '';
        if ($savingsAmount > 0) {
            $safeSavings = '£' . number_format($savingsAmount, 2);
            $savingsHtml = "<p style=\"margin:6px 0 0;font-size:13px;color:#047857;\"><strong>Savings applied:</strong> {$safeSavings}</p>";
        }

        $dateHtml = '';
        if ($preferredDate !== '') {
            $dateHtml = '<p style="margin:6px 0 0;font-size:13px;color:#475569;"><strong>Preferred Date:</strong> ' . oankEsc($preferredDate) . '</p>';
        }

        $bodyHtml = <<<HTML
<p style="font-size:15px;line-height:1.6;margin:0 0 14px;">
    Dear <strong>{$safeName}</strong>,
</p>
<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
    Thank you for requesting a quote with us. Our team will review your details and confirm your final price before booking.
</p>
<div style="background:#f8fafc;border-left:4px solid #0F382C;padding:14px 16px;margin:0 0 18px;border-radius:4px;">
    <p style="margin:0 0 6px;font-size:13px;color:#475569;">
        <strong>Quote Reference:</strong>
        <span style="color:#0F382C;font-weight:bold;">{$safeQuoteId}</span>
    </p>
    <p style="margin:0 0 6px;font-size:13px;color:#475569;">
        <strong>Service:</strong> {$serviceLabel} ({$frequencyLabel})
    </p>
    <p style="margin:0;font-size:13px;color:#475569;">
        <strong>Estimated Price:</strong> {$safePrice}
    </p>
    {$savingsHtml}
    {$dateHtml}
</div>
<p style="margin:0 0 18px;">
    <a href="https://oankcleaning.co.uk/track-job" style="display:inline-block;background:#0F382C;color:#ffffff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:13px;">
        Track your job
    </a>
</p>
<p style="font-size:14px;line-height:1.6;margin:0;">
    Questions? Call <a href="tel:+447731956727" style="color:#0F382C;font-weight:bold;text-decoration:none;">{$phone}</a>
    or <a href="{$whatsappLink}" target="_blank" rel="noopener noreferrer" style="color:#128C7E;font-weight:bold;text-decoration:underline;">message us on WhatsApp</a>.
</p>
HTML;

        return buildOankEmailHtml(
            'Your Quote Estimate - ' . COMPANY_NAME,
            'Your Quote Estimate',
            $bodyHtml
        );
    }
}
