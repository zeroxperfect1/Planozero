<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

$status = ['status' => 'ok', 'timestamp' => nowISO(), 'services' => []];

try {
    $db = getDB();
    $db->query('SELECT 1');
    $status['services']['mysql'] = 'ok';
} catch (\Throwable $e) {
    $status['services']['mysql'] = 'error: ' . $e->getMessage();
    $status['status'] = 'degraded';
}

$uploadsOk = is_dir(UPLOADS_DIR) && is_writable(UPLOADS_DIR);
$status['services']['uploads'] = $uploadsOk ? 'ok' : 'not writable';
if (!$uploadsOk) $status['status'] = 'degraded';

http_response_code($status['status'] === 'ok' ? 200 : 503);
echo json_encode($status, JSON_UNESCAPED_UNICODE);
