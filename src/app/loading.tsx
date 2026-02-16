export default function Loading() {
  return (
    <main className="min-h-screen">
      <section className="site-container section-space">
        <div className="panel mx-auto max-w-2xl px-6 py-12 text-center md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Bitte warten
          </p>
          <h1 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">
            Inhalte werden geladen
          </h1>
          <p className="mt-4 text-muted-foreground">
            Einen Moment bitte, wir bereiten die Seite fuer dich vor.
          </p>
          <div className="mx-auto mt-8 h-1.5 w-40 overflow-hidden rounded-full bg-primary/15">
            <div className="h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
          </div>
        </div>
      </section>
    </main>
  );
}
