<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        requireAuth();
        $stmt = $db->query('SELECT * FROM content_types ORDER BY created_at ASC');
        $rows = array_map(function($r) {
            $r['fields'] = json_decode($r['fields_json'] ?? '[]', true);
            unset($r['fields_json']);
            return $r;
        }, $stmt->fetchAll());
        jsonOk($rows);

    case 'POST':
        requireAdmin();
        $body  = getBody();
        $newId = generateId();
        $db->prepare('INSERT INTO content_types (id, name, fields_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')->execute([
            $newId, $body['name'] ?? 'Tipo', json_encode($body['fields'] ?? [], JSON_UNESCAPED_UNICODE), nowISO(), nowISO()
        ]);
        jsonOk(['id' => $newId], 201);

    case 'PUT':
        requireAdmin();
        if (!$id) jsonError('ID requerido');
        $body = getBody();
        $db->prepare('UPDATE content_types SET name=?, fields_json=?, updated_at=? WHERE id=?')->execute([
            $body['name'] ?? 'Tipo', json_encode($body['fields'] ?? [], JSON_UNESCAPED_UNICODE), nowISO(), $id
        ]);
        jsonOk(['message' => 'Actualizado']);

    case 'DELETE':
        requireAdmin();
        if (!$id) jsonError('ID requerido');
        $db->prepare('DELETE FROM content_types WHERE id = ?')->execute([$id]);
        jsonOk(['message' => 'Eliminado']);

    default:
        jsonError('Método no permitido', 405);
}
