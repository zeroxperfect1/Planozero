<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'planozer_db');
define('DB_USER', 'planozer_raul');
define('DB_PASS', 'W,]wt7x7;KYS');
define('FIREBASE_PROJECT_ID', 'gen-lang-client-0646534496');
define('ADMIN_EMAIL', 'raul.mella.castro@gmail.com');
define('ADMIN_UID', 'uZQFMbDHTvXcCPzKqW37P35vUCt1');
define('UPLOADS_DIR', dirname(__DIR__) . '/uploads/');
define('UPLOADS_URL', '/uploads/');

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}

function setCorsHeaders(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function jsonOk($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function jsonError(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function base64UrlDecode(string $input): string {
    $remainder = strlen($input) % 4;
    if ($remainder) $input .= str_repeat('=', 4 - $remainder);
    return base64_decode(strtr($input, '-_', '+/'));
}

function getGooglePublicKeys(): array {
    $cacheFile = sys_get_temp_dir() . '/firebase_keys_' . FIREBASE_PROJECT_ID . '.json';
    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < 3600) {
        return json_decode(file_get_contents($cacheFile), true) ?? [];
    }
    $url = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    $content = curl_exec($ch);
    curl_close($ch);
    if ($content === false) {
        return file_exists($cacheFile) ? json_decode(file_get_contents($cacheFile), true) ?? [] : [];
    }
    file_put_contents($cacheFile, $content);
    return json_decode($content, true) ?? [];
}

function verifyFirebaseToken(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$headerB64, $payloadB64, $signatureB64] = $parts;
    $header  = json_decode(base64UrlDecode($headerB64), true);
    $payload = json_decode(base64UrlDecode($payloadB64), true);
    if (!$header || !$payload) return null;
    if (($payload['exp'] ?? 0) < time()) return null;
    if (($payload['iss'] ?? '') !== 'https://securetoken.google.com/' . FIREBASE_PROJECT_ID) return null;
    if (($payload['aud'] ?? '') !== FIREBASE_PROJECT_ID) return null;
    $certs = getGooglePublicKeys();
    $kid = $header['kid'] ?? '';
    if (!isset($certs[$kid])) return null;
    $publicKey = openssl_pkey_get_public($certs[$kid]);
    if (!$publicKey) return null;
    $signingInput = $headerB64 . '.' . $payloadB64;
    $signature   = base64UrlDecode($signatureB64);
    $verified    = openssl_verify($signingInput, $signature, $publicKey, OPENSSL_ALGO_SHA256);
    if ($verified !== 1) return null;
    return $payload;
}

function requireAuth(): array {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($authHeader, 'Bearer ')) jsonError('No autenticado', 401);
    $token   = substr($authHeader, 7);
    $payload = verifyFirebaseToken($token);
    if (!$payload) jsonError('Token inválido o expirado', 401);
    return $payload;
}

function requireAdmin(): array {
    $payload = requireAuth();
    $isAdmin = ($payload['email'] ?? '') === ADMIN_EMAIL || ($payload['user_id'] ?? '') === ADMIN_UID;
    if (!$isAdmin) jsonError('No autorizado', 403);
    return $payload;
}

function generateId(): string {
    return bin2hex(random_bytes(12));
}

function getBody(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function nowISO(): string {
    return (new DateTime())->format('c');
}
