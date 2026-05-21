<?php
header('Content-Type: application/json');
echo json_encode([
    'php' => phpversion(),
    'status' => 'ok',
    'time' => date('c'),
    'extensions' => [
        'pdo' => extension_loaded('pdo'),
        'pdo_mysql' => extension_loaded('pdo_mysql'),
        'openssl' => extension_loaded('openssl'),
        'curl' => extension_loaded('curl'),
    ]
]);
