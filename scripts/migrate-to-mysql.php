<?php
/**
 * Migriert site-content.json in die MySQL-Datenbank
 * Aufruf: php scripts/migrate-to-mysql.php
 */

require_once __DIR__ . '/../api/config.php';

$jsonPath = __DIR__ . '/../src/data/site-content.json';

if (!file_exists($jsonPath)) {
    echo "Fehler: site-content.json nicht gefunden: $jsonPath\n";
    exit(1);
}

$raw = file_get_contents($jsonPath);
$content = json_decode($raw, true);

if (!$content) {
    echo "Fehler: JSON konnte nicht gelesen werden.\n";
    exit(1);
}

$db = getDB();

// --- Site Content Abschnitte einfügen ---
$sections = [
    'header', 'hero',
    'home_hotel', 'home_restaurant', 'home_events', 'home_gallery', 'home_promo', 'home_contact',
    'hotel_page', 'rooms_page', 'restaurant_page', 'wellness_page',
    'menu_page', 'drinks_page', 'buffet_page',
    'events_page', 'job_page', 'contact_page', 'directions_page',
    'footer',
];

$stmt = $db->prepare('INSERT INTO site_content (`key`, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = NOW()');

$count = 0;
foreach ($sections as $key) {
    if (isset($content[$key])) {
        $sectionData = $content[$key];

        // Events aus events_page entfernen (die kommen in eigene Tabelle)
        if ($key === 'events_page') {
            unset($sectionData['events']);
        }

        $stmt->execute([$key, json_encode($sectionData, JSON_UNESCAPED_UNICODE)]);
        $count++;
        echo "  ✓ $key\n";
    }
}
echo "\n$count Content-Abschnitte importiert.\n\n";

// --- Events in eigene Tabelle ---
$events = $content['events_page']['events'] ?? [];
if (empty($events)) {
    echo "Keine Events gefunden.\n";
} else {
    $eventStmt = $db->prepare('
        INSERT INTO events (id, title, date, time, price, description, image, gallery_image, recurring, max_seats, price_in_cents, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            title = VALUES(title), date = VALUES(date), time = VALUES(time),
            price = VALUES(price), description = VALUES(description),
            image = VALUES(image), gallery_image = VALUES(gallery_image),
            recurring = VALUES(recurring), max_seats = VALUES(max_seats),
            price_in_cents = VALUES(price_in_cents), sort_order = VALUES(sort_order),
            updated_at = NOW()
    ');

    foreach ($events as $i => $event) {
        $eventStmt->execute([
            $event['id'] ?? 'event-' . $i,
            $event['title'] ?? '',
            $event['date'] ?? '',
            $event['time'] ?? '',
            $event['price'] ?? '',
            $event['description'] ?? '',
            $event['image'] ?? '',
            $event['galleryImage'] ?? '',
            !empty($event['recurring']) ? 1 : 0,
            $event['maxSeats'] ?? null,
            $event['priceInCents'] ?? null,
            $i,
        ]);
        echo "  ✓ Event: " . ($event['title'] ?? 'Unbenannt') . "\n";
    }
    echo "\n" . count($events) . " Events importiert.\n";
}

echo "\nMigration abgeschlossen!\n";
