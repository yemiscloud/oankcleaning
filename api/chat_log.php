<?php

/**
 * OANK Cleaning CIC
 * Chat History Logger API
 *
 * Endpoint:
 * POST /api/chat-log or POST /api/chat_log
 *
 * Appends live conversation transcripts to backend/chat_history.php
 * separated by dates, time, HR line and new line.
 */

declare(strict_types=1);

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/config.php';

/*
|--------------------------------------------------------------------------
| Request Method Validation
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(
        false,
        'Invalid request method. Only POST is accepted.',
        [],
        405
    );
}

/*
|--------------------------------------------------------------------------
| Read and Parse JSON Payload
|--------------------------------------------------------------------------
*/

$rawInput = file_get_contents('php://input');

if ($rawInput === false || trim($rawInput) === '') {
    sendJsonResponse(
        false,
        'No chat data received.',
        [],
        400
    );
}

$input = json_decode($rawInput, true);

if (!is_array($input)) {
    sendJsonResponse(
        false,
        'Invalid JSON payload.',
        [],
        400
    );
}

/*
|--------------------------------------------------------------------------
| Extract Values
|--------------------------------------------------------------------------
*/

$sessionId = trim((string)($input['sessionId'] ?? 'SESSION-' . substr(md5(uniqid('', true)), 0, 8)));
$userMessage = trim((string)($input['userMessage'] ?? ''));
$botResponse = trim((string)($input['botResponse'] ?? ''));
$clientTimestamp = trim((string)($input['timestamp'] ?? ''));

if ($userMessage === '' && $botResponse === '') {
    sendJsonResponse(
        false,
        'User message or bot response cannot be empty.',
        [],
        400
    );
}

/*
|--------------------------------------------------------------------------
| Format Date and Time
|--------------------------------------------------------------------------
*/

$currentDate = date('Y-m-d');
$currentTime = date('H:i:s T');
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'Unknown IP';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown User-Agent';

$logEntry = "\n";
$logEntry .= "[DATE: {$currentDate}] [TIME: {$currentTime}]\n";
$logEntry .= "[SESSION ID: {$sessionId}]\n";
$logEntry .= "[CLIENT IP: {$ipAddress}]\n";
if ($clientTimestamp !== '') {
    $logEntry .= "[CLIENT LOCAL TIME: {$clientTimestamp}]\n";
}
$logEntry .= "--------------------------------------------------------------------------------\n";
$logEntry .= "VISITOR ENQUIRY:\n" . $userMessage . "\n\n";
$logEntry .= "RECEPTIONIST RESPONSE:\n" . $botResponse . "\n";
$logEntry .= "--------------------------------------------------------------------------------\n";
$logEntry .= "================================================================================\n\n";

/*
|--------------------------------------------------------------------------
| Append to backend/chat_history.php
|--------------------------------------------------------------------------
*/

$logFilePath = dirname(__DIR__) . '/chat_history.php';

$writeSuccess = @file_put_contents(
    $logFilePath,
    $logEntry,
    FILE_APPEND | LOCK_EX
);

if ($writeSuccess === false) {
    error_log("Failed to write chat log to: {$logFilePath}");
    sendJsonResponse(
        false,
        'Could not write to chat history file.',
        ['error' => 'File write permission error'],
        500
    );
}

sendJsonResponse(
    true,
    'Chat interaction successfully logged to backend/chat_history.php.',
    [
        'sessionId' => $sessionId,
        'date' => $currentDate,
        'time' => $currentTime,
        'bytesWritten' => $writeSuccess,
    ],
    200
);
