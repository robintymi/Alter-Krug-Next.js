<?php
// api/config.php — Zentrale Konfiguration (NICHT direkt via Browser aufrufbar)

// --- Datenbank ---
define('DB_HOST', 'sql2.udmedia.de');
define('DB_NAME', 'usr_ud05_370_10');
define('DB_USER', 'ud05_370');           // TODO: Benutzername anpassen
define('DB_PASS', 'TpayBmVVUn');

// --- Stripe ---
define('STRIPE_SECRET_KEY', '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');
define('STRIPE_WEBHOOK_SECRET', 'whsec_fZ3uve455cLENTU9as9TOZIMpl7nnJnC');

// --- Resend (E-Mail) ---
define('RESEND_API_KEY', 're_En4AMvYF_78z3d5kKeeBPoRjAbrHDLebt');
define('ADMIN_EMAIL', 'info@alter-krug.de');
define('FROM_EMAIL', 'onboarding@resend.dev');

// --- Site ---
define('SITE_URL', 'https://alter-krug-kallinchen.de');

// --- PDO Verbindung ---
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}

// --- CORS Headers ---
function corsHeaders(): void {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// --- JSON Response ---
function jsonResponse($data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $msg, int $status = 400): void {
    jsonResponse(['error' => $msg], $status);
}

// --- Auth Prüfung ---
function requireAuth(): int {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+([a-f0-9]{64})$/i', $header, $m)) {
        jsonError('Nicht autorisiert.', 401);
    }
    $token = $m[1];

    $db = getDB();
    $stmt = $db->prepare('
        SELECT s.user_id FROM admin_sessions s
        WHERE s.token = ? AND s.expires_at > NOW()
    ');
    $stmt->execute([$token]);
    $row = $stmt->fetch();

    if (!$row) {
        jsonError('Session abgelaufen.', 401);
    }
    return (int)$row['user_id'];
}

// --- UUID Generator ---
function generateUUID(): string {
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // Version 4
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // Variant
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

// --- JSON Body lesen ---
function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
