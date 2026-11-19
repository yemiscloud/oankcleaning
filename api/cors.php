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

// API response security headers (non-competing; frontend CSP, HSTS, and framing remain in root .htaccess)
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Vary: Origin');

if (!defined('APP_ENV') && is_file(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
}

$allowedOrigins = [
    'https://oankcleaning.co.uk',
    'https://www.oankcleaning.co.uk',
];

if (defined('APP_ENV') && APP_ENV === 'development') {
    $allowedOrigins[] = 'http://localhost:3000';
    $allowedOrigins[] = 'http://localhost:5173';
}

$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($requestOrigin !== '') {

    if (in_array($requestOrigin, $allowedOrigins, true)) {

        header(
            'Access-Control-Allow-Origin: ' . $requestOrigin
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

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {

    http_response_code(204);

    exit;
}