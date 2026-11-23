<?php
/**
 * Einmaliges Wartungsskript: komprimiert bereits hochgeladene, über den
 * Admin-Bereich eingestellte Bilder (api/upload.php lief vorher ohne
 * WebP-Umwandlung) und aktualisiert alle Datenbank-Referenzen (Events,
 * Speise-/Getränkekarte) auf die neue, komprimierte Datei.
 *
 * - Lässt die alte Originaldatei unangetastet liegen (kein Datenverlust,
 *   nur nicht mehr referenziert) — kann space sparen gelöscht werden,
 *   sobald alles geprüft ist.
 * - Mehrfaches Aufrufen ist ungefährlich: bereits optimierte Dateien
 *   werden übersprungen.
 *
 * WICHTIG: Nach Gebrauch diese Datei vom Server löschen!
 */

require_once __DIR__ . '/config.php';

header('Content-Type: text/plain; charset=utf-8');

$uploadsDir = dirname(__DIR__) . '/img/uploads/';

if (!is_dir($uploadsDir)) {
    echo "Kein Upload-Verzeichnis gefunden unter $uploadsDir — nichts zu tun.\n";
    exit;
}

$serverSupportsWebp = extension_loaded('gd') && function_exists('imagewebp') && function_exists('imagecreatefromwebp');
if (!$serverSupportsWebp) {
    echo "WARNUNG: Dieser Server unterstützt keine WebP-Erzeugung (GD ohne WebP-Support).\n";
    echo "Abgebrochen — es wurde nichts verändert.\n";
    exit;
}

// --- Schritt 1: Alle Bilddateien im Upload-Ordner rekursiv finden ---
function findImageFiles(string $dir): array {
    $result = [];
    $items = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)
    );
    foreach ($items as $item) {
        if ($item->isFile()) {
            $ext = strtolower(pathinfo($item->getFilename(), PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png'], true)) {
                $result[] = $item->getPathname();
            }
        }
    }
    return $result;
}

$files = findImageFiles($uploadsDir);
echo "Gefundene JPEG/PNG-Dateien im Upload-Ordner: " . count($files) . "\n\n";

// --- Schritt 2: Jede Datei komprimieren (resize + WebP), altes Original behalten ---
$maxDim = 1920;
$pathMap = []; // alter öffentlicher Pfad => neuer öffentlicher Pfad

foreach ($files as $fullPath) {
    $relative = str_replace(dirname(__DIR__), '', $fullPath);
    $relative = str_replace('\\', '/', $relative);
    $oldWebPath = $relative; // z.B. /img/uploads/speisekarte/Hokkaido.png

    $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
    $newFullPath = preg_replace('/\.(jpe?g|png)$/i', '.webp', $fullPath);
    $newWebPath = preg_replace('/\.(jpe?g|png)$/i', '.webp', $oldWebPath);

    if (file_exists($newFullPath)) {
        // Schon einmal optimiert — nur die Referenz-Zuordnung merken, nichts neu erzeugen.
        $pathMap[$oldWebPath] = $newWebPath;
        echo "ÜBERSPRUNGEN (bereits vorhanden): $relative\n";
        continue;
    }

    $src = $ext === 'png' ? @imagecreatefrompng($fullPath) : @imagecreatefromjpeg($fullPath);
    if (!$src) {
        echo "FEHLER beim Lesen: $relative\n";
        continue;
    }

    $origW = imagesx($src);
    $origH = imagesy($src);
    if ($origW > $maxDim || $origH > $maxDim) {
        $ratio = min($maxDim / $origW, $maxDim / $origH);
        $newW = (int) round($origW * $ratio);
        $newH = (int) round($origH * $ratio);
        $resized = imagecreatetruecolor($newW, $newH);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        imagecopyresampled($resized, $src, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
        imagedestroy($src);
        $src = $resized;
    }

    $ok = imagewebp($src, $newFullPath, 80);
    imagedestroy($src);

    if (!$ok) {
        echo "FEHLER beim Speichern: $relative\n";
        continue;
    }

    $oldSize = filesize($fullPath);
    $newSize = filesize($newFullPath);
    $pathMap[$oldWebPath] = $newWebPath;

    printf(
        "OK: %s -> %s  (%s KB -> %s KB, -%d%%)\n",
        $relative,
        basename($newWebPath),
        number_format($oldSize / 1024, 0),
        number_format($newSize / 1024, 0),
        round((1 - $newSize / $oldSize) * 100)
    );
}

if (empty($pathMap)) {
    echo "\nKeine Bilder zu verarbeiten — fertig.\n";
    exit;
}

// --- Schritt 3: Datenbank-Referenzen aktualisieren ---
echo "\n--- Datenbank-Referenzen aktualisieren ---\n";
$db = getDB();

function replacePathsRecursive($value, array $pathMap, bool &$changed) {
    if (is_string($value)) {
        if (isset($pathMap[$value])) {
            $changed = true;
            return $pathMap[$value];
        }
        return $value;
    }
    if (is_array($value)) {
        foreach ($value as $k => $v) {
            $value[$k] = replacePathsRecursive($v, $pathMap, $changed);
        }
        return $value;
    }
    return $value;
}

// Events-Tabelle (image, gallery_image)
$stmt = $db->query('SELECT id, image, gallery_image FROM events');
$events = $stmt->fetchAll();
$eventsUpdated = 0;

foreach ($events as $event) {
    $newImage = $pathMap[$event['image']] ?? null;
    $newGallery = $pathMap[$event['gallery_image']] ?? null;

    if ($newImage !== null || $newGallery !== null) {
        $db->prepare('UPDATE events SET image = ?, gallery_image = ? WHERE id = ?')->execute([
            $newImage ?? $event['image'],
            $newGallery ?? $event['gallery_image'],
            $event['id'],
        ]);
        $eventsUpdated++;
        echo "Event '{$event['id']}' aktualisiert.\n";
    }
}

// site_content-Tabelle (Speise-/Getränkekarte, alle anderen JSON-Abschnitte zur Sicherheit mit)
$stmt = $db->query('SELECT `key`, data FROM site_content');
$rows = $stmt->fetchAll();
$contentUpdated = 0;

foreach ($rows as $row) {
    $data = json_decode($row['data'], true);
    if (!is_array($data)) continue;

    $changed = false;
    $newData = replacePathsRecursive($data, $pathMap, $changed);

    if ($changed) {
        $db->prepare('UPDATE site_content SET data = ? WHERE `key` = ?')
            ->execute([json_encode($newData, JSON_UNESCAPED_UNICODE), $row['key']]);
        $contentUpdated++;
        echo "site_content-Abschnitt '{$row['key']}' aktualisiert.\n";
    }
}

echo "\n--- Fertig ---\n";
echo "Bilder verarbeitet: " . count($pathMap) . "\n";
echo "Events aktualisiert: $eventsUpdated\n";
echo "Inhalts-Abschnitte aktualisiert: $contentUpdated\n";
echo "\nDie alten Originaldateien wurden NICHT gelöscht (zur Sicherheit).\n";
echo "Bitte Speisekarte/Getränkekarte und betroffene Events auf der Website prüfen,\n";
echo "danach kann diese Datei (optimize-uploads.php) vom Server gelöscht werden.\n";
