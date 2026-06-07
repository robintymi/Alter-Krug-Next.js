<?php
require_once __DIR__ . '/config.php';
header('Content-Type: text/plain; charset=utf-8');

try {
    $db = getDB();
    // website Spalte
    $stmt = $db->query("SHOW COLUMNS FROM events LIKE 'website'");
    if ($stmt->rowCount() > 0) {
        echo "OK: Spalte 'website' existiert bereits.\n";
    } else {
        $db->exec("ALTER TABLE events ADD COLUMN website VARCHAR(500) DEFAULT '' AFTER price_in_cents");
        echo "OK: Spalte 'website' hinzugefügt.\n";
    }

    // image_position Spalte
    $stmt = $db->query("SHOW COLUMNS FROM events LIKE 'image_position'");
    if ($stmt->rowCount() > 0) {
        echo "OK: Spalte 'image_position' existiert bereits.\n";
    } else {
        $db->exec("ALTER TABLE events ADD COLUMN image_position VARCHAR(20) DEFAULT 'center' AFTER website");
        echo "OK: Spalte 'image_position' hinzugefügt.\n";
    }
} catch (Exception $e) {
    echo "Fehler: " . $e->getMessage();
}
