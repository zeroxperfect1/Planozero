<?php
require_once __DIR__ . '/config.php';

// Captura errores fatales y devuelve JSON en vez de body vacío
ob_start();
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        ob_end_clean();
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Error fatal: ' . $error['message']], JSON_UNESCAPED_UNICODE);
    } else {
        ob_end_flush();
    }
});

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

// Convertir a WebP si GD lo soporta (no SVG)
$converted = false;
if ($mimeType !== 'image/svg+xml' && function_exists('imagewebp') && function_exists('imagecreatefromjpeg')) {
    try {
        $src = match($mimeType) {
            'image/jpeg' => imagecreatefromjpeg($file['tmp_name']),
            'image/png'  => imagecreatefrompng($file['tmp_name']),
            'image/gif'  => imagecreatefromgif($file['tmp_name']),
            'image/webp' => imagecreatefromwebp($file['tmp_name']),
            default      => null,
        };
        if ($src !== false && $src !== null) {
            imagewebp($src, $destPath, 85);
            imagedestroy($src);
            $converted = true;
        }
    } catch (\Throwable $e) {
        // GD falló — fallback a mover el archivo original
        $converted = false;
    }
}

if (!$converted) {
    // Sin conversión WebP: guardar con extensión original
    $origExt  = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg';
    $filename = time() . '-' . bin2hex(random_bytes(4)) . '.' . $origExt;
    $destPath = UPLOADS_DIR . $filename;
    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        jsonError('No se pudo guardar el archivo en el servidor.', 500);
    }
}

$url = UPLOADS_URL . $filename;

// Registrar en tabla media (no fatal si falla)
try {
    $db   = getDB();
    $stmt = $db->prepare('INSERT INTO media (id, name, url, user_id, created_at) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([generateId(), $file['name'], $url, $payload['user_id'] ?? '', nowISO()]);
} catch (\Throwable $e) {
    // No fatal
}

jsonOk(['url' => $url, 'filename' => $filename], 201);
