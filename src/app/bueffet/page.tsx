import { getSiteContent } from "@/lib/content";

export default async function BuffetPage() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  const { buffet_page } = content;

  return (
    <main className="min-h-screen">
      <section className="section-space pb-8 text-center">
        <div className="site-container">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Catering</p>
          <h1 className="section-title mt-3">{buffet_page.title}</h1>
          <p className="section-lead mx-auto">{buffet_page.intro}</p>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="site-container grid gap-6 md:grid-cols-2">
          {buffet_page.buffets.map((buffet: { name: string; description: string }, idx: number) => (
            <article key={buffet.name + idx} className="panel p-6 md:p-8">
              <h2 className="font-serif text-3xl md:text-4xl">{buffet.name}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{buffet.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
