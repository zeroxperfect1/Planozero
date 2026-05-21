<?php
/**
 * mail.php — Endpoint de envío de email para el Dashboard de Planozero
 * Ubicación en servidor: /public_html/api/mail.php
 *
 * Reemplaza el endpoint Node.js /api/admin/respond-email
 * Solo acepta POST con JSON. Requiere que el hosting tenga mail() habilitado.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Leer body JSON
$body = json_decode(file_get_contents('php://input'), true);
if (!$body) {
    http_response_code(400);
    echo json_encode(['error' => 'Body JSON inválido']);
    exit;
}

$to      = filter_var($body['to'] ?? '', FILTER_SANITIZE_EMAIL);
$subject = strip_tags($body['subject'] ?? 'Respuesta de PlanoZero');
$message = strip_tags($body['message'] ?? '');
$from    = 'hola@planozero.cl';

if (!filter_var($to, FILTER_VALIDATE_EMAIL) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos o email inválido']);
    exit;
}

// Cabeceras del email
$headers  = "From: PlanoZero <{$from}>\r\n";
$headers .= "Reply-To: {$from}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "X-Mailer: PlanoZero CMS\r\n";

// Cuerpo HTML del email
$htmlBody = '
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>' . htmlspecialchars($subject) . '</title></head>
<body style="font-family:Arial,sans-serif;background:#0a0a0a;color:#e4e4e7;padding:32px;margin:0;">
  <div style="max-width:600px;margin:0 auto;background:#18181b;border-radius:16px;padding:32px;border:1px solid #27272a;">
    <div style="margin-bottom:24px;">
      <span style="font-size:11px;font-weight:700;letter-spacing:4px;color:#FF5F1F;text-transform:uppercase;font-family:monospace;">PLANOZERO</span>
    </div>
    <h2 style="color:#fff;font-size:22px;margin:0 0 16px;">' . htmlspecialchars($subject) . '</h2>
    <div style="color:#a1a1aa;line-height:1.7;font-size:15px;">' . nl2br(htmlspecialchars($message)) . '</div>
    <hr style="border:none;border-top:1px solid #27272a;margin:24px 0;">
    <p style="font-size:11px;color:#52525b;font-family:monospace;">
      PlanoZero · Estudio de branding y diseño estratégico<br>
      Santiago, Chile · hola@planozero.cl
    </p>
  </div>
</body>
</html>';

// Enviar
$sent = mail($to, $subject, $htmlBody, $headers);

if ($sent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Email enviado correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo enviar el email. Verifica la configuración de mail() en el hosting.']);
}
