<?php

/**
 * OanK Cleaning
 * CORS Middleware & Security Headers
 *
 * Production domain:
 * https://oankcleaning.co.uk
 */

declare(strict_types=1);

// Remove server software disclosure
if (function_exists('header_remove')) {
    header_remove('X-Powered-By');
    header_remove('Server');
}

// Security Headers (OWASP Hardening)
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https:;");

$allowedOrigins = [
    'https://oankcleaning.co.uk',
    'https://www.oankcleaning.co.uk',

    // Development
    'http://localhost:3000',
    'http://localhost:5173',
];

$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($requestOrigin !== '') {

    if (in_array($requestOrigin, $allowedOrigins, true)) {

        header(
            'Access-Control-Allow-Origin: ' . $requestOrigin
        );

        header(
            'Vary: Origin'
        );

        header(
            'Access-Control-Allow-Credentials: true'
        );

    } else {

        http_response_code(403);

        header(
            'Content-Type: application/json; charset=utf-8'
        );

        echo json_encode([
            'success' => false,
            'message' => 'Origin not allowed.',
        ]);

        exit;
    }
}

header(
    'Access-Control-Allow-Methods: POST, OPTIONS'
);

header(
    'Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token'
);

/*
|--------------------------------------------------------------------------
| Handle OPTIONS preflight requests securely
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(204);

    exit;
}