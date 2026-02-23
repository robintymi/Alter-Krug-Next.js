<?php
/**
 * Admin-Benutzer anlegen
 * Aufruf: php scripts/setup-admin.php info@alter-krug.de MeinPasswort
 * Oder über phpMyAdmin manuell INSERT
 */

require_once __DIR__ . '/../api/config.php';

$email = $argv[1] ?? null;
$password = $argv[2] ?? null;

if (!$email || !$password) {
    echo "Verwendung: php setup-admin.php <email> <passwort>\n";
    echo "\nOder manuell in phpMyAdmin:\n";
    echo "INSERT INTO admin_users (email, password_hash) VALUES (\n";
    echo "  'info@alter-krug.de',\n";
    echo "  '\$2y\$10\$...' -- bcrypt-Hash des Passworts\n";
    echo ");\n";
    echo "\nBcrypt-Hash online generieren: https://bcrypt-generator.com/\n";
    exit(1);
}

$hash = password_hash($password, PASSWORD_BCRYPT);

try {
    $db = getDB();
    $stmt = $db->prepare('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)');
    $stmt->execute([$email, $hash]);
    echo "Admin-Benutzer erstellt: $email\n";
    echo "Hash: $hash\n";
} catch (PDOException $e) {
    if (str_contains($e->getMessage(), 'Duplicate')) {
        echo "Benutzer $email existiert bereits.\n";
    } else {
        echo "Fehler: " . $e->getMessage() . "\n";
    }
    exit(1);
}
