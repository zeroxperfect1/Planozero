<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

$db        = getDB();
$method    = $_SERVER['REQUEST_METHOD'];
$id        = $_GET['id'] ?? null;
$typeId    = $_GET['type_id'] ?? null;

switch ($method) {
    case 'GET':
        if ($typeId) {
            $stmt = $db->prepare('SELECT * FROM dynamic_content WHERE type_id = ? ORDER BY created_at DESC');
            $stmt->execute([$typeId]);
        } else {
            $stmt = $db->query('SELECT * FROM dynamic_content ORDER BY created_at DESC');
        }
        $rows = array_map(function($r) {
            $r['data']      = json_decode($r['data_json'] ?? '{}', true);
            $r['published'] = (bool)$r['published'];
            unset($r['data_json']);
            return $r;
        }, $stmt->fetchAll());
        jsonOk($rows);

    case 'POST':
        requireAdmin();
        $body  = getBody();
        $newId = generateId();
        $db->prepare('INSERT INTO dynamic_content (id, type_id, data_json, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')->execute([
            $newId, $body['typeId'] ?? '', json_encode($body['data'] ?? [], JSON_UNESCAPED_UNICODE),
            $body['published'] ? 1 : 0, nowISO(), nowISO()
        ]);
        jsonOk(['id' => $newId], 201);

    case 'PUT':
        requireAdmin();
        if (!$id) jsonError('ID requerido');
        $body = getBody();
        $db->prepare('UPDATE dynamic_content SET data_json=?, published=?, updated_at=? WHERE id=?')->execute([
            json_encode($body['data'] ?? [], JSON_UNESCAPED_UNICODE), $body['published'] ? 1 : 0, nowISO(), $id
        ]);
        jsonOk(['message' => 'Actualizado']);

    case 'DELETE':
        requireAdmin();
        if (!$id) jsonError('ID requerido');
        $db->prepare('DELETE FROM dynamic_content WHERE id = ?')->execute([$id]);
        jsonOk(['message' => 'Eliminado']);

    default:
        jsonError('Método no permitido', 405);
}
