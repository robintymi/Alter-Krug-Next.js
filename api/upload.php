<?php
/**
 * Bild-Upload Endpoint
 * POST /api/upload.php — Nimmt ein Bild entgegen, speichert es in /img/uploads/
 * Gibt den öffentlichen Pfad zurück.
 * Erfordert Admin-Authentifizierung.
 */

require_once __DIR__ . '/config.php';

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    jsonError('Nur POST erlaubt.', 405);
}

// Auth prüfen
requireAuth();

header('Content-Type: application/json; charset=utf-8');

// Upload-Verzeichnis
$uploadDir = dirname(__DIR__) . '/img/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Datei prüfen
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $errorCode = $_FILES['image']['error'] ?? -1;
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'Datei zu groß (Server-Limit).',
        UPLOAD_ERR_FORM_SIZE => 'Datei zu groß (Formular-Limit).',
        UPLOAD_ERR_PARTIAL => 'Datei nur teilweise hochgeladen.',
        UPLOAD_ERR_NO_FILE => 'Keine Datei ausgewählt.',
        UPLOAD_ERR_NO_TMP_DIR => 'Temporäres Verzeichnis fehlt.',
        UPLOAD_ERR_CANT_WRITE => 'Datei konnte nicht gespeichert werden.',
    ];
    jsonError($errorMessages[$errorCode] ?? 'Upload fehlgeschlagen.', 400);
}

$file = $_FILES['image'];

// Dateityp prüfen — primär über Dateiendung
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
$fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($fileExt, $allowedExtensions)) {
    jsonError('Ungültiges Dateiformat. Erlaubt: JPG, JPEG, PNG, WebP, GIF, AVIF.', 400);
}

// MIME-Typ für Dateinamen-Generierung ermitteln
$extToMime = [
    'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
    'png' => 'image/png', 'webp' => 'image/webp',
    'gif' => 'image/gif', 'avif' => 'image/avif',
];
$mimeType = $extToMime[$fileExt] ?? 'image/jpeg';

// Dateigröße prüfen (max 10 MB)
$maxSize = 10 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    jsonError('Datei zu groß. Maximum: 10 MB.', 400);
}

// Dateiname generieren (sicher + einzigartig)
$ext = match ($mimeType) {
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
    'image/avif' => 'avif',
    default => 'jpg',
};

// Optional: Unterordner aus POST-Parameter
$subfolder = '';
if (!empty($_POST['folder'])) {
    // Nur alphanumerisch, Bindestriche, Unterstriche erlauben
    $subfolder = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['folder']);
    if ($subfolder) {
        $uploadDir .= $subfolder . '/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
    }
}

// Originalnamen bereinigen für den Dateinamen
$originalName = pathinfo($file['name'], PATHINFO_FILENAME);
$safeName = preg_replace('/[^a-zA-Z0-9_-]/', '-', $originalName);
$safeName = preg_replace('/-+/', '-', $safeName);
$safeName = trim($safeName, '-');
if (strlen($safeName) > 50) {
    $safeName = substr($safeName, 0, 50);
}

// Eindeutigen Namen sicherstellen
$filename = $safeName . '.' . $ext;
$counter = 1;
while (file_exists($uploadDir . $filename)) {
    $filename = $safeName . '-' . $counter . '.' . $ext;
    $counter++;
}

// Datei verschieben & komprimieren
$destination = $uploadDir . $filename;
$compressed = false;

if (extension_loaded('gd') && in_array($mimeType, ['image/jpeg', 'image/png', 'image/webp'])) {
    $src = null;
    if ($mimeType === 'image/jpeg') {
        $src = @imagecreatefromjpeg($file['tmp_name']);
    } elseif ($mimeType === 'image/png') {
        $src = @imagecreatefrompng($file['tmp_name']);
    } elseif ($mimeType === 'image/webp') {
        $src = @imagecreatefromwebp($file['tmp_name']);
    }

    if ($src !== false && $src !== null) {
        $origW = imagesx($src);
        $origH = imagesy($src);
        $maxDim = 1920;

        if ($origW > $maxDim || $origH > $maxDim) {
            $ratio = min($maxDim / $origW, $maxDim / $origH);
            $newW = (int)round($origW * $ratio);
            $newH = (int)round($origH * $ratio);
            $resized = imagecreatetruecolor($newW, $newH);
            if ($mimeType === 'image/png') {
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
            }
            imagecopyresampled($resized, $src, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
            imagedestroy($src);
            $src = $resized;
        }

        if ($mimeType === 'image/jpeg') {
            $compressed = imagejpeg($src, $destination, 85);
        } elseif ($mimeType === 'image/png') {
            $compressed = imagepng($src, $destination, 7);
        } elseif ($mimeType === 'image/webp') {
            $compressed = imagewebp($src, $destination, 85);
        }
        imagedestroy($src);
    }
}

if (!$compressed && !move_uploaded_file($file['tmp_name'], $destination)) {
    jsonError('Datei konnte nicht gespeichert werden.', 500);
}

// Pfad für die Webseite zurückgeben
$webPath = '/img/uploads/' . ($subfolder ? $subfolder . '/' : '') . $filename;

echo json_encode([
    'success' => true,
    'path' => $webPath,
    'filename' => $filename,
    'size' => $file['size'],
    'type' => $mimeType,
], JSON_UNESCAPED_UNICODE);
