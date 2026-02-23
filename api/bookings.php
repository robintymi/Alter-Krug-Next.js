<?php
require_once __DIR__ . '/config.php';
corsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// --- GET /api/bookings.php --- (admin: alle Buchungen)
if ($method === 'GET' && !isset($_GET['event_id'])) {
    requireAuth();
    $stmt = $db->query('SELECT * FROM bookings ORDER BY created_at DESC');
    jsonResponse($stmt->fetchAll());
}

// --- GET /api/bookings.php?event_id=X --- (admin: Buchungen für Event)
if ($method === 'GET' && isset($_GET['event_id'])) {
    requireAuth();
    $stmt = $db->prepare('SELECT * FROM bookings WHERE event_id = ? ORDER BY created_at DESC');
    $stmt->execute([$_GET['event_id']]);
    jsonResponse($stmt->fetchAll());
}

// --- PUT /api/bookings.php?id=X&action=cancel --- (admin: Buchung stornieren)
if ($method === 'PUT') {
    requireAuth();
    $id = $_GET['id'] ?? '';
    $action = $_GET['action'] ?? '';

    if (!$id || $action !== 'cancel') {
        jsonError('Buchungs-ID und action=cancel erforderlich.');
    }

    $stmt = $db->prepare('UPDATE bookings SET status = ? WHERE id = ?');
    $stmt->execute(['cancelled', $id]);
    jsonResponse(['success' => true]);
}

jsonError('Unbekannte Anfrage.', 404);
