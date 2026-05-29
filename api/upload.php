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

// Dateityp prüfen
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = $finfo ? finfo_file($finfo, $file['tmp_name']) : mime_content_type($file['tmp_name']);
if ($finfo) finfo_close($finfo);

// Normalisiere image/jpg → image/jpeg
if ($mimeType === 'image/jpg') $mimeType = 'image/jpeg';

// Fallback auf Dateiendung falls MIME-Erkennung fehlschlägt
if (!$mimeType || $mimeType === 'application/octet-stream') {
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $extMap = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'gif' => 'image/gif', 'avif' => 'image/avif'];
    $mimeType = $extMap[$ext] ?? $mimeType;
}

if (!in_array($mimeType, $allowedTypes)) {
    jsonError('Ungültiges Dateiformat. Erlaubt: JPEG, PNG, WebP, GIF, AVIF.', 400);
}

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

// Datei verschieben
$destination = $uploadDir . $filename;
if (!move_uploaded_file($file['tmp_name'], $destination)) {
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
