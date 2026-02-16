# Codier-Regeln & Best Practices

## 1. Technologie-Stack
- **Framework**: Next.js 14+ (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (lokaler State bevorzugt), Zustand/Context für globalen State.
- **Formulare**: React Hook Form + Zod (optional, aber empfohlen).

## 2. Datei- & Ordnerstruktur
- **App Router**: Verwende `src/app` für Routen.
  - `page.tsx`: Routen-UI.
  - `layout.tsx`: Layout-Wrapper.
  - `loading.tsx`: Lade-UI.
  - `error.tsx`: Fehler-UI.
- **Komponenten**: `src/components/`
  - `ui/`: Wiederverwendbare Basis-Komponenten (Buttons, Inputs).
  - `features/`: Feature-spezifische Komponenten.
- **Utils**: `src/lib/utils.ts` (Hilfsfunktionen wie `cn`).
- **Benennung**:
  - Verzeichnisse: `kebab-case` (z.B. `user-profile/`)
  - Komponentendateien: `PascalCase.tsx` (z.B. `UserProfile.tsx`) oder `kebab-case`, wenn in Feature-Ordnern gruppiert (z.B. `user-profile/page.tsx`).
  - Variablen/Funktionen: `camelCase`.
  - Konstanten: `UPPER_SNAKE_CASE`.

## 3. Komponenten-Richtlinien
- **Funktionale Komponenten**: Nutze `const ComponentName = () => {}`.
- **Props Interface**: Definiere Props mit `interface ComponentProps {}`.
- **Export**: Verwende benannte Exports `export function ComponentName` oder `export const ComponentName` (Default Exports werden vermieden, um Refactoring zu erleichtern).
- **Hooks**: Platziere Hooks am Anfang der Komponente.
- **Return**: Early Returns bevorzugt gegenüber verschachtelten Bedingungen.

## 4. Styling (Tailwind CSS)
- **Utility-First**: Nutze Utility-Klassen direkt im `className`.
- **Gruppierung**: Standard-Reihenfolge einhalten (Layout -> Spacing -> Sizing -> Typografie -> Visuell -> Misc). Ideal: `prettier-plugin-tailwindcss`.
- **Custom Classes**: Vermeide `@apply` in CSS-Dateien, es sei denn, es ist absolut notwendig für komplexe Muster.
- **Farben**: Nutze CSS-Variablen in `tailwind.config.ts` für Theme-Fähigkeit (z.B. `bg-background text-foreground`).
- **Responsive**: Mobile-First-Ansatz (`sm:`, `md:`, `lg:`).

## 5. TypeScript-Regeln
- **Kein Any**: Vermeide `any`. Nutze `unknown` oder spezifische Typen.
- **Strict Mode**: Stelle sicher, dass `strict: true` in `tsconfig.json` aktiv ist.
- **Interfaces**: Bevorzuge `interface` gegenüber `type` für Objektstrukturen.

## 6. Git & Commits
- **Conventional Commits**:
  - `feat: add new login page`
  - `fix: resolve hydration error`
  - `chore: update dependencies`
  - `refactor: simplify user data fetching`
  - `style: format code with prettier`
  - `docs: update readme`

## 7. Performance & SEO
- **Bilder**: Nutze die `next/image`-Komponente.
- **Schriften**: Nutze `next/font`.
- **Metadaten**: Nutze `generateMetadata` für dynamische SEO-Tags.
- **Server Components**: Standardmäßig Server Components nutzen. `'use client'` nur verwenden, wenn Interaktivität (Hooks, Event-Listener) benötigt wird.

## 8. Fehlerbehandlung
- Nutze `try/catch`-Blöcke für asynchrone Operationen.
- Implementiere Error Boundaries zum Schutz vor UI-Abstürzen.
- Logge Fehler angemessen (Konsole oder Logging-Service).
