# Deployment-Anleitung: Alter Krug Live auf udmedia

## 0. Aktuelle WordPress-Seite sichern (VOR dem Umstieg!)

- [ ] Per FTP/SFTP den **kompletten Inhalt** von `alter-krug-kallinchen.de` (DocumentRoot) lokal herunterladen → z.B. nach `C:\Backups\alter-krug-wordpress\`
- [ ] WordPress-Datenbank exportieren: Im udmedia Kundencenter → phpMyAdmin → Datenbank auswählen → "Exportieren" → Format SQL → Go → `.sql`-Datei lokal speichern
- [ ] `wp-content/uploads/` separat sichern (alle Medien/Bilder)
- [ ] Optional: WordPress-Plugin "All-in-One WP Migration" nutzen für ein Komplettbackup als .wpress-Datei
- [ ] Backup-Ordner mit Datum benennen, z.B. `alter-krug-wordpress-backup-2026-03-03`
- [ ] Backup an einem zweiten Ort ablegen (z.B. externe Festplatte oder Cloud)

> **Wichtig:** Erst wenn das Backup komplett und geprüft ist, mit dem Deployment der neuen Seite fortfahren!

---

## 1. Frontend hochladen (Next.js Static Export)

- [ ] `npm run build` lokal ausführen (erzeugt `out/`-Ordner)
- [ ] Per FTP/SFTP den Inhalt von `out/` nach `projects/AlterKrug/` auf robin-erike.de hochladen
- [ ] **Wichtig:** Den kompletten alten Ordnerinhalt vorher löschen oder überschreiben

## 2. API-Ordner hochladen

- [ ] Den lokalen `api/`-Ordner komplett nach `projects/AlterKrug/api/` hochladen
- [ ] Dateien die dort liegen müssen:
  - `config.php` (DB-Zugangsdaten, Stripe-Keys, CORS)
  - `auth.php`, `events.php`, `bookings.php`, `seats.php`
  - `checkout.php`, `webhook.php`
  - `menu.php`, `content.php`
  - `schema.sql`
  - `setup.php` (wird nach Setup gelöscht!)
  - `vendor/` (Stripe PHP SDK)
- [ ] Falls `vendor/` fehlt: lokal im `api/`-Ordner `composer require stripe/stripe-php` ausführen, dann `vendor/` mit hochladen

## 3. Datenbank einrichten

- [ ] Im udmedia Kundencenter prüfen ob MySQL-Datenbank `usr_ud05_370_10` auf `sql2.udmedia.de` existiert
- [ ] Im Browser aufrufen: `https://robin-erike.de/projects/AlterKrug/api/setup.php`
- [ ] **Schritt 1:** "Tabellen erstellen" klicken — erstellt: `events`, `bookings`, `site_content`, `admin_users`, `admin_sessions`
- [ ] **Schritt 2:** Admin-User anlegen (E-Mail + Passwort eingeben)
- [ ] Testen: `https://robin-erike.de/projects/AlterKrug/admin/login` aufrufen und einloggen
- [ ] **`setup.php` sofort vom Server löschen!** (Sicherheitsrisiko)

## 4. Stripe Webhook einrichten

- [ ] Stripe Dashboard öffnen: https://dashboard.stripe.com/webhooks
- [ ] "Add endpoint" klicken
- [ ] URL: `https://robin-erike.de/projects/AlterKrug/api/webhook.php`
- [ ] Event auswählen: `checkout.session.completed`
- [ ] Webhook-Secret kopieren und in `api/config.php` bei `STRIPE_WEBHOOK_SECRET` eintragen (falls anders als aktuell)
- [ ] Testen mit Stripe CLI oder Testbuchung

## 5. E-Mail (Resend) einrichten

- [ ] https://resend.com/domains aufrufen
- [ ] Domain `alter-krug-kallinchen.de` verifizieren (DNS-Records beim Hoster setzen)
- [ ] In `api/config.php` den Absender von `onboarding@resend.dev` auf z.B. `buchung@alter-krug-kallinchen.de` ändern
- [ ] Test-E-Mail senden (z.B. Testbuchung durchführen)

## 6. Funktionstest

- [ ] Startseite laden — Hero-Carousel, Kaminzimmer-Foto prüfen
- [ ] Mobile Navbar testen (Hamburger-Menü öffnen)
- [ ] Restaurant-Seite — Kaminzimmer-Foto + Frühstücksgalerie aufklappen
- [ ] Getränkekarte — KI-Bilder sichtbar?
- [ ] Hotel-Seite — neue Zimmerbilder + 4. Impressionen-Bild
- [ ] Events-Seite — Buchungsformular testen (Stripe-Testcard `4242 4242 4242 4242`)
- [ ] Admin-Login + Dashboard testen
- [ ] Cookie-Banner erscheint beim ersten Besuch?
- [ ] Google Maps auf Anfahrt-Seite erst nach Consent?

## 7. Nach Go-Live

- [ ] `setup.php` gelöscht? (nochmal prüfen!)
- [ ] Stripe von Test-Mode auf Live-Mode umstellen (falls noch nicht geschehen — aktuell sind Live-Keys eingetragen)
- [ ] Erste echte Testbuchung durchführen und Bestätigungs-E-Mail prüfen
