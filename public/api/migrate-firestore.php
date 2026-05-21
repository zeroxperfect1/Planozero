<?php
/**
 * migrate-firestore.php
 * Importa posts de Firestore a MySQL.
 * Llamar con el token Firebase como Bearer Authorization.
 * USO: GET /api/migrate-firestore.php?action=import
 */
require_once __DIR__ . '/config.php';
setCorsHeaders();

$payload = requireAdmin();

$action = $_GET['action'] ?? 'preview';

// Configuración Firestore
$projectId  = FIREBASE_PROJECT_ID;
$databaseId = 'ai-studio-70ea9f7b-cc5b-43f8-ac6f-140160042b91';
$token      = substr($_SERVER['HTTP_AUTHORIZATION'], 7);

function firestoreGet(string $collection, string $projectId, string $databaseId, string $token): array {
    $url = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/{$databaseId}/documents/{$collection}?pageSize=100";
    $ch  = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$token}"],
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200 || !$resp) return [];
    $data = json_decode($resp, true);
    return $data['documents'] ?? [];
}

function fsVal(array $field): mixed {
    return $field['stringValue']
        ?? $field['booleanValue']
        ?? $field['integerValue']
        ?? $field['doubleValue']
        ?? $field['timestampValue']
        ?? null;
}

function fsDoc(array $doc): array {
    $id     = basename($doc['name'] ?? '');
    $fields = $doc['fields'] ?? [];
    $out    = ['id' => $id];
    foreach ($fields as $k => $v) {
        if (isset($v['arrayValue'])) {
            $out[$k] = array_map(fn($i) => fsVal($i), $v['arrayValue']['values'] ?? []);
        } elseif (isset($v['mapValue'])) {
            $out[$k] = $v['mapValue']['fields'] ?? [];
        } else {
            $out[$k] = fsVal($v);
        }
    }
    return $out;
}

// Obtener posts de Firestore
$docs  = firestoreGet('posts', $projectId, $databaseId, $token);
$posts = array_map('fsDoc', $docs);

if ($action === 'preview') {
    jsonOk(['count' => count($posts), 'posts' => array_map(fn($p) => ['id' => $p['id'], 'title' => $p['title'] ?? '?'], $posts)]);
}

// Importar
$db      = getDB();
$ok      = 0;
$skipped = 0;
$errors  = [];

foreach ($posts as $p) {
    $title    = $p['title'] ?? 'Sin título';
    $slug     = $p['slug'] ?? $p['id'];
    $content  = $p['content'] ?? $p['body'] ?? '';
    $excerpt  = $p['excerpt'] ?? $p['resumen'] ?? $p['summary'] ?? mb_substr(strip_tags($content), 0, 200);
    $category = $p['category'] ?? $p['categoria'] ?? 'General';
    $image    = $p['image'] ?? $p['imageUrl'] ?? $p['imagen'] ?? $p['coverImage'] ?? '';
    $keywords = is_array($p['keywords'] ?? null) ? implode(',', $p['keywords']) :
                (is_array($p['tags'] ?? null) ? implode(',', $p['tags']) : ($p['keywords'] ?? ''));
    $published = isset($p['published']) ? (bool)$p['published'] : true;
    $authorId  = $p['authorId'] ?? $p['author_id'] ?? $p['uid'] ?? ADMIN_UID;
    $authorEmail = $p['authorEmail'] ?? $p['author_email'] ?? $p['email'] ?? ADMIN_EMAIL;
    $createdAt = $p['createdAt'] ?? $p['created_at'] ?? nowISO();
    if (is_array($createdAt)) $createdAt = $createdAt['_seconds'] ? date('c', $createdAt['_seconds']) : nowISO();

    // Verificar si ya existe el slug
    $check = $db->prepare('SELECT id FROM posts WHERE slug = ?');
    $check->execute([$slug]);
    if ($check->fetch()) { $skipped++; continue; }

    try {
        $stmt = $db->prepare('
            INSERT INTO posts (id, title, slug, content, excerpt, category, image, keywords, published, author_id, author_email, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            generateId(), $title, $slug, $content, $excerpt, $category,
            $image, $keywords, $published ? 1 : 0,
            $authorId, $authorEmail, $createdAt, nowISO()
        ]);
        $ok++;
    } catch (\Throwable $e) {
        $errors[] = "'{$title}': " . $e->getMessage();
    }
}

jsonOk([
    'imported' => $ok,
    'skipped'  => $skipped,
    'errors'   => $errors,
    'message'  => "{$ok} posts importados, {$skipped} ya existían."
]);
