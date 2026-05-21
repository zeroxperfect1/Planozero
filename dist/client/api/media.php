<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        requireAuth();
        $stmt = $db->query('SELECT * FROM media ORDER BY created_at DESC');
        jsonOk($stmt->fetchAll());

    case 'DELETE':
        $payload = requireAuth();
        if (!$id) jsonError('ID requerido');
        $stmt = $db->prepare('SELECT * FROM media WHERE id = ?');
        $stmt->execute([$id]);
        $item = $stmt->fetch();
        if (!$item) jsonError('Media no encontrada', 404);
        $isAdmin = ($payload['email'] ?? '') === ADMIN_EMAIL || ($payload['user_id'] ?? '') === ADMIN_UID;
        if (!$isAdmin && $item['user_id'] !== $payload['user_id']) jsonError('No autorizado', 403);
        // Delete physical file
        if (str_starts_with($item['url'], UPLOADS_URL)) {
            $filename = basename($item['url']);
            $filePath = UPLOADS_DIR . $filename;
            if (file_exists($filePath)) @unlink($filePath);
        }
        $db->prepare('DELETE FROM media WHERE id = ?')->execute([$id]);
        jsonOk(['message' => 'Media eliminada']);

    default:
        jsonError('Método no permitido', 405);
}
