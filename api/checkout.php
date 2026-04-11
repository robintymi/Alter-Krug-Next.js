<?php
require_once __DIR__ . '/config.php';

// Stripe PHP SDK laden
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Nur POST erlaubt.', 405);
}

$body = getJsonBody();
$eventId = $body['eventId'] ?? '';
$customerName = trim($body['customerName'] ?? '');
$customerEmail = trim($body['customerEmail'] ?? '');
$customerPhone = trim($body['customerPhone'] ?? '') ?: null;
$seats = (int)($body['seats'] ?? 0);

if (!$eventId || !$customerName || !$customerEmail || $seats < 1) {
    jsonError('Fehlende Pflichtfelder (eventId, customerName, customerEmail, seats).');
}

$db = getDB();

// Event laden
$stmt = $db->prepare('SELECT * FROM events WHERE id = ?');
$stmt->execute([$eventId]);
$event = $stmt->fetch();

if (!$event) {
    jsonError('Event nicht gefunden.', 404);
}

if (empty($event['price_in_cents'])) {
    jsonError('Dieses Event ist nicht buchbar.');
}

// Verfügbare Plätze prüfen
if ($event['max_seats']) {
    $stmt = $db->prepare("
        SELECT COALESCE(SUM(seats), 0) as booked
        FROM bookings
        WHERE event_id = ? AND status IN ('pending', 'confirmed')
    ");
    $stmt->execute([$eventId]);
    $booked = (int)$stmt->fetch()['booked'];
    $available = (int)$event['max_seats'] - $booked;

    if ($seats > $available) {
        jsonError("Nur noch $available Plätze verfügbar.");
    }
}

$totalCents = (int)$event['price_in_cents'] * $seats;
$bookingId = generateUUID();

// Booking in DB erstellen (status: pending)
$stmt = $db->prepare('
    INSERT INTO bookings (id, event_id, event_title, event_date, customer_name, customer_email, customer_phone, seats, total_price_cents, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
');
$stmt->execute([
    $bookingId,
    $eventId,
    $event['title'],
    $event['date'],
    $customerName,
    $customerEmail,
    $customerPhone,
    $seats,
    $totalCents,
    'pending',
]);

// Stripe Checkout Session erstellen
try {
    \Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);

    $seatLabel = $seats > 1 ? 'Plätze' : 'Platz';
    $session = \Stripe\Checkout\Session::create([
        // Keine payment_method_types angegeben → Stripe zeigt automatisch alle im Dashboard aktivierten Zahlungsmethoden
        'line_items' => [[
            'price_data' => [
                'currency' => 'eur',
                'product_data' => [
                    'name' => $event['title'] . " — $seats $seatLabel",
                    'description' => $event['date'] . ' | ' . $event['time'],
                ],
                'unit_amount' => $totalCents,
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => SITE_URL . "/buchung-bestaetigt/?session_id={CHECKOUT_SESSION_ID}&event_id=" . urlencode($eventId),
        'cancel_url' => SITE_URL . "/events/" . urlencode($eventId),
        'customer_email' => $customerEmail,
        'metadata' => [
            'booking_id' => $bookingId,
            'event_id' => $eventId,
        ],
    ]);

    // Stripe Session ID an Booking speichern
    $stmt = $db->prepare('UPDATE bookings SET stripe_session_id = ? WHERE id = ?');
    $stmt->execute([$session->id, $bookingId]);

    jsonResponse(['url' => $session->url]);
} catch (\Exception $e) {
    // Pending-Buchung bei Stripe-Fehler wieder löschen
    $db->prepare('DELETE FROM bookings WHERE id = ?')->execute([$bookingId]);
    jsonError('Stripe-Fehler: ' . $e->getMessage(), 500);
}
