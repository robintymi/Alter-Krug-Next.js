import { getSiteContent } from "@/lib/content";

export default async function RestaurantPage() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  const { restaurant_page } = content;

  return (
    <main className="min-h-screen">
      <section className="section-space pb-8">
        <div className="site-container text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Restaurant</p>
          <h1 className="section-title mt-3">{restaurant_page.title}</h1>
        </div>
      </section>

      <section className="pb-10 md:pb-14">
        <div className="site-container">
          <div className="panel overflow-hidden">
            <div className="flex aspect-[16/7] w-full items-center justify-center bg-gradient-to-br from-[#f7ecdb] to-[#efe1cc]">
              <div className="rounded-2xl border border-dashed border-primary/35 bg-white/70 px-6 py-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">Platzhalter</p>
                <p className="mt-2 font-serif text-2xl text-foreground md:text-3xl">Foto folgt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="site-container grid gap-6 md:grid-cols-2">
          {restaurant_page.sections.map((section: { title: string; content: string }, idx: number) => (
            <article key={section.title + idx} className="panel p-6 md:p-8">
              <h2 className="font-serif text-3xl md:text-4xl">{section.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{section.content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
