<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

$name = trim($data['name'] ?? '');
$company = trim($data['company'] ?? '');
$email = trim($data['email'] ?? '');
$topic = trim($data['topic'] ?? '');
$notes = trim($data['notes'] ?? '');
$date = trim($data['date'] ?? '');
$time = trim($data['time'] ?? '');
$timezone = trim($data['timezone'] ?? 'Africa/Casablanca');
$duration = (int) ($data['duration'] ?? 20);

if ($name === '' || $email === '' || $date === '' || $time === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email']);
    exit;
}

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !preg_match('/^\d{2}:\d{2}$/', $time)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid date or time']);
    exit;
}

if ($duration < 5 || $duration > 120) {
    $duration = 20;
}

$to = 'contact@get-consult.com';
$subject = 'GET Consult — Call Request: ' . $date . ' at ' . $time;
$body = "A new 20-minute call has been requested.\n\n";
$body .= "Requested slot\n";
$body .= "--------------\n";
$body .= "Date: {$date}\n";
$body .= "Time: {$time}\n";
$body .= "Duration: {$duration} minutes\n";
$body .= "Timezone: {$timezone}\n\n";
$body .= "Contact\n";
$body .= "-------\n";
$body .= "Name: {$name}\n";
if ($company !== '') {
    $body .= "Company: {$company}\n";
}
$body .= "Email: {$email}\n";
if ($topic !== '') {
    $body .= "Topic: {$topic}\n";
}
if ($notes !== '') {
    $body .= "\nAdditional details\n";
    $body .= "------------------\n{$notes}\n";
}
$body .= "\n— Sent from get-consult.com booking form\n";

$headers = [
    'From: GET Consult Website <noreply@get-consult.com>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mail delivery failed']);
    exit;
}

echo json_encode(['ok' => true]);
