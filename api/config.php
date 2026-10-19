<?php

declare(strict_types=1);

/**
 * OanK Cleaning
 * Global PHP Configuration
 *
 * Subsidiary of Ohkay Limited
 *
 * File:
 * /home/oankxyiu/public_html/api/config.php
 *
 * Environment:
 * /home/oankxyiu/.env_variables/oank.env
 */

/*
|--------------------------------------------------------------------------
| Company Information
|--------------------------------------------------------------------------
*/

defined('COMPANY_NAME') || define('COMPANY_NAME', 'OanK Cleaning');
defined('PARENT_GROUP') || define('PARENT_GROUP', 'Ohkay Limited');
defined('COMPANY_DOMAIN') || define('COMPANY_DOMAIN', 'oankcleaning.co.uk');

defined('COMPANY_ADDRESS') || define(
    'COMPANY_ADDRESS',
    'Paisley, Scotland, PA3 2PJ'
);

defined('COMPANY_PHONE_PRIMARY') || define(
    'COMPANY_PHONE_PRIMARY',
    '+44 75 1091 1940'
);

defined('COMPANY_PHONE_SECONDARY') || define(
    'COMPANY_PHONE_SECONDARY',
    '+44 75 2244 1379'
);

/*
|--------------------------------------------------------------------------
| WhatsApp
|--------------------------------------------------------------------------
*/

defined('COMPANY_WHATSAPP_NUMBER') || define(
    'COMPANY_WHATSAPP_NUMBER',
    '+447510911940'
);

defined('COMPANY_WHATSAPP_LINK') || define(
    'COMPANY_WHATSAPP_LINK',
    'https://wa.me/447510911940'
);

/*
|--------------------------------------------------------------------------
| Email Routing
|--------------------------------------------------------------------------
*/

defined('NOTIFICATION_EMAIL') || define(
    'NOTIFICATION_EMAIL',
    'info@oankcleaning.co.uk'
);

defined('BACKUP_EMAIL') || define(
    'BACKUP_EMAIL',
    'hormotholar@yahoo.com'
);

defined('SUPPORT_EMAIL') || define(
    'SUPPORT_EMAIL',
    'support@ohkaylimited.co.uk'
);

/*
|--------------------------------------------------------------------------
| Environment Loader
|--------------------------------------------------------------------------
|
| Loads simple KEY=value entries from a private file outside public_html.
| No Composer package is required.
|
| Existing server-provided environment variables take precedence.
|
*/

$envFile = '/home/oankxyiu/.env_variables/oank.env';

if (is_readable($envFile)) {
    $envLines = file(
        $envFile,
        FILE_IGNORE_NEW_LINES
    );

    if ($envLines !== false) {
        foreach ($envLines as $line) {
            $line = trim($line);

            if ($line === '' || $line[0] === '#') {
                continue;
            }

            // Support an optional "export KEY=value" prefix.
            if (strncmp($line, 'export ', 7) === 0) {
                $line = trim(substr($line, 7));
            }

            if (strpos($line, '=') === false) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);

            $key = trim($key);
            $value = trim($value);

            // Only accept standard environment variable names.
            if (!preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $key)) {
                continue;
            }

            // Remove matching surrounding quotes.
            if (strlen($value) >= 2) {
                $first = $value[0];
                $last = substr($value, -1);

                if (
                    ($first === '"' && $last === '"') ||
                    ($first === "'" && $last === "'")
                ) {
                    $value = substr($value, 1, -1);
                }
            }

            // Never overwrite variables already supplied by the host.
            if (
                getenv($key) === false &&
                !array_key_exists($key, $_ENV) &&
                !array_key_exists($key, $_SERVER)
            ) {
                putenv($key . '=' . $value);
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
} else {
    // Do not expose private paths or credentials to visitors.
    error_log(
        'OanK Cleaning: private environment file is missing or unreadable.'
    );
}

/*
|--------------------------------------------------------------------------
| Environment Value Helper
|--------------------------------------------------------------------------
|
| Reads server environment variables first, followed by $_ENV and $_SERVER.
| Empty values are treated as unset.
|
*/

if (!function_exists('configEnv')) {
    function configEnv(string $key, ?string $default = null): ?string
    {
        $value = getenv($key);

        if ($value === false && array_key_exists($key, $_ENV)) {
            $value = $_ENV[$key];
        }

        if ($value === false && array_key_exists($key, $_SERVER)) {
            $value = $_SERVER[$key];
        }

        if (!is_string($value) || trim($value) === '') {
            return $default;
        }

        return $value;
    }
}

/*
|--------------------------------------------------------------------------
| Database Credentials
|--------------------------------------------------------------------------
|
| Set these in /home/oankxyiu/.env_variables/oank.env.
| Do not commit real credentials to source control.
|
*/

defined('DB_HOST') || define(
    'DB_HOST',
    configEnv('DB_HOST', 'localhost')
);

defined('DB_NAME') || define(
    'DB_NAME',
    configEnv('DB_NAME', 'oankxyju_cleaning')
);

defined('DB_USER') || define(
    'DB_USER',
    configEnv('DB_USER', 'oankxyju_cleaninguk')
);

defined('DB_PASS') || define(
    'DB_PASS',
    configEnv('DB_PASS', '')
);

/*
|--------------------------------------------------------------------------
| Optional Application Settings
|--------------------------------------------------------------------------
|
| Configure these in oank.env if your application needs them.
|
*/

defined('APP_ENV') || define(
    'APP_ENV',
    configEnv('APP_ENV', 'production')
);

defined('APP_DEBUG') || define(
    'APP_DEBUG',
    filter_var(
        configEnv('APP_DEBUG', 'false'),
        FILTER_VALIDATE_BOOLEAN
    )
);

defined('APP_TIMEZONE') || define(
    'APP_TIMEZONE',
    configEnv('APP_TIMEZONE', 'Europe/London')
);

date_default_timezone_set(APP_TIMEZONE);

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

        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, max-age=0');

        $response = [
            'success' => $success,
            'message' => $message,
            'timestamp' => date(DATE_ATOM),
            'company' => COMPANY_NAME,
            'parentGroup' => PARENT_GROUP,
            'data' => $data,
        ];

        try {
            $json = json_encode(
                $response,
                JSON_UNESCAPED_SLASHES |
                JSON_UNESCAPED_UNICODE |
                JSON_INVALID_UTF8_SUBSTITUTE |
                JSON_THROW_ON_ERROR
            );

            echo $json;
        } catch (JsonException $exception) {
            error_log(
                'OanK Cleaning: JSON response encoding failed.'
            );

            http_response_code(500);

            echo '{"success":false,"message":"Unable to create response.","data":[]}';
        }

        exit;
    }
}

/*
|--------------------------------------------------------------------------
| Safe Header Value
|--------------------------------------------------------------------------
|
| Prevents carriage-return and line-feed injection into email headers.
|
*/

if (!function_exists('safeHeaderValue')) {
    function safeHeaderValue(string $value): string
    {
        return trim(
            str_replace(["\r", "\n"], '', $value)
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
        $escape = static function (string $value): string {
            return htmlspecialchars(
                $value,
                ENT_QUOTES | ENT_SUBSTITUTE,
                'UTF-8'
            );
        };

        $companyName = $escape(COMPANY_NAME);
        $safeName = $escape($name);
        $safeReference = $escape($referenceNo);
        $safeService = $escape($service);
        $safePreferredDate = $escape($preferredDate);
        $phone = $escape(COMPANY_PHONE_PRIMARY);
        $whatsappLink = $escape(COMPANY_WHATSAPP_LINK);
        $address = $escape(COMPANY_ADDRESS);
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
                <a href="tel:+447510911940" style="color:#0F382C;font-weight:bold;text-decoration:none;">
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
