import Image from "next/image";
import { getSiteContent } from "@/lib/content";

export default async function WellnessPage() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  const { wellness_page } = content;

  return (
    <main className="min-h-screen">
      <section className="section-space">
        <div className="site-container grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <article className="panel p-6 md:p-8">
            <p className="section-label">Wohlbefinden</p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl">{wellness_page.title}</h1>
            <p className="mt-5 text-muted-foreground">{wellness_page.description}</p>

            <div className="mt-7 rounded-2xl border border-primary/15 bg-white/70 p-5">
              <h2 className="font-serif text-3xl md:text-4xl">{wellness_page.contact.name}</h2>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground md:text-base">
                <p>Telefon: {wellness_page.contact.phone}</p>
                <p>Mobil: {wellness_page.contact.mobile}</p>
                <a
                  href={wellness_page.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block pt-2 font-semibold text-primary underline decoration-primary/35 underline-offset-4"
                >
                  Zur Website
                </a>
              </div>
            </div>
          </article>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 shadow-[0_16px_42px_-30px_rgba(24,16,8,0.55)]">
            {wellness_page.image ? (
              <div className="relative aspect-[4/5] min-h-[340px]">
                <Image
                  src={wellness_page.image}
                  alt={wellness_page.contact.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/5] min-h-[340px] bg-muted" />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
