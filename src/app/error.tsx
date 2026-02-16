"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error("Global app error:", error);
  }, [error]);

  return (
    <main className="min-h-screen">
      <section className="site-container section-space">
        <div className="panel mx-auto max-w-2xl px-6 py-12 text-center md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-destructive/80">
            Fehler
          </p>
          <h1 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">
            Etwas ist schiefgelaufen
          </h1>
          <p className="mt-4 text-muted-foreground">
            Die Seite konnte nicht korrekt geladen werden. Bitte versuche es erneut.
          </p>
          <button type="button" onClick={reset} className="btn-brand mt-8">
            Erneut versuchen
          </button>
        </div>
      </section>
    </main>
  );
}
