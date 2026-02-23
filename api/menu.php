<?php
require_once __DIR__ . '/config.php';
corsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// --- GET /api/menu.php --- (public: Speise- und Getränkekarte)
if ($method === 'GET') {
    $stmt = $db->prepare('SELECT `key`, data FROM site_content WHERE `key` IN (?, ?)');
    $stmt->execute(['menu_page', 'drinks_page']);
    $rows = $stmt->fetchAll();

    $menuPage = ['title' => 'Speisekarte', 'categories' => []];
    $drinksPage = ['title' => 'Getränkekarte', 'categories' => []];

    foreach ($rows as $row) {
        $data = json_decode($row['data'], true);
        if ($row['key'] === 'menu_page') $menuPage = $data;
        if ($row['key'] === 'drinks_page') $drinksPage = $data;
    }

    jsonResponse(['menuPage' => $menuPage, 'drinksPage' => $drinksPage]);
}

// --- PUT /api/menu.php --- (admin: beide Karten speichern)
if ($method === 'PUT') {
    requireAuth();
    $body = getJsonBody();

    $menuPage = $body['menuPage'] ?? null;
    $drinksPage = $body['drinksPage'] ?? null;

    if (!$menuPage || !$drinksPage) {
        jsonError('menuPage und drinksPage erforderlich.');
    }

    $stmt = $db->prepare('
        INSERT INTO site_content (`key`, data) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = NOW()
    ');

    $stmt->execute(['menu_page', json_encode($menuPage, JSON_UNESCAPED_UNICODE)]);
    $stmt->execute(['drinks_page', json_encode($drinksPage, JSON_UNESCAPED_UNICODE)]);

    jsonResponse(['success' => true]);
}

jsonError('Unbekannte Anfrage.', 404);
