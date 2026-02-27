<?php
/**
 * Einmalige Admin-Einrichtung (web-basiert)
 *
 * 1. MySQL-Schema anlegen
 * 2. Admin-Benutzer erstellen
 *
 * WICHTIG: Nach Einrichtung diese Datei vom Server löschen!
 */

require_once __DIR__ . '/config.php';

$message = '';
$error = '';
$step = 'check';

// DB-Verbindung testen
try {
    $db = getDB();
    $dbOk = true;
} catch (Exception $e) {
    $dbOk = false;
    $error = 'DB-Verbindung fehlgeschlagen: ' . $e->getMessage();
}

// Prüfen ob Tabellen existieren
$tablesExist = false;
if ($dbOk) {
    try {
        $db->query('SELECT 1 FROM admin_users LIMIT 1');
        $tablesExist = true;
    } catch (Exception $e) {
        $tablesExist = false;
    }
}

// Prüfen ob Admin-User existiert
$adminExists = false;
if ($tablesExist) {
    $count = $db->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
    $adminExists = $count > 0;
}

// --- Aktionen ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $dbOk) {
    $action = $_POST['action'] ?? '';

    // Tabellen erstellen
    if ($action === 'create_tables') {
        try {
            $schema = file_get_contents(__DIR__ . '/../mysql-schema.sql');
            if (!$schema) {
                $schema = file_get_contents(__DIR__ . '/schema.sql');
            }
            if ($schema) {
                // Einzelne Statements ausführen
                $statements = array_filter(
                    array_map('trim', explode(';', $schema)),
                    fn($s) => strlen($s) > 10
                );
                foreach ($statements as $sql) {
                    $db->exec($sql);
                }
                $message = 'Tabellen erfolgreich erstellt!';
                $tablesExist = true;
            } else {
                $error = 'mysql-schema.sql nicht gefunden.';
            }
        } catch (Exception $e) {
            $error = 'Fehler beim Erstellen: ' . $e->getMessage();
        }
    }

    // Admin-User erstellen
    if ($action === 'create_admin' && $tablesExist) {
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $password2 = $_POST['password2'] ?? '';

        if (!$email || !$password) {
            $error = 'E-Mail und Passwort sind erforderlich.';
        } elseif ($password !== $password2) {
            $error = 'Passwörter stimmen nicht überein.';
        } elseif (strlen($password) < 6) {
            $error = 'Passwort muss mindestens 6 Zeichen lang sein.';
        } else {
            try {
                $hash = password_hash($password, PASSWORD_BCRYPT);
                $stmt = $db->prepare('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)');
                $stmt->execute([$email, $hash]);
                $message = "Admin-Benutzer '$email' erfolgreich erstellt!";
                $adminExists = true;
            } catch (PDOException $e) {
                if (str_contains($e->getMessage(), 'Duplicate')) {
                    $error = "E-Mail '$email' existiert bereits.";
                } else {
                    $error = 'Fehler: ' . $e->getMessage();
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Alter Krug — Admin Setup</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f8f4ee; color: #2d1f12; padding: 2rem; }
        .container { max-width: 500px; margin: 0 auto; }
        .card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 8px 30px rgba(20,10,4,0.12); margin-bottom: 1.5rem; }
        h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        h2 { font-size: 1.1rem; margin-bottom: 1rem; color: #8b4513; }
        .status { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; font-size: 0.9rem; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot.green { background: #22c55e; }
        .dot.red { background: #ef4444; }
        .dot.yellow { background: #eab308; }
        label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem; color: #5a3e1a; }
        input[type="email"], input[type="password"] { width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #d4c4a8; border-radius: 8px; font-size: 0.95rem; margin-bottom: 0.8rem; }
        button { background: #b35c1e; color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer; width: 100%; }
        button:hover { background: #934b18; }
        .msg { padding: 0.8rem; border-radius: 8px; font-size: 0.9rem; margin-bottom: 1rem; }
        .msg.success { background: #dcfce7; color: #166534; }
        .msg.error { background: #fee2e2; color: #991b1b; }
        .warning { background: #fef3c7; border: 1px solid #fbbf24; padding: 1rem; border-radius: 8px; font-size: 0.85rem; color: #92400e; margin-top: 1rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>Alter Krug — Admin Setup</h1>
            <p style="font-size: 0.9rem; color: #8b7355; margin-bottom: 1.5rem;">Einmalige Einrichtung der Datenbank und des Admin-Zugangs.</p>

            <?php if ($message): ?>
                <div class="msg success"><?= htmlspecialchars($message) ?></div>
            <?php endif; ?>
            <?php if ($error): ?>
                <div class="msg error"><?= htmlspecialchars($error) ?></div>
            <?php endif; ?>

            <h2>Status</h2>
            <div class="status">
                <span class="dot <?= $dbOk ? 'green' : 'red' ?>"></span>
                Datenbankverbindung <?= $dbOk ? 'OK' : 'fehlgeschlagen' ?>
            </div>
            <div class="status">
                <span class="dot <?= $tablesExist ? 'green' : ($dbOk ? 'yellow' : 'red') ?>"></span>
                Tabellen <?= $tablesExist ? 'vorhanden' : 'nicht vorhanden' ?>
            </div>
            <div class="status">
                <span class="dot <?= $adminExists ? 'green' : ($tablesExist ? 'yellow' : 'red') ?>"></span>
                Admin-Benutzer <?= $adminExists ? 'vorhanden' : 'nicht vorhanden' ?>
            </div>
        </div>

        <?php if ($dbOk && !$tablesExist): ?>
        <div class="card">
            <h2>Schritt 1: Tabellen erstellen</h2>
            <p style="font-size: 0.9rem; color: #8b7355; margin-bottom: 1rem;">Erstellt die notwendigen MySQL-Tabellen (events, bookings, site_content, admin_users, admin_sessions).</p>
            <form method="post">
                <input type="hidden" name="action" value="create_tables">
                <button type="submit">Tabellen erstellen</button>
            </form>
        </div>
        <?php endif; ?>

        <?php if ($tablesExist && !$adminExists): ?>
        <div class="card">
            <h2>Schritt 2: Admin-Benutzer erstellen</h2>
            <form method="post">
                <input type="hidden" name="action" value="create_admin">
                <label for="email">E-Mail</label>
                <input type="email" id="email" name="email" required placeholder="info@alter-krug.de" value="info@alter-krug-kallinchen.de">
                <label for="password">Passwort</label>
                <input type="password" id="password" name="password" required placeholder="Sicheres Passwort" minlength="6">
                <label for="password2">Passwort wiederholen</label>
                <input type="password" id="password2" name="password2" required placeholder="Passwort wiederholen" minlength="6">
                <button type="submit">Admin erstellen</button>
            </form>
        </div>
        <?php endif; ?>

        <?php if ($adminExists): ?>
        <div class="card">
            <h2>Setup abgeschlossen!</h2>
            <p style="font-size: 0.9rem; color: #166534;">Alles ist eingerichtet. Sie können sich jetzt unter <strong>/admin/login</strong> anmelden.</p>
            <div class="warning">
                <strong>Wichtig:</strong> Löschen Sie diese Datei (setup.php) jetzt vom Server, damit niemand unbefugt Zugang erstellen kann!
            </div>
        </div>
        <?php endif; ?>
    </div>
</body>
</html>
