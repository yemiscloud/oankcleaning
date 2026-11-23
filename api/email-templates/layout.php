<?php

declare(strict_types=1);

if (!defined('COMPANY_DOMAIN')) {
    http_response_code(403);
    exit;
}

if (!function_exists('oankEsc')) {
    function oankEsc(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('buildOankEmailHtml')) {
    function buildOankEmailHtml(string $title, string $heading, string $bodyHtml): string
    {
        $companyName = oankEsc(COMPANY_NAME);
        $safeTitle = oankEsc($title);
        $safeHeading = oankEsc($heading);
        $year = date('Y');

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$safeTitle}</title>
</head>
<body style="margin:0;padding:20px;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#334155;">
    <div style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#0F382C;padding:22px 28px;border-bottom:3px solid #D4AF37;">
            <h1 style="color:#ffffff;margin:0;font-size:20px;font-family:Georgia,serif;">{$companyName}</h1>
        </div>

        <div style="padding:26px 28px;">
            <h2 style="color:#0F382C;margin:0 0 16px;font-size:18px;">{$safeHeading}</h2>
            {$bodyHtml}
            <p style="font-size:14px;line-height:1.6;margin:22px 0 0;">
                Kind regards,<br>
                <strong>The {$companyName} Team</strong>
            </p>
        </div>

        <div style="background:#f8fafc;padding:14px 28px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
            &copy; {$year} {$companyName} CIC &bull; Renfrewshire &amp; Glasgow
        </div>
    </div>
</body>
</html>
HTML;
    }
}
