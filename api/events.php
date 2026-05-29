<?php
require_once __DIR__ . '/config.php';
corsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$db = getDB();

// --- GET /api/events.php --- (public)
if ($method === 'GET' && !$id) {
    $stmt = $db->query('SELECT * FROM events ORDER BY sort_order ASC');
    jsonResponse($stmt->fetchAll());
}

// --- GET /api/events.php?id=slug --- (public)
if ($method === 'GET' && $id) {
    $stmt = $db->prepare('SELECT * FROM events WHERE id = ?');
    $stmt->execute([$id]);
    $event = $stmt->fetch();
    if (!$event) jsonError('Event nicht gefunden.', 404);
    jsonResponse($event);
}

// --- POST /api/events.php --- (admin: neues Event)
if ($method === 'POST') {
    requireAuth();
    $body = getJsonBody();

    $eventId = $body['id'] ?? '';
    $title = $body['title'] ?? '';
    $date = $body['date'] ?? '';

    if (!$eventId || !$title || !$date) {
        jsonError('ID, Titel und Datum sind erforderlich.');
    }

    $stmt = $db->prepare('
        INSERT INTO events (id, title, date, time, price, description, image, gallery_image, recurring, max_seats, price_in_cents, sort_order, website)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $eventId,
        $title,
        $date,
        $body['time'] ?? '',
        $body['price'] ?? '',
        $body['description'] ?? '',
        $body['image'] ?? '',
        $body['gallery_image'] ?? $body['galleryImage'] ?? '',
        !empty($body['recurring']) ? 1 : 0,
        $body['max_seats'] ?? $body['maxSeats'] ?? null,
        $body['price_in_cents'] ?? $body['priceInCents'] ?? null,
        $body['sort_order'] ?? 999,
        $body['website'] ?? '',
    ]);

    jsonResponse(['success' => true], 201);
}

// --- PUT /api/events.php?id=slug --- (admin: Event aktualisieren)
if ($method === 'PUT' && $id) {
    requireAuth();
    $body = getJsonBody();

    $fields = [];
    $params = [];

    $mapping = [
        'title' => 'title',
        'date' => 'date',
        'time' => 'time',
        'price' => 'price',
        'description' => 'description',
        'image' => 'image',
        'gallery_image' => 'gallery_image',
        'galleryImage' => 'gallery_image',
        'recurring' => 'recurring',
        'max_seats' => 'max_seats',
        'maxSeats' => 'max_seats',
        'price_in_cents' => 'price_in_cents',
        'priceInCents' => 'price_in_cents',
        'website' => 'website',
    ];

    foreach ($mapping as $input => $column) {
        if (array_key_exists($input, $body)) {
            $fields[] = "`$column` = ?";
            $value = $body[$input];
            if ($column === 'recurring') $value = !empty($value) ? 1 : 0;
            if (in_array($column, ['max_seats', 'price_in_cents'])) {
                $value = $value ?: null;
            }
            $params[] = $value;
        }
    }

    if (empty($fields)) {
        jsonError('Keine Felder zum Aktualisieren.');
    }

    $params[] = $id;
    $sql = 'UPDATE events SET ' . implode(', ', $fields) . ' WHERE id = ?';
    $db->prepare($sql)->execute($params);

    jsonResponse(['success' => true]);
}

// --- DELETE /api/events.php?id=slug --- (admin)
if ($method === 'DELETE' && $id) {
    requireAuth();
    $stmt = $db->prepare('DELETE FROM events WHERE id = ?');
    $stmt->execute([$id]);
    jsonResponse(['success' => true]);
}

jsonError('Unbekannte Anfrage.', 404);
