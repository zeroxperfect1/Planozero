<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        requireAdmin();
        $stmt = $db->query('SELECT * FROM logs ORDER BY created_at DESC LIMIT 500');
        jsonOk($stmt->fetchAll());

    case 'POST':
        requireAuth();
        $body = getBody();
        $stmt = $db->prepare('INSERT INTO logs (message, level, uid, created_at) VALUES (?, ?, ?, ?)');
        $stmt->execute([
            substr($body['message'] ?? '', 0, 2000),
            in_array($body['level'] ?? '', ['info','error']) ? $body['level'] : 'info',
            $body['uid'] ?? '',
            nowISO(),
        ]);
        jsonOk(['message' => 'Log registrado'], 201);

    case 'DELETE':
        requireAdmin();
        $db->exec('DELETE FROM logs');
        jsonOk(['message' => 'Logs eliminados']);

    default:
        jsonError('Método no permitido', 405);
}
