<?php

declare(strict_types=1);

if (!defined('COMPANY_DOMAIN')) {
    http_response_code(403);
    exit;
}

if (!function_exists('sendDatabaseFailureEmail')) {
    function sendDatabaseFailureEmail(string $subject, string $body): bool
    {
        $safeSubject = safeHeaderValue($subject);

        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . COMPANY_NAME . ' <info@' . COMPANY_DOMAIN . '>',
            'Reply-To: info@' . COMPANY_DOMAIN,
            'X-Mailer: PHP/' . phpversion(),
        ];

        $emailBody = "Database save failed.\n\n"
            . 'Date: ' . date('Y-m-d H:i:s') . "\n"
            . "Subject: {$safeSubject}\n\n"
            . $body . "\n";

        return @mail(
            NOTIFICATION_EMAIL,
            'CRITICAL: Database Failure - ' . $safeSubject,
            $emailBody,
            implode("\r\n", $headers)
        );
    }
}
