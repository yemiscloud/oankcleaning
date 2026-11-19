<?php

/**
 * OanK Cleaning
 * CSP Violation Report Collector
 *
 * Endpoint:
 * POST /api/csp-report
 *
 * Receives browser Content Security Policy violation reports
 * (application/csp-report and application/reports+json) and logs
 * sanitised diagnostic metadata to the server error log.
 */

declare(strict_types=1);

if (function_exists('header_remove')) {
    header_remove('X-Powered-By');
    header_remove('Server');
}

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, private');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit;
}

$contentType = strtolower(trim(explode(';', (string)($_SERVER['CONTENT_TYPE'] ?? ''))[0]));
$allowedContentTypes = [
    'application/csp-report',
    'application/reports+json',
    'application/json',
];

if (!in_array($contentType, $allowedContentTypes, true)) {
    http_response_code(415);
    exit;
}

$maxBytes = 16384;
$rawBody = file_get_contents('php://input', false, null, 0, $maxBytes + 1);

if ($rawBody === false || strlen($rawBody) > $maxBytes) {
    http_response_code(413);
    exit;
}

if (trim($rawBody) === '') {
    http_response_code(400);
    exit;
}

$decoded = json_decode($rawBody, true);
if (!is_array($decoded)) {
    http_response_code(400);
    exit;
}

$cleanText = static function (mixed $value, int $maxLength = 300): string {
    if (!is_scalar($value)) {
        return '';
    }
    $sanitised = preg_replace('/[\x00-\x1F\x7F]+/', ' ', (string)$value) ?? '';
    return substr(trim($sanitised), 0, $maxLength);
};

$extractEntry = static function (array $payload) use ($cleanText): array {
    // Legacy application/csp-report wraps fields under "csp-report".
    if (isset($payload['csp-report']) && is_array($payload['csp-report'])) {
        $r = $payload['csp-report'];
        return [
            'document' => $cleanText($r['document-uri'] ?? ''),
            'directive' => $cleanText($r['effective-directive'] ?? ($r['violated-directive'] ?? ''), 100),
            'blocked' => $cleanText($r['blocked-uri'] ?? ''),
            'source' => $cleanText($r['source-file'] ?? ''),
            'line' => isset($r['line-number']) && is_numeric($r['line-number']) ? (int)$r['line-number'] : null,
            'disposition' => $cleanText($r['disposition'] ?? 'enforce', 40),
        ];
    }

    // Reporting API v1 (application/reports+json) sends an array of report objects with "body".
    $body = isset($payload['body']) && is_array($payload['body']) ? $payload['body'] : $payload;
    return [
        'document' => $cleanText($body['documentURL'] ?? ($payload['url'] ?? '')),
        'directive' => $cleanText($body['effectiveDirective'] ?? '', 100),
        'blocked' => $cleanText($body['blockedURL'] ?? ''),
        'source' => $cleanText($body['sourceFile'] ?? ''),
        'line' => isset($body['lineNumber']) && is_numeric($body['lineNumber']) ? (int)$body['lineNumber'] : null,
        'disposition' => $cleanText($body['disposition'] ?? 'enforce', 40),
    ];
};

$reports = array_is_list($decoded) ? array_slice($decoded, 0, 10) : [$decoded];
$entries = [];

foreach ($reports as $item) {
    if (is_array($item)) {
        $entries[] = $extractEntry($item);
    }
}

if ($entries !== []) {
    error_log('[OANK CSP Report] ' . json_encode($entries, JSON_UNESCAPED_SLASHES));
}

http_response_code(204);
exit;
