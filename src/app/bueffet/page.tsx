import Link from "next/link";
import { Mail } from "lucide-react";
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
          <p className="section-label">Catering</p>
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

      <section className="pb-16 md:pb-20">
        <div className="site-container max-w-3xl">
          <div className="panel p-7 text-center md:p-10">
            <p className="section-label">Interesse?</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">Ihr individuelles Büffet</h2>
            <p className="mt-4 text-muted-foreground">
              Sie möchten ein Büffet für Ihre Feier oder Veranstaltung zusammenstellen?
              Schreiben Sie uns gerne eine E-Mail — wir beraten Sie persönlich und erstellen
              Ihnen ein individuelles Angebot.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="mailto:info@alter-krug.de?subject=Büffet-Anfrage"
                className="btn-brand gap-2"
              >
                <Mail className="h-4 w-4" />
                E-Mail schreiben
              </a>
              <Link href="/kontakt" className="btn-brand-soft">
                Kontaktseite
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
