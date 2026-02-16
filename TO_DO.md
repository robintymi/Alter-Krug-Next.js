# Aufgabenliste (TO-DO)

## 🚨 Wichtige Korrekturen (Build-Fehler)

- [x] **Tailwind-Konfiguration reparieren**: `unknown utility class border-border` ist nicht mehr vorhanden; Theme-Tokens sind in `src/app/globals.css` (`@theme`) für Tailwind v4 definiert.
  - [x] Farben (`border`, `input`, `ring`, `background`, `foreground`) sind als Theme-Variablen angelegt.
  - [x] Build-Check erfolgreich (`npm run build` am 16.02.2026).

## 🛠 Projekteinrichtung

- [x] Projektstruktur initialisieren (Erledigt)
- [x] Basis-Layout erstellen (`app/layout.tsx`)
- [x] ESLint und Prettier konfigurieren
- [x] Notwendige Shadcn/UI-Komponenten hinzufügen (Button, Card, Input, etc.)

## 🚀 Features

- [x] Startseite implementieren (`app/page.tsx`)
- [x] Navigationskomponente erstellen
- [x] Footer-Komponente implementieren
- [x] Ladezustände und Fehlerbehandlung hinzufügen

## 🎨 Design & UI

- [x] Farbpalette definieren (Tailwind v4 via `src/app/globals.css`)
- [x] Typografie (Schriftarten) einrichten
- [x] Wiederverwendbare UI-Komponenten erstellen

## 🧪 Testing & Qualitätssicherung

- [ ] Unit-Tests für kritische Funktionen schreiben
- [ ] E2E-Tests hinzufügen (Playwright/Cypress)
- [x] Vollständigen Build-Check durchführen (`npm run build`)
