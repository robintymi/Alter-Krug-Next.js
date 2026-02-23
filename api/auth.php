<?php
require_once __DIR__ . '/config.php';
corsHeaders();

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// --- POST /api/auth.php?action=login ---
if ($method === 'POST' && $action === 'login') {
    $body = getJsonBody();
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if (!$email || !$password) {
        jsonError('E-Mail und Passwort sind erforderlich.');
    }

    $db = getDB();
    $stmt = $db->prepare('SELECT id, password_hash FROM admin_users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonError('Ungültige Zugangsdaten.', 401);
    }

    // Token erstellen (64 Hex-Zeichen, 24h gültig)
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', time() + 86400);

    $stmt = $db->prepare('INSERT INTO admin_sessions (token, user_id, expires_at) VALUES (?, ?, ?)');
    $stmt->execute([$token, $user['id'], $expiresAt]);

    // Alte abgelaufene Sessions aufräumen
    $db->exec('DELETE FROM admin_sessions WHERE expires_at < NOW()');

    jsonResponse([
        'success' => true,
        'token' => $token,
        'expiresAt' => $expiresAt,
    ]);
}

// --- POST /api/auth.php?action=logout ---
if ($method === 'POST' && $action === 'logout') {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer\s+([a-f0-9]{64})$/i', $header, $m)) {
        $db = getDB();
        $stmt = $db->prepare('DELETE FROM admin_sessions WHERE token = ?');
        $stmt->execute([$m[1]]);
    }
    jsonResponse(['success' => true]);
}

// --- GET /api/auth.php?action=check ---
if ($method === 'GET' && $action === 'check') {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+([a-f0-9]{64})$/i', $header, $m)) {
        jsonResponse(['valid' => false]);
    }

    $db = getDB();
    $stmt = $db->prepare('
        SELECT u.email FROM admin_sessions s
        JOIN admin_users u ON u.id = s.user_id
        WHERE s.token = ? AND s.expires_at > NOW()
    ');
    $stmt->execute([$m[1]]);
    $row = $stmt->fetch();

    jsonResponse($row
        ? ['valid' => true, 'email' => $row['email']]
        : ['valid' => false]
    );
}

jsonError('Unbekannte Aktion.', 404);
