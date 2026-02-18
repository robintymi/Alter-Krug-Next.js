import { getSiteContent } from "@/lib/content";

export default async function ContactPage() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  const { contact_page, footer } = content;

  return (
    <main className="min-h-screen">
      <section className="section-space">
        <div className="site-container max-w-3xl">
          <div className="panel p-7 text-center md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Kontakt</p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl">{contact_page.title}</h1>
            <p className="mt-4 text-muted-foreground">{contact_page.intro}</p>

            <div className="mt-8 grid gap-5 rounded-2xl border border-primary/10 bg-white/70 p-5 text-left md:p-6">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">Anschrift</h2>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {footer.address.lines.map((line: string, i: number) => (
                    <p key={line + i}>{line}</p>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">Kontakt</h2>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>
                    <a href={`tel:${footer.address.phone}`} className="hover:text-primary">
                      {footer.address.phone}
                    </a>
                  </p>
                  <p>
                    <a href={`mailto:${footer.address.email}`} className="hover:text-primary">
                      {footer.address.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
