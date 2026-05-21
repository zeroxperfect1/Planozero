<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        requireAdmin();
        $stmt     = $db->query('SELECT * FROM contacts ORDER BY created_at DESC');
        jsonOk($stmt->fetchAll());

    case 'POST':
        // Public endpoint - no auth required for form submissions
        $body = getBody();
        if (empty($body['name']) || empty($body['email']) || empty($body['idea'])) {
            jsonError('Faltan campos requeridos: name, email, idea');
        }
        if (!filter_var($body['email'], FILTER_VALIDATE_EMAIL)) {
            jsonError('Email inválido');
        }
        $newId = generateId();
        $stmt  = $db->prepare('
            INSERT INTO contacts (id, name, company, position, email, phone, idea, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, "pending", ?)
        ');
        $stmt->execute([
            $newId,
            substr(strip_tags($body['name']), 0, 100),
            substr(strip_tags($body['company'] ?? ''), 0, 100),
            substr(strip_tags($body['position'] ?? ''), 0, 100),
            filter_var($body['email'], FILTER_SANITIZE_EMAIL),
            substr(strip_tags($body['phone'] ?? ''), 0, 30),
            substr(strip_tags($body['idea']), 0, 2000),
            nowISO(),
        ]);
        jsonOk(['message' => 'Contacto enviado correctamente', 'id' => $newId], 201);

    case 'PUT':
        requireAdmin();
        if (!$id) jsonError('ID requerido');
        $body = getBody();
        $stmt = $db->prepare('UPDATE contacts SET status=? WHERE id=?');
        $stmt->execute([$body['status'] ?? 'pending', $id]);
        jsonOk(['message' => 'Contacto actualizado']);

    case 'DELETE':
        requireAdmin();
        if (!$id) jsonError('ID requerido');
        $db->prepare('DELETE FROM contacts WHERE id = ?')->execute([$id]);
        jsonOk(['message' => 'Contacto eliminado']);

    default:
        jsonError('Método no permitido', 405);
}
