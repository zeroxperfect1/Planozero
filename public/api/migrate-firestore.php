<?php
/**
 * migrate-firestore.php — Diagnóstico + Migración Firestore → MySQL
 */
require_once __DIR__ . '/config.php';
setCorsHeaders();

$payload  = requireAdmin();
$action   = $_GET['action'] ?? 'debug';
$token    = substr($_SERVER['HTTP_AUTHORIZATION'], 7);
$projectId = FIREBASE_PROJECT_ID;

$databases = [
    'ai-studio-70ea9f7b-cc5b-43f8-ac6f-140160042b91',
    '(default)',
];

function firestoreRaw(string $col, string $project, string $db, string $token): array {
    $enc = rawurlencode($db);
    $url = "https://firestore.googleapis.com/v1/projects/{$project}/databases/{$enc}/documents/{$col}?pageSize=100";
    $ch  = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$token}"],
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'parsed' => json_decode($body, true) ?? [], 'raw' => substr($body, 0, 300)];
}

function fsVal($field): mixed {
    if (!is_array($field)) return $field;
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
        } else {
            $out[$k] = fsVal($v);
        }
    }
    return $out;
}

// ── DEBUG: muestra qué hay en cada base de datos ──────────────────────────────
if ($action === 'debug') {
    $results = [];
    foreach ($databases as $dbId) {
        foreach (['posts', 'pages', 'blog', 'articles', 'noticias'] as $col) {
            $r = firestoreRaw($col, $projectId, $dbId, $token);
            $count = count($r['parsed']['documents'] ?? []);
            $results[] = [
                'db'     => $dbId,
                'col'    => $col,
                'status' => $r['code'],
                'docs'   => $count,
                'preview'=> $count > 0 ? array_map(fn($d) => ['id' => basename($d['name']), 'fields' => array_keys($d['fields'] ?? [])], array_slice($r['parsed']['documents'], 0, 2)) : null,
                'error'  => $r['parsed']['error']['message'] ?? null,
            ];
        }
    }
    jsonOk(['debug' => $results]);
}

// ── PREVIEW: cuenta posts en la DB correcta ───────────────────────────────────
if ($action === 'preview') {
    $found = [];
    foreach ($databases as $dbId) {
        $r    = firestoreRaw('posts', $projectId, $dbId, $token);
        $docs = $r['parsed']['documents'] ?? [];
        if (count($docs) > 0) {
            $found[] = [
                'db'    => $dbId,
                'count' => count($docs),
                'posts' => array_map(fn($d) => ['id' => basename($d['name']), 'title' => $d['fields']['title']['stringValue'] ?? '?'], $docs),
            ];
        }
    }
    jsonOk(['results' => $found, 'message' => count($found) === 0 ? 'No se encontraron posts en ninguna base de datos' : 'Posts encontrados']);
}

// ── IMPORT: migra posts ───────────────────────────────────────────────────────
if ($action === 'import') {
    $dbId = $_GET['db'] ?? $databases[0];
    $raw  = firestoreRaw('posts', $projectId, $dbId, $token);
    $docs = $raw['parsed']['documents'] ?? [];

    if (empty($docs)) jsonError("No se encontraron posts en db: {$dbId}. Usa ?action=debug primero.", 404);

    $db2 = getDB();
    $ok = $skipped = 0;
    $errors = [];

    foreach (array_map('fsDoc', $docs) as $p) {
        $title    = $p['title'] ?? 'Sin título';
        $slug     = $p['slug'] ?? $p['id'];
        $content  = $p['content'] ?? $p['body'] ?? '';
        $excerpt  = $p['excerpt'] ?? mb_substr(strip_tags($content), 0, 200);
        $category = $p['category'] ?? $p['categoria'] ?? 'General';
        $image    = $p['image'] ?? $p['imageUrl'] ?? $p['coverImage'] ?? '';
        $kw       = is_array($p['keywords'] ?? null) ? implode(',', $p['keywords']) : ($p['keywords'] ?? '');
        $pub      = isset($p['published']) ? (bool)$p['published'] : true;
        $uid      = $p['authorId'] ?? $p['uid'] ?? ADMIN_UID;
        $email    = $p['authorEmail'] ?? $p['email'] ?? ADMIN_EMAIL;
        $created  = $p['createdAt'] ?? nowISO();

        $check = $db2->prepare('SELECT id FROM posts WHERE slug = ?');
        $check->execute([$slug]);
        if ($check->fetch()) { $skipped++; continue; }

        try {
            $stmt = $db2->prepare('INSERT INTO posts (id,title,slug,content,excerpt,category,image,keywords,published,author_id,author_email,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
            $stmt->execute([generateId(),$title,$slug,$content,$excerpt,$category,$image,$kw,$pub?1:0,$uid,$email,$created,nowISO()]);
            $ok++;
        } catch (\Throwable $e) { $errors[] = "{$title}: ".$e->getMessage(); }
    }

    jsonOk(['imported'=>$ok,'skipped'=>$skipped,'errors'=>$errors,'message'=>"{$ok} posts importados de db: {$dbId}"]);
}

jsonError('Acción no reconocida. Usa: debug, preview, import');
