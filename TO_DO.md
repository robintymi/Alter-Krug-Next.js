# Aufgabenliste (TO-DO)

## 🚨 Wichtige Korrekturen (Build-Fehler)
- [ ] **Tailwind-Konfiguration reparieren**: Behebe `unknown utility class border-border` in `globals.css`.
  - Stelle sicher, dass `tailwind.config.ts` das Theme mit benutzerdefinierten Farben (border, input, ring, background, foreground) erweitert, die von Shadcn UI oder ähnlichen Bibliotheken verwendet werden.
  - Überprüfe, ob die `content`-Pfade alle Komponentendateien einschließen.

## 🛠 Projekteinrichtung
- [ ] Projektstruktur initialisieren (Erledigt)
- [ ] Basis-Layout erstellen (`app/layout.tsx`)
- [ ] ESLint und Prettier konfigurieren
- [ ] Notwendige Shadcn/UI-Komponenten hinzufügen (Button, Card, Input, etc.)

## 🚀 Features
- [ ] Startseite implementieren (`app/page.tsx`)
- [ ] Navigationskomponente erstellen
- [ ] Footer-Komponente implementieren
- [ ] Ladezustände und Fehlerbehandlung hinzufügen

## 🎨 Design & UI
- [ ] Farbpalette in `tailwind.config.ts` definieren
- [ ] Typografie (Schriftarten) einrichten
- [ ] Wiederverwendbare UI-Komponenten erstellen

## 🧪 Testing & Qualitätssicherung
- [ ] Unit-Tests für kritische Funktionen schreiben
- [ ] E2E-Tests hinzufügen (Playwright/Cypress)
- [ ] Vollständigen Build-Check durchführen (`npm run build`)
