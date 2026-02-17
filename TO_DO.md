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

## 📧 Resend – E-Mail-Versand

- [x] Resend-Konto erstellt, API Key in `.env.local` eingetragen
- [x] `FROM_EMAIL=onboarding@resend.dev` (Testadresse, funktioniert ohne Domain-Verifikation)
- [ ] **Domain verifizieren**: resend.com → **Domains** → "Add Domain" → `alter-krug.de` eintragen → DNS-Einträge beim Hoster (udmedia) setzen
  - Danach `FROM_EMAIL=buchung@alter-krug.de` in `.env.local` (lokal) und in den Server-Umgebungsvariablen setzen

## 💳 Stripe – Zahlungsabwicklung

- [ ] **Stripe-Konto erstellen** → [stripe.com](https://stripe.com)
- [ ] API-Keys in `.env.local` eintragen:
  - `STRIPE_SECRET_KEY=sk_test_...`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] **Buchungsflow testen** (Stripe Test-Modus):
  - Stripe CLI installieren: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
  - Testkarte: `4242 4242 4242 4242`, Ablauf: beliebig, CVC: beliebig
- [ ] **Nach Deployment**: Stripe Webhook registrieren
  - stripe.com → Developers → Webhooks → "Add endpoint"
  - URL: `https://alter-krug.de/api/stripe/webhook`
  - Event: `checkout.session.completed`
  - `STRIPE_WEBHOOK_SECRET=whsec_...` in Server-Umgebungsvariablen eintragen

## 🧪 Testing & Qualitätssicherung

- [ ] Unit-Tests für kritische Funktionen schreiben
- [ ] E2E-Tests hinzufügen (Playwright/Cypress)
- [x] Vollständigen Build-Check durchführen (`npm run build`)
