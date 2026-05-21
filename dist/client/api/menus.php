<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        $stmt  = $db->query('SELECT * FROM menus ORDER BY created_at ASC');
        $menus = $stmt->fetchAll();
        $menus = array_map(function($m) {
            $m['items'] = json_decode($m['items_json'] ?? '[]', true);
            unset($m['items_json']);
            return $m;
        }, $menus);
        jsonOk($menus);

    case 'POST':
        requireAdmin();
        $body  = getBody();
        $newId = generateId();
        $stmt  = $db->prepare('INSERT INTO menus (id, name, items_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$newId, $body['name'] ?? 'Menú', json_encode($body['items'] ?? [], JSON_UNESCAPED_UNICODE), nowISO(), nowISO()]);
        jsonOk(['id' => $newId, 'message' => 'Menú creado'], 201);

    case 'PUT':
        requireAdmin();
        if (!$id) jsonError('ID requerido');
        $body = getBody();
        $stmt = $db->prepare('UPDATE menus SET name=?, items_json=?, updated_at=? WHERE id=?');
        $stmt->execute([$body['name'] ?? 'Menú', json_encode($body['items'] ?? [], JSON_UNESCAPED_UNICODE), nowISO(), $id]);
        jsonOk(['message' => 'Menú actualizado']);

    case 'DELETE':
        requireAdmin();
        if (!$id) jsonError('ID requerido');
        $db->prepare('DELETE FROM menus WHERE id = ?')->execute([$id]);
        jsonOk(['message' => 'Menú eliminado']);

    default:
        jsonError('Método no permitido', 405);
}
