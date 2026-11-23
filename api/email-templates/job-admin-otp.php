<?php

declare(strict_types=1);

if (!defined('COMPANY_DOMAIN')) {
    http_response_code(403);
    exit;
}

if (!function_exists('buildJobAdminOtpEmail')) {
    function buildJobAdminOtpEmail(string $purpose, string $code): array
    {
        $subject = $purpose === 'login'
            ? 'OANK Cleaning admin sign-in code'
            : 'OANK Cleaning delivery confirmation code';

        $body = "Your OANK Cleaning one-time code is: {$code}\n\n"
            . "It expires in 10 minutes and can only be used once. If you did not request it, ignore this email.\n";

        return [
            'subject' => $subject,
            'body' => $body,
        ];
    }
}
