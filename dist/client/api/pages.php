<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;
$slug   = $_GET['slug'] ?? null;

switch ($method) {
    case 'GET':
        if ($slug) {
            $stmt = $db->prepare('SELECT * FROM pages WHERE slug = ? LIMIT 1');
            $stmt->execute([$slug]);
            $page = $stmt->fetch();
            if (!$page) jsonError('Página no encontrada', 404);
            $page['root'] = json_decode($page['root_json'], true);
            unset($page['root_json']);
            jsonOk($page);
        }
        $stmt = $db->query('SELECT id, title, slug, published, show_in_navigation, `order`, created_at, updated_at FROM pages ORDER BY `order` ASC, created_at DESC');
        $pages = $stmt->fetchAll();
        // Return full root for list too
        $fullStmt = $db->query('SELECT * FROM pages ORDER BY `order` ASC, created_at DESC');
        $full = $fullStmt->fetchAll();
        $result = array_map(function($p) {
            $p['root'] = json_decode($p['root_json'] ?? 'null', true);
            $p['showInNavigation'] = (bool)$p['show_in_navigation'];
            $p['published'] = (bool)$p['published'];
            unset($p['root_json'], $p['show_in_navigation']);
            return $p;
        }, $full);
        jsonOk($result);

    case 'POST':
        requireAdmin();
        $body = getBody();
        $newId = generateId();
        $stmt = $db->prepare('
            INSERT INTO pages (id, title, slug, published, show_in_navigation, `order`, root_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $newId,
            $body['title'] ?? 'Sin título',
            $body['slug'] ?? $newId,
            $body['published'] ? 1 : 0,
            $body['showInNavigation'] ? 1 : 0,
            $body['order'] ?? 0,
            json_encode($body['root'] ?? ['id'=>'root','children'=>[]], JSON_UNESCAPED_UNICODE),
            nowISO(),
            nowISO(),
        ]);
        jsonOk(['id' => $newId, 'message' => 'Página creada'], 201);

    case 'PUT':
        requireAdmin();
        if (!$id) jsonError('ID requerido');
        $body = getBody();
        $stmt = $db->prepare('
            UPDATE pages SET title=?, slug=?, published=?, show_in_navigation=?, `order`=?, root_json=?, updated_at=?
            WHERE id=?
        ');
        $stmt->execute([
            $body['title'] ?? 'Sin título',
            $body['slug'] ?? $id,
            isset($body['published']) ? ($body['published'] ? 1 : 0) : 0,
            isset($body['showInNavigation']) ? ($body['showInNavigation'] ? 1 : 0) : 0,
            $body['order'] ?? 0,
            json_encode($body['root'] ?? ['id'=>'root','children'=>[]], JSON_UNESCAPED_UNICODE),
            nowISO(),
            $id,
        ]);
        jsonOk(['message' => 'Página actualizada']);

    case 'DELETE':
        requireAdmin();
        if (!$id) jsonError('ID requerido');
        $db->prepare('DELETE FROM pages WHERE id = ?')->execute([$id]);
        jsonOk(['message' => 'Página eliminada']);

    default:
        jsonError('Método no permitido', 405);
}
