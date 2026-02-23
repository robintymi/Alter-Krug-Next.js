<?php
require_once __DIR__ . '/config.php';
corsHeaders();

$eventId = $_GET['event_id'] ?? '';

if ($_SERVER['REQUEST_METHOD'] !== 'GET' || !$eventId) {
    jsonError('event_id Parameter erforderlich.');
}

$db = getDB();

// Event laden für max_seats
$stmt = $db->prepare('SELECT max_seats FROM events WHERE id = ?');
$stmt->execute([$eventId]);
$event = $stmt->fetch();

if (!$event) {
    jsonError('Event nicht gefunden.', 404);
}

$maxSeats = (int)($event['max_seats'] ?? 0);

// Gebuchte Plätze zählen
$stmt = $db->prepare("
    SELECT COALESCE(SUM(seats), 0) as booked
    FROM bookings
    WHERE event_id = ? AND status IN ('pending', 'confirmed')
");
$stmt->execute([$eventId]);
$result = $stmt->fetch();

$booked = (int)$result['booked'];
$available = max(0, $maxSeats - $booked);

jsonResponse([
    'maxSeats' => $maxSeats,
    'bookedSeats' => $booked,
    'available' => $available,
]);
