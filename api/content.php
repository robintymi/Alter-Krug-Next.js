<?php
require_once __DIR__ . '/config.php';
corsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$key = $_GET['key'] ?? null;
$db = getDB();

// --- GET /api/content.php --- (public: alle Abschnitte, für Build)
if ($method === 'GET' && !$key) {
    $stmt = $db->query('SELECT `key`, data FROM site_content');
    $rows = $stmt->fetchAll();

    // data ist JSON-String in MySQL → dekodieren
    $result = [];
    foreach ($rows as $row) {
        $result[] = [
            'key' => $row['key'],
            'data' => json_decode($row['data'], true),
        ];
    }

    jsonResponse($result);
}

// --- GET /api/content.php?key=X --- (public: einzelner Abschnitt)
if ($method === 'GET' && $key) {
    $stmt = $db->prepare('SELECT data FROM site_content WHERE `key` = ?');
    $stmt->execute([$key]);
    $row = $stmt->fetch();

    if (!$row) jsonError('Abschnitt nicht gefunden.', 404);
    jsonResponse(json_decode($row['data'], true));
}

// --- PUT /api/content.php?key=X --- (admin: Abschnitt speichern)
if ($method === 'PUT' && $key) {
    requireAuth();
    $body = getJsonBody();

    $stmt = $db->prepare('
        INSERT INTO site_content (`key`, data) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = NOW()
    ');
    $stmt->execute([$key, json_encode($body, JSON_UNESCAPED_UNICODE)]);

    jsonResponse(['success' => true]);
}

jsonError('Unbekannte Anfrage.', 404);
