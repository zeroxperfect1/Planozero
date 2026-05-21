<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Método no permitido', 405);

$payload = requireAuth();

if (empty($_FILES['file'])) jsonError('No se recibió archivo');

$file     = $_FILES['file'];
$allowed  = ['image/jpeg','image/png','image/gif','image/webp','image/svg+xml'];
$mimeType = mime_content_type($file['tmp_name']);

if (!in_array($mimeType, $allowed)) jsonError('Tipo de archivo no permitido. Solo imágenes.');
if ($file['size'] > 10 * 1024 * 1024) jsonError('Archivo demasiado grande. Máximo 10MB.');

if (!is_dir(UPLOADS_DIR)) mkdir(UPLOADS_DIR, 0755, true);

$ext      = $mimeType === 'image/svg+xml' ? 'svg' : 'webp';
$filename = time() . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
$destPath = UPLOADS_DIR . $filename;

// Convert to WebP if possible (not SVG)
if ($mimeType !== 'image/svg+xml' && function_exists('imagewebp')) {
    $src = match($mimeType) {
        'image/jpeg' => imagecreatefromjpeg($file['tmp_name']),
        'image/png'  => imagecreatefrompng($file['tmp_name']),
        'image/gif'  => imagecreatefromgif($file['tmp_name']),
        'image/webp' => imagecreatefromwebp($file['tmp_name']),
        default      => null,
    };
    if ($src) {
        imagewebp($src, $destPath, 85);
        imagedestroy($src);
    } else {
        move_uploaded_file($file['tmp_name'], $destPath);
    }
} else {
    if ($mimeType === 'image/svg+xml') {
        $filename = time() . '-' . bin2hex(random_bytes(4)) . '.svg';
        $destPath = UPLOADS_DIR . $filename;
    }
    move_uploaded_file($file['tmp_name'], $destPath);
}

$url = UPLOADS_URL . $filename;

// Register in media table
try {
    $db   = getDB();
    $stmt = $db->prepare('INSERT INTO media (id, name, url, user_id, created_at) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([generateId(), $file['name'], $url, $payload['user_id'] ?? '', nowISO()]);
} catch (\Throwable $e) {
    // Non-fatal - file uploaded OK even if DB registration fails
}

jsonOk(['url' => $url, 'filename' => $filename], 201);
