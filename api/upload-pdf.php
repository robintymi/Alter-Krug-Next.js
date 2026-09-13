<?php
/**
 * PDF-Upload Endpoint
 * POST /api/upload-pdf.php — Nimmt eine PDF-Datei entgegen, speichert sie in /uploads/pdfs/
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
$uploadDir = dirname(__DIR__) . '/uploads/pdfs/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Datei prüfen
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errorCode = $_FILES['file']['error'] ?? -1;
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

$file = $_FILES['file'];

// Dateityp prüfen — Endung UND Inhalt (Magic Bytes), damit keine
// beliebigen Dateien unter falscher Endung hochgeladen werden können.
$fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if ($fileExt !== 'pdf') {
    jsonError('Ungültiges Dateiformat. Erlaubt: PDF.', 400);
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if ($mimeType !== 'application/pdf') {
    jsonError('Die Datei ist keine gültige PDF-Datei.', 400);
}

// Dateigröße prüfen (max 20 MB)
$maxSize = 20 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    jsonError('Datei zu groß. Maximum: 20 MB.', 400);
}

// Optional: Unterordner aus POST-Parameter
$subfolder = '';
if (!empty($_POST['folder'])) {
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
if ($safeName === '') {
    $safeName = 'dokument';
}

// Eindeutigen Namen sicherstellen
$filename = $safeName . '.pdf';
$counter = 1;
while (file_exists($uploadDir . $filename)) {
    $filename = $safeName . '-' . $counter . '.pdf';
    $counter++;
}

$destination = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    jsonError('Datei konnte nicht gespeichert werden.', 500);
}

// Pfad für die Webseite zurückgeben
$webPath = '/uploads/pdfs/' . ($subfolder ? $subfolder . '/' : '') . $filename;

echo json_encode([
    'success' => true,
    'path' => $webPath,
    'filename' => $filename,
    'size' => $file['size'],
    'type' => $mimeType,
], JSON_UNESCAPED_UNICODE);
