# Anleitung: Admin-Panel — Alter Krug Kallinchen

## Inhaltsverzeichnis

1. [Anmelden](#1-anmelden)
2. [Übersicht (Dashboard)](#2-übersicht-dashboard)
3. [Events verwalten](#3-events-verwalten)
4. [Speise- & Getränkekarte bearbeiten](#4-speise--getränkekarte-bearbeiten)
5. [Buchungen verwalten](#5-buchungen-verwalten)
6. [Bilder hochladen](#6-bilder-hochladen)
7. [Abmelden](#7-abmelden)
8. [Häufige Fragen](#8-häufige-fragen)

---

## 1. Anmelden

1. Öffnen Sie im Browser: **https://neu.alter-krug-kallinchen.de/admin/login**
2. Geben Sie Ihre **E-Mail-Adresse** und Ihr **Passwort** ein.
3. Klicken Sie auf **„Anmelden"**.

> Nach dem Login gelangen Sie automatisch zur Übersicht.

---

## 2. Übersicht (Dashboard)

Die Übersicht zeigt auf einen Blick:

- **Anzahl der Events** — Wie viele Veranstaltungen aktuell angelegt sind.
- **Buchungen** — Wie viele Buchungen insgesamt eingegangen sind und wie viele davon bestätigt sind.
- **Speisekarte-Kategorien** — Wie viele Abschnitte auf der Speise- und Getränkekarte vorhanden sind.

Von hier aus können Sie direkt in die einzelnen Bereiche springen.

---

## 3. Events verwalten

### Events ansehen

- Klicken Sie oben in der Navigation auf **„Events"**.
- Sie sehen eine Tabelle mit allen angelegten Veranstaltungen (Titel, Datum, Uhrzeit, Preis).

### Neues Event erstellen

1. Klicken Sie auf den Button **„Neues Event"** (oben rechts).
2. Füllen Sie das Formular aus:

| Feld | Beschreibung | Pflicht? |
|------|-------------|----------|
| **Titel** | Name der Veranstaltung | Ja |
| **Datum** | Datum der Veranstaltung (z. B. 24.04.2026) | Ja |
| **Uhrzeit** | Beginn der Veranstaltung | Nein |
| **Preisanzeige** | Freitext für die Preisanzeige (z. B. „ab 25 €") | Nein |
| **Beschreibung** | Beschreibungstext für die Veranstaltung | Nein |
| **Bild** | Foto zur Veranstaltung (per Drag & Drop oder Auswahl) | Nein |

3. **Online-Buchung aktivieren** (optional):
   - Tragen Sie die **maximale Anzahl Plätze** ein.
   - Tragen Sie den **Preis pro Person in Euro** ein (z. B. 25,00).
   - Sobald beide Felder ausgefüllt sind, wird die Online-Buchung auf der Webseite aktiviert.

4. Klicken Sie auf **„Speichern"**.

> Das neue Event erscheint sofort auf der Webseite unter „Veranstaltungen" — kein Neustart der Seite nötig.

### Event bearbeiten

- Klicken Sie in der Event-Liste auf **„Bearbeiten"** neben dem gewünschten Event.
- Ändern Sie die gewünschten Felder und klicken Sie auf **„Speichern"**.

### Event löschen

- Klicken Sie auf **„Löschen"** neben dem Event.
- Bestätigen Sie die Sicherheitsabfrage.
- Das Event wird sofort von der Webseite entfernt.

> **Achtung:** Wenn für dieses Event bereits Buchungen existieren, bleiben diese in der Buchungsübersicht erhalten.

---

## 4. Speise- & Getränkekarte bearbeiten

### Aufrufen

- Klicken Sie oben auf **„Speise- & Getränkekarte"**.
- Sie sehen zwei Tabs: **Speisekarte** und **Getränkekarte**.

### Kategorien (Sektionen)

Jede Karte besteht aus **Kategorien** (z. B. „Vorspeisen", „Hauptgerichte", „Desserts").

**Neue Kategorie hinzufügen:**
1. Scrollen Sie nach unten und klicken Sie auf **„Kategorie hinzufügen"**.
2. Geben Sie einen **Namen** ein (z. B. „Fischgerichte").
3. Laden Sie ein **Kategoriebild** hoch (per Drag & Drop oder Klick auf den Upload-Bereich).

**Kategorie verschieben:**
- Nutzen Sie die **Pfeil-Buttons** (↑ / ↓), um die Reihenfolge der Kategorien zu ändern.

**Kategorie löschen:**
- Klicken Sie auf das **X** neben der Kategorie.

### Gerichte / Getränke (Einträge)

Innerhalb jeder Kategorie können Sie einzelne Einträge verwalten.

**Neuen Eintrag hinzufügen:**
1. Klicken Sie in der Kategorie auf **„Eintrag hinzufügen"**.
2. Füllen Sie aus:
   - **Name** — z. B. „Wiener Schnitzel"
   - **Preis** — z. B. „16,90 €"
   - **Beschreibung** — z. B. „mit Kartoffelsalat und Preiselbeeren"
   - **Bild** — optional, kleines Foto des Gerichts

**Einträge verschieben:**
- Nutzen Sie die **Pfeil-Buttons**, um die Reihenfolge zu ändern.

**Eintrag löschen:**
- Klicken Sie auf das **X** neben dem Eintrag.

### Speichern

- Klicken Sie ganz unten auf **„Alle Änderungen speichern"**.
- Es erscheint eine Bestätigung, wenn alles gespeichert wurde.

> **Wichtig:** Die Änderungen an der Speise- und Getränkekarte werden erst auf der öffentlichen Webseite sichtbar, nachdem die Webseite neu gebaut und hochgeladen wurde. Kontaktieren Sie dafür Ihren Webentwickler.

---

## 5. Buchungen verwalten

### Aufrufen

- Klicken Sie oben auf **„Buchungen"**.

### Übersicht

Oben sehen Sie drei Kennzahlen:
- **Buchungen gesamt** — Alle eingegangenen Buchungen
- **Bestätigt** — Buchungen, bei denen die Zahlung erfolgreich war (grün)
- **Umsatz (bestätigt)** — Gesamteinnahmen aus bestätigten Buchungen

### Auslastung pro Veranstaltung

Für jedes Event mit Online-Buchung sehen Sie:
- Einen **Balken**, der zeigt, wie viele Plätze belegt sind
- Die Anzahl **gebuchter / verfügbarer Plätze**
- Die **Anzahl der Buchungen** und den **Umsatz**
- Falls ausgebucht: ein rotes **„Ausgebucht"**-Label

### Buchungsliste

Die Tabelle zeigt alle Buchungen mit folgenden Informationen:

| Spalte | Beschreibung |
|--------|-------------|
| **Kunde** | Name, E-Mail und ggf. Telefonnummer |
| **Veranstaltung** | Titel und Datum des Events |
| **Plätze** | Anzahl gebuchter Plätze |
| **Betrag** | Gezahlter Gesamtbetrag |
| **Status** | Bestätigt (grün), Ausstehend (gelb) oder Storniert (rot) |
| **Datum** | Zeitpunkt der Buchung |
| **Aktion** | Stornieren-Button |

### Buchung stornieren

1. Klicken Sie in der Zeile der Buchung auf **„Stornieren"**.
2. Bestätigen Sie die Sicherheitsabfrage.
3. Der Status wechselt auf **„Storniert"** (rot).

> **Hinweis:** Die Stornierung im Admin-Panel ändert nur den Status in der Datenbank. Eine eventuelle Rückerstattung der Zahlung muss über das **Stripe-Dashboard** (https://dashboard.stripe.com) manuell durchgeführt werden.

---

## 6. Bilder hochladen

Bilder können an folgenden Stellen hochgeladen werden:

- **Events** → Beim Erstellen oder Bearbeiten eines Events
- **Speisekarte** → Kategoriebild und Gerichtbilder
- **Getränkekarte** → Kategoriebild und Getränkebilder

### So funktioniert der Upload

1. Klicken Sie auf den **Upload-Bereich** (gestrichelte Umrandung) oder **ziehen Sie ein Bild** per Drag & Drop hinein.
2. Das Bild wird automatisch hochgeladen und eine Vorschau angezeigt.
3. Um ein Bild zu **ändern**: Klicken Sie auf **„Ändern"** und wählen Sie ein neues Bild.
4. Um ein Bild zu **entfernen**: Klicken Sie auf **„Entfernen"**.

### Anforderungen an Bilder

- **Erlaubte Formate:** JPG, PNG, GIF, WebP
- **Maximale Dateigröße:** 10 MB
- **Empfehlung:** Verwenden Sie Bilder im Querformat (16:10) mit mindestens 1200 px Breite für beste Qualität.

---

## 7. Abmelden

- Klicken Sie oben rechts auf den roten Button **„Abmelden"**.
- Sie werden zur Login-Seite weitergeleitet.

> Tipp: Nach längerer Inaktivität werden Sie automatisch abgemeldet und müssen sich neu einloggen.

---

## 8. Häufige Fragen

### „Ich habe mein Passwort vergessen."
Kontaktieren Sie Ihren Webentwickler, um das Passwort zurückzusetzen.

### „Ein neues Event wird auf der Webseite nicht angezeigt."
Neue Events werden automatisch auf der Veranstaltungsseite geladen. Leeren Sie den Browser-Cache (Strg + F5) oder warten Sie einen Moment.

### „Die Speisekarte hat sich nach dem Speichern nicht geändert."
Änderungen an der Speise-/Getränkekarte erfordern einen Neubau der Webseite. Kontaktieren Sie Ihren Webentwickler.

### „Ein Kunde möchte stornieren."
1. Gehen Sie zu **Buchungen** im Admin-Panel.
2. Klicken Sie bei der entsprechenden Buchung auf **„Stornieren"**.
3. Falls eine Rückerstattung gewünscht ist, loggen Sie sich ins **Stripe-Dashboard** ein und erstatten Sie den Betrag dort manuell.

### „Wie erstatte ich eine Zahlung?"
1. Gehen Sie auf https://dashboard.stripe.com
2. Klicken Sie auf **„Zahlungen"** in der linken Navigation.
3. Suchen Sie die betreffende Zahlung.
4. Klicken Sie auf **„Erstatten"** und bestätigen Sie den Betrag.

---

**Bei technischen Problemen kontaktieren Sie Ihren Webentwickler.**
