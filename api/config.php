<?php
/**
 * OanK Cleaning
 * Global PHP Configuration
 *
 * Subsidiary of Ohkay Limited.
 *
 * Private environment file:
 * /home/oankxyju/.env_variables/oank.env
 */

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| PHP Error Configuration
|--------------------------------------------------------------------------
|
| Errors are logged on the server.
| Detailed errors are never displayed to visitors in production.
|
*/

ini_set('log_errors', '1');
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');

error_reporting(E_ALL);

/*
|--------------------------------------------------------------------------
| Application Logging
|--------------------------------------------------------------------------
*/

if (!function_exists('oankLog')) {
    function oankLog(
        string $message,
        string $level = 'INFO',
        array $context = []
    ): void {
        $allowedLevels = [
            'DEBUG',
            'INFO',
            'WARNING',
            'ERROR',
            'CRITICAL',
        ];

        if (!in_array($level, $allowedLevels, true)) {
            $level = 'INFO';
        }

        // Do not write credentials, passwords or tokens to logs.
        $sensitiveKeys = [
            'password',
            'db_pass',
            'db_password',
            'secret',
            'token',
            'api_key',
            'authorization',
            'cookie',
        ];

        foreach ($context as $key => $value) {
            if (
                in_array(
                    strtolower((string) $key),
                    $sensitiveKeys,
                    true
                )
            ) {
                $context[$key] = '[REDACTED]';
            }
        }

        $entry = sprintf(
            '[OanK Cleaning] [%s] [%s] %s',
            date('Y-m-d H:i:s'),
            $level,
            $message
        );

        if ($context !== []) {
            $encoded = json_encode(
                $context,
                JSON_UNESCAPED_SLASHES
                | JSON_INVALID_UTF8_SUBSTITUTE
            );

            if ($encoded !== false) {
                $entry .= ' | Context: ' . $encoded;
            }
        }

        error_log($entry);
    }
}

/*
|--------------------------------------------------------------------------
| Browser Console Diagnostics
|--------------------------------------------------------------------------
|
| Console messages are returned only when debug mode is enabled.
| Never place credentials or private server information in this output.
|
*/

if (!function_exists('oankConsoleLog')) {
    function oankConsoleLog(
        string $message,
        array $context = []
    ): void {
        if (!defined('APP_DEBUG') || APP_DEBUG !== true) {
            return;
        }

        $safeContext = [];

        foreach ($context as $key => $value) {
            if (
                preg_match(
                    '/password|secret|token|credential|authorization|api.?key/i',
                    (string) $key
                )
            ) {
                $safeContext[$key] = '[REDACTED]';
                continue;
            }

            if (
                is_string($value)
                || is_numeric($value)
                || is_bool($value)
                || $value === null
            ) {
                $safeContext[$key] = $value;
            }
        }

        $json = json_encode(
            [
                'source' => 'OanK Cleaning',
                'message' => $message,
                'context' => $safeContext,
            ],
            JSON_HEX_TAG
            | JSON_HEX_APOS
            | JSON_HEX_QUOT
            | JSON_HEX_AMP
            | JSON_INVALID_UTF8_SUBSTITUTE
        );

        if ($json !== false) {
            error_log('[OanK Browser Debug] ' . $json);
        }
    }
}

/*
|--------------------------------------------------------------------------
| Load Private Environment Variables
|--------------------------------------------------------------------------
*/

$envPaths = [
    dirname(__DIR__, 2) . '/.env_variables/oank.env',
    '/home/oankxyju/.env_variables/oank.env',
];

$envLoaded = false;
$selectedEnvPath = null;

foreach ($envPaths as $envPath) {
    if (!is_file($envPath) || !is_readable($envPath)) {
        continue;
    }

    $lines = file(
        $envPath,
        FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES
    );

    if ($lines === false) {
        oankLog(
            'Unable to read environment file.',
            'ERROR'
        );

        continue;
    }

    foreach ($lines as $line) {
        $line = trim($line);

        if ($line === '' || $line[0] === '#') {
            continue;
        }

        if (strncmp($line, 'export ', 7) === 0) {
            $line = trim(substr($line, 7));
        }

        if (strpos($line, '=') === false) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);

        $key = trim($key);
        $value = trim($value);

        if (
            !preg_match(
                '/^[A-Za-z_][A-Za-z0-9_]*$/',
                $key
            )
        ) {
            continue;
        }

        if (
            strlen($value) >= 2
            && (
                ($value[0] === '"' && substr($value, -1) === '"')
                || ($value[0] === "'" && substr($value, -1) === "'")
            )
        ) {
            $value = substr($value, 1, -1);
        }

        // Existing hosting environment values take precedence.
        if (
            getenv($key) !== false
            || array_key_exists($key, $_ENV)
        ) {
            continue;
        }

        putenv($key . '=' . $value);
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }

    $envLoaded = true;
    $selectedEnvPath = $envPath;

    // Stop after loading the first readable environment file.
    break;
}

if ($envLoaded) {
    oankLog(
        'Environment file loaded successfully.',
        'INFO',
        [
            'file_exists' => true,
            'file_readable' => true,
        ]
    );
} else {
    oankLog(
        'No readable environment file was found.',
        'CRITICAL'
    );
}

/*
|--------------------------------------------------------------------------
| Environment Variable Helper
|--------------------------------------------------------------------------
*/

if (!function_exists('appEnv')) {
    function appEnv(
        string $key,
        string $default = ''
    ): string {
        $value = getenv($key);

        if ($value !== false) {
            return (string) $value;
        }

        if (array_key_exists($key, $_ENV)) {
            return (string) $_ENV[$key];
        }

        if (array_key_exists($key, $_SERVER)) {
            return (string) $_SERVER[$key];
        }

        return $default;
    }
}

/*
|--------------------------------------------------------------------------
| Application Settings
|--------------------------------------------------------------------------
*/

date_default_timezone_set(
    appEnv('APP_TIMEZONE', 'Europe/London')
);

if (!defined('APP_ENV')) {
    define(
        'APP_ENV',
        appEnv('APP_ENV', 'production')
    );
}

if (!defined('APP_DEBUG')) {
    define(
        'APP_DEBUG',
        filter_var(
            appEnv('APP_DEBUG', 'false'),
            FILTER_VALIDATE_BOOLEAN
        )
    );
}

oankLog(
    'Application initialized.',
    'INFO',
    [
        'environment' => APP_ENV,
        'debug_enabled' => APP_DEBUG,
        'php_version' => PHP_VERSION,
        'timezone' => date_default_timezone_get(),
    ]
);

/*
|--------------------------------------------------------------------------
| Company Information
|--------------------------------------------------------------------------
*/

define('COMPANY_NAME', 'OanK Cleaning');
define('PARENT_GROUP', 'Ohkay Limited');
define('COMPANY_DOMAIN', 'oankcleaning.co.uk');

define(
    'COMPANY_ADDRESS',
    '9 Inchinnan RdPaisley PA3 2RJ, UK'
);

define(
    'COMPANY_PHONE_PRIMARY',
    '+44 77 3195 6727'
);

define(
    'COMPANY_PHONE_SECONDARY',
    '+44 20 3432 4738'
);

/*
|--------------------------------------------------------------------------
| WhatsApp
|--------------------------------------------------------------------------
*/

define(
    'COMPANY_WHATSAPP_NUMBER',
    '+447731956727'
);

define(
    'COMPANY_WHATSAPP_LINK',
    'https://wa.me/message/EJKXRLHN7TGKK1'
);

/*
|--------------------------------------------------------------------------
| Email Routing
|--------------------------------------------------------------------------
*/

define(
    'NOTIFICATION_EMAIL',
    'info@oankcleaning.co.uk'
);

define(
    'BACKUP_EMAIL',
    'hormotholar@yahoo.com'
);

define(
    'SUPPORT_EMAIL',
    'support@ohkaylimited.co.uk'
);

/*
|--------------------------------------------------------------------------
| Database Configuration
|--------------------------------------------------------------------------
*/

if (!defined('DB_HOST')) {
    define(
        'DB_HOST',
        appEnv('DB_HOST', 'localhost')
    );
}

if (!defined('DB_NAME')) {
    define('DB_NAME', appEnv('DB_NAME'));
}

if (!defined('DB_USER')) {
    define('DB_USER', appEnv('DB_USER'));
}

if (!defined('DB_PASS')) {
    define('DB_PASS', appEnv('DB_PASS'));
}

// Log configuration status without exposing credentials.
$dbConfigReady = (
    DB_HOST !== ''
    && DB_NAME !== ''
    && DB_USER !== ''
    && DB_PASS !== ''
);

oankLog(
    $dbConfigReady
        ? 'Database configuration loaded.'
        : 'Database configuration is incomplete.',
    $dbConfigReady ? 'INFO' : 'CRITICAL',
    [
        'host_configured' => DB_HOST !== '',
        'database_name_configured' => DB_NAME !== '',
        'database_user_configured' => DB_USER !== '',
        'database_password_configured' => DB_PASS !== '',
    ]
);

/*
|--------------------------------------------------------------------------
| PHP Error Handler
|--------------------------------------------------------------------------
*/

if (!defined('OANK_ERROR_HANDLER_REGISTERED')) {
    define('OANK_ERROR_HANDLER_REGISTERED', true);

    set_error_handler(
        function (
            int $severity,
            string $message,
            string $file,
            int $line
        ): bool {
            // Respect PHP's configured error_reporting level.
            if (!(error_reporting() & $severity)) {
                return false;
            }

            $level = in_array(
                $severity,
                [E_ERROR, E_USER_ERROR, E_RECOVERABLE_ERROR],
                true
            ) ? 'ERROR' : 'WARNING';

            oankLog(
                'PHP runtime error.',
                $level,
                [
                    'severity' => $severity,
                    'message' => $message,
                    'file' => basename($file),
                    'line' => $line,
                ]
            );

            // Prevent the same handled error from being logged twice.
            return true;
        }
    );

    register_shutdown_function(
        function (): void {
            $lastError = error_get_last();

            if ($lastError === null) {
                return;
            }

            $fatalTypes = [
                E_ERROR,
                E_PARSE,
                E_CORE_ERROR,
                E_COMPILE_ERROR,
                E_USER_ERROR,
                E_RECOVERABLE_ERROR,
            ];

            if (!in_array($lastError['type'], $fatalTypes, true)) {
                return;
            }

            oankLog(
                'Fatal PHP error.',
                'CRITICAL',
                [
                    'type' => $lastError['type'],
                    'message' => $lastError['message'],
                    'file' => basename($lastError['file']),
                    'line' => $lastError['line'],
                ]
            );

            if (headers_sent()) {
                return;
            }

            $requestUri = $_SERVER['REQUEST_URI'] ?? '';
            $isApiRequest = strpos($requestUri, '/api/') !== false;

            if ($isApiRequest) {
                http_response_code(500);

                header(
                    'Content-Type: application/json; charset=utf-8'
                );

                echo json_encode(
                    [
                        'success' => false,
                        'message' => 'An internal server error occurred.',
                        'timestamp' => date('c'),
                    ],
                    JSON_UNESCAPED_SLASHES
                    | JSON_INVALID_UTF8_SUBSTITUTE
                );
            }
        }
    );

    set_exception_handler(
        function (Throwable $exception): void {
            oankLog(
                'Uncaught exception.',
                'CRITICAL',
                [
                    'type' => get_class($exception),
                    'message' => $exception->getMessage(),
                    'file' => basename($exception->getFile()),
                    'line' => $exception->getLine(),
                ]
            );

            if (headers_sent()) {
                return;
            }

            $requestUri = $_SERVER['REQUEST_URI'] ?? '';
            $isApiRequest = strpos($requestUri, '/api/') !== false;

            if ($isApiRequest) {
                http_response_code(500);

                header(
                    'Content-Type: application/json; charset=utf-8'
                );

                echo json_encode(
                    [
                        'success' => false,
                        'message' => 'An internal server error occurred.',
                        'timestamp' => date('c'),
                    ],
                    JSON_UNESCAPED_SLASHES
                    | JSON_INVALID_UTF8_SUBSTITUTE
                );

                return;
            }

            http_response_code(500);

            echo 'An internal server error occurred. Please try again later.';
        }
    );
}

/*
|--------------------------------------------------------------------------
| JSON Response Helper
|--------------------------------------------------------------------------
*/

if (!function_exists('sendJsonResponse')) {
    function sendJsonResponse(
        bool $success,
        string $message,
        array $data = [],
        int $statusCode = 200
    ): void {
        http_response_code($statusCode);

        header(
            'Content-Type: application/json; charset=utf-8'
        );

        $response = [
            'success' => $success,
            'message' => $message,
            'timestamp' => date('c'),
            'company' => COMPANY_NAME,
            'parentGroup' => PARENT_GROUP,
            'data' => $data,
        ];

        if (APP_DEBUG) {
            $response['debug'] = [
                'request_id' => bin2hex(random_bytes(8)),
                'environment' => APP_ENV,
            ];
        }

        $json = json_encode(
            $response,
            JSON_UNESCAPED_SLASHES
            | JSON_UNESCAPED_UNICODE
            | JSON_INVALID_UTF8_SUBSTITUTE
        );

        if ($json === false) {
            oankLog(
                'Failed to encode JSON response.',
                'ERROR',
                ['json_error' => json_last_error_msg()]
            );

            http_response_code(500);

            echo '{"success":false,"message":"Unable to generate response."}';
            exit;
        }

        if (!$success) {
            oankLog(
                'Application returned an unsuccessful JSON response.',
                'WARNING',
                [
                    'status_code' => $statusCode,
                    'message' => $message,
                ]
            );
        }

        echo $json;
        exit;
    }
}

/*
|--------------------------------------------------------------------------
| Safe Header Value
|--------------------------------------------------------------------------
*/

if (!function_exists('safeHeaderValue')) {
    function safeHeaderValue(string $value): string
    {
        return trim(
            str_replace(
                ["\r", "\n"],
                '',
                $value
            )
        );
    }
}

/*
|--------------------------------------------------------------------------
| User Confirmation Email
|--------------------------------------------------------------------------
*/

if (!function_exists('buildUserConfirmationEmailHtml')) {
    function buildUserConfirmationEmailHtml(
        string $name,
        string $referenceNo,
        string $service,
        string $preferredDate
    ): string {
        $companyName = htmlspecialchars(
            COMPANY_NAME,
            ENT_QUOTES,
            'UTF-8'
        );

        $safeName = htmlspecialchars(
            $name,
            ENT_QUOTES,
            'UTF-8'
        );

        $safeReference = htmlspecialchars(
            $referenceNo,
            ENT_QUOTES,
            'UTF-8'
        );

        $safeService = htmlspecialchars(
            $service,
            ENT_QUOTES,
            'UTF-8'
        );

        $safePreferredDate = htmlspecialchars(
            $preferredDate,
            ENT_QUOTES,
            'UTF-8'
        );

        $phone = htmlspecialchars(
            COMPANY_PHONE_PRIMARY,
            ENT_QUOTES,
            'UTF-8'
        );

        $whatsappLink = htmlspecialchars(
            COMPANY_WHATSAPP_LINK,
            ENT_QUOTES,
            'UTF-8'
        );

        $address = htmlspecialchars(
            COMPANY_ADDRESS,
            ENT_QUOTES,
            'UTF-8'
        );

        $year = date('Y');

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enquiry Confirmation - {$companyName}</title>
</head>
<body style="margin:0;padding:20px;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#334155;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#0F382C;padding:30px;text-align:center;border-bottom:4px solid #D4AF37;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;font-family:Georgia,serif;">
                {$companyName}
            </h1>
            <p style="color:#D4AF37;margin:6px 0 0;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">
                A Proud Subsidiary of Ohkay Limited
            </p>
        </div>

        <div style="padding:30px;">
            <h2 style="color:#0F382C;margin:0 0 20px;font-size:20px;">
                Enquiry Received Successfully
            </h2>

            <p style="font-size:15px;line-height:1.6;">
                Dear <strong>{$safeName}</strong>,
            </p>

            <p style="font-size:15px;line-height:1.6;">
                Thank you for contacting <strong>{$companyName}</strong>.
                We have received your enquiry and our team will be in touch
                shortly to discuss your requirements and confirm availability.
            </p>

            <div style="background:#f8fafc;border-left:4px solid #0F382C;padding:15px 20px;margin:20px 0;border-radius:4px;">
                <p style="margin:0 0 8px;font-size:13px;color:#64748b;">
                    <strong>Reference ID:</strong>
                    <span style="color:#0F382C;font-weight:bold;">{$safeReference}</span>
                </p>

                <p style="margin:0 0 8px;font-size:13px;color:#64748b;">
                    <strong>Service Requested:</strong>
                    {$safeService}
                </p>

                <p style="margin:0;font-size:13px;color:#64748b;">
                    <strong>Preferred Date:</strong>
                    {$safePreferredDate}
                </p>
            </div>

            <p style="font-size:14px;line-height:1.6;">
                If you need immediate assistance, please call us on
                <a href="tel:+447731956727" style="color:#0F382C;font-weight:bold;text-decoration:none;">
                    {$phone}
                </a>
                or
                <a href="{$whatsappLink}" target="_blank" rel="noopener noreferrer" style="color:#128C7E;font-weight:bold;text-decoration:underline;">
                    message us on WhatsApp
                </a>.
            </p>

            <p style="font-size:14px;line-height:1.6;margin-top:25px;">
                Warm regards,<br>
                <strong>The {$companyName} Team</strong><br>
                <em>Paisley Headquarters, Scotland</em>
            </p>
        </div>

        <div style="background:#f1f5f9;padding:20px;text-align:center;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
            <p style="margin:0 0 5px;">
                {$companyName} &bull; {$address}
            </p>
            <p style="margin:0;">
                &copy; {$year} Ohkay Limited. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
HTML;
    }
}

/*
simple email Template 
<p> </p>
<p> </p>
<p>OANK Cleaning - Email Acknowledgement</p>
<table width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td>
<h2>Thank You for Contacting OANK Cleaning</h2>
<p>Thank you for getting in touch with us. We have received your email, and a member of our team will review your enquiry and respond as soon as possible.</p>
<p>We appreciate your patience.</p>
<p>Kind regards,</p>
<p>Support Team<br /> OANK Cleaning</p>
<hr />
<p>OANK CLEANING CIC</p>
<p>Cleaning Services | Community Interest Company<br /> Paisley, Scotland</p>
<p>🌐 <a href="https://www.oankcleaning.co.uk"> www.oankcleaning.co.uk </a><br /> 📞 <a href="tel:+447731956727"> +44 77 3195 6727 </a></p>
</td>
</tr>
</tbody>
</table>
*/



/**
 * Sends a critical email notification to the site admin when
 * the database connection/insertion fails.
 */
function sendDatabaseFailureEmail(string $subject, string $body): bool
{
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . COMPANY_NAME . ' <info@' . COMPANY_DOMAIN . '>',
        'Reply-To: info@' . COMPANY_DOMAIN,
        'X-Mailer: PHP/' . phpversion(),
    ];

    $emailBody = "DATABASE INSERTION FAILURE ALERT\n\n" .
                 "Date: " . date('Y-m-d H:i:s') . "\n" .
                 "Subject: $subject\n\n" .
                 "Details:\n$body";

    return @mail(
        NOTIFICATION_EMAIL,
        'CRITICAL ALERT: Database Failure - ' . $subject,
        $emailBody,
        implode("\r\n", $headers)
    );
}

oankLog(
    'Global configuration loaded successfully.',
    'INFO'
);