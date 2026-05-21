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

$file = $_FILES['file'];

/**
 * Detecta el MIME type por magic bytes (no requiere extensión fileinfo).
 */
function detectMimeType(string $tmpPath, string $originalName): string {
    $extMap = [
        'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
        'png'  => 'image/png',
        'gif'  => 'image/gif',
        'webp' => 'image/webp',
        'svg'  => 'image/svg+xml',
    ];

    // Leer primeros 12 bytes para magic bytes
    $handle = @fopen($tmpPath, 'rb');
    if ($handle) {
        $bytes = fread($handle, 12);
        fclose($handle);

        // JPEG: FF D8 FF
        if (substr($bytes, 0, 3) === "\xFF\xD8\xFF") return 'image/jpeg';
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (substr($bytes, 0, 8) === "\x89PNG\r\n\x1a\n") return 'image/png';
        // GIF
        if (substr($bytes, 0, 6) === 'GIF87a' || substr($bytes, 0, 6) === 'GIF89a') return 'image/gif';
        // WebP: RIFF????WEBP
        if (substr($bytes, 0, 4) === 'RIFF' && substr($bytes, 8, 4) === 'WEBP') return 'image/webp';
        // SVG (XML/text)
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        if ($ext === 'svg') return 'image/svg+xml';
    }

    // Fallback por extensión
    $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    return $extMap[$ext] ?? 'application/octet-stream';
}

$mimeType = detectMimeType($file['tmp_name'], $file['name']);
$allowed  = ['image/jpeg','image/png','image/gif','image/webp','image/svg+xml'];

if (!in_array($mimeType, $allowed)) jsonError('Tipo de archivo no permitido. Solo imágenes (jpg, png, gif, webp, svg).');
if ($file['size'] > 10 * 1024 * 1024) jsonError('Archivo demasiado grande. Máximo 10MB.');

if (!is_dir(UPLOADS_DIR)) mkdir(UPLOADS_DIR, 0755, true);

$ext      = $mimeType === 'image/svg+xml' ? 'svg' : 'webp';
$filename = time() . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
$destPath = UPLOADS_DIR . $filename;

// Convertir a WebP si GD lo soporta
$converted = false;
if ($mimeType !== 'image/svg+xml' && function_exists('imagewebp')) {
    try {
        $src = match($mimeType) {
            'image/jpeg' => @imagecreatefromjpeg($file['tmp_name']),
            'image/png'  => @imagecreatefrompng($file['tmp_name']),
            'image/gif'  => @imagecreatefromgif($file['tmp_name']),
            'image/webp' => @imagecreatefromwebp($file['tmp_name']),
            default      => null,
        };
        if ($src !== false && $src !== null) {
            imagewebp($src, $destPath, 85);
            imagedestroy($src);
            $converted = true;
        }
    } catch (\Throwable $e) {
        $converted = false;
    }
}

if (!$converted) {
    // Sin WebP: guardar con extensión original
    $origExt  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) ?: 'jpg';
    $filename = time() . '-' . bin2hex(random_bytes(4)) . '.' . $origExt;
    $destPath = UPLOADS_DIR . $filename;
    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        jsonError('No se pudo guardar el archivo en el servidor.', 500);
    }
}

$url = UPLOADS_URL . $filename;

// Registrar en tabla media
try {
    $db   = getDB();
    $stmt = $db->prepare('INSERT INTO media (id, name, url, user_id, created_at) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([generateId(), $file['name'], $url, $payload['user_id'] ?? '', nowISO()]);
} catch (\Throwable $e) {
    // No fatal
}

jsonOk(['url' => $url, 'filename' => $filename], 201);
