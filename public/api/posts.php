<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

$db        = getDB();
$method    = $_SERVER['REQUEST_METHOD'];
$id        = $_GET['id'] ?? null;
$slug      = $_GET['slug'] ?? null;

// ── Ensure author columns exist (safe migration) ──────────────────────────────
try {
    $db->exec("ALTER TABLE posts ADD COLUMN author VARCHAR(255) NOT NULL DEFAULT ''");
} catch (PDOException $e) { /* Column already exists — ignore */ }
try {
    $db->exec("ALTER TABLE posts ADD COLUMN author_image TEXT NOT NULL DEFAULT ''");
} catch (PDOException $e) { /* Column already exists — ignore */ }

switch ($method) {
    case 'GET':
        if ($slug) {
            $stmt = $db->prepare('SELECT * FROM posts WHERE slug = ? AND published = 1 LIMIT 1');
            $stmt->execute([$slug]);
            $post = $stmt->fetch();
            if (!$post) jsonError('Post no encontrado', 404);
            $post['published'] = (bool)$post['published'];
            jsonOk($post);
        }
        if ($id) {
            $stmt = $db->prepare('SELECT * FROM posts WHERE id = ? LIMIT 1');
            $stmt->execute([$id]);
            $post = $stmt->fetch();
            if (!$post) jsonError('Post no encontrado', 404);
            $post['published'] = (bool)$post['published'];
            jsonOk($post);
        }

        // Verificar si es admin sin hacer exit si no lo es
        $isAdmin = false;
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (str_starts_with($authHeader, 'Bearer ')) {
            $token   = substr($authHeader, 7);
            $payload = verifyFirebaseToken($token);
            if ($payload) {
                $isAdmin = ($payload['email'] ?? '') === ADMIN_EMAIL
                        || ($payload['user_id'] ?? '') === ADMIN_UID;
            }
        }

        if ($isAdmin) {
            $stmt = $db->query('SELECT * FROM posts ORDER BY created_at DESC');
        } else {
            $stmt = $db->query('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC');
        }
        $posts = array_map(fn($p) => array_merge($p, ['published' => (bool)$p['published']]), $stmt->fetchAll());
        jsonOk($posts);

    case 'POST':
        $payload = requireAdmin();
        $body    = getBody();
        $newId   = generateId();
        $stmt    = $db->prepare('
            INSERT INTO posts (id, title, slug, content, excerpt, category, image, keywords, published, author, author_image, author_id, author_email, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $newId,
            $body['title'] ?? '',
            $body['slug'] ?? $newId,
            $body['content'] ?? '',
            $body['excerpt'] ?? '',
            $body['category'] ?? 'General',
            $body['image'] ?? '',
            $body['keywords'] ?? '',
            isset($body['published']) ? ($body['published'] ? 1 : 0) : 1,
            $body['author'] ?? ($payload['name'] ?? ''),
            $body['authorImage'] ?? ($body['author_image'] ?? ''),
            $payload['user_id'] ?? ($body['author_id'] ?? ''),
            $payload['email'] ?? ($body['author_email'] ?? ''),
            nowISO(),
            nowISO(),
        ]);
        jsonOk(['id' => $newId, 'message' => 'Post creado'], 201);

    case 'PUT':
        requireAdmin();
        if (!$id) jsonError('ID requerido');
        $body = getBody();

        // Build dynamic SET clause — only update fields that are present in the body
        $fields = [];
        $values = [];

        $allowed = [
            'title'        => $body['title']        ?? null,
            'slug'         => $body['slug']          ?? null,
            'content'      => $body['content']       ?? null,
            'excerpt'      => $body['excerpt']       ?? null,
            'category'     => $body['category']      ?? null,
            'image'        => $body['image']         ?? null,
            'keywords'     => $body['keywords']      ?? null,
            'author'       => $body['author']        ?? null,
            'author_image' => $body['authorImage'] ?? ($body['author_image'] ?? null),
            'author_id'    => $body['author_id']     ?? null,
            'author_email' => $body['author_email']  ?? null,
            'published'    => isset($body['published']) ? ($body['published'] ? 1 : 0) : null,
        ];

        foreach ($allowed as $col => $val) {
            if ($val !== null) {
                $fields[] = "$col=?";
                $values[] = $val;
            }
        }

        if (empty($fields)) jsonError('Nada que actualizar');

        $fields[] = 'updated_at=?';
        $values[] = nowISO();
        $values[] = $id;

        $sql = 'UPDATE posts SET ' . implode(', ', $fields) . ' WHERE id=?';
        $db->prepare($sql)->execute($values);
        jsonOk(['message' => 'Post actualizado']);

    case 'DELETE':
        requireAdmin();
        if (!$id) jsonError('ID requerido');
        $db->prepare('DELETE FROM posts WHERE id = ?')->execute([$id]);
        jsonOk(['message' => 'Post eliminado']);

    default:
        jsonError('Método no permitido', 405);
}
