import { getSiteContent } from "@/lib/content";
import { GoogleMapsEmbed } from "@/components/GoogleMapsEmbed";

export default async function DirectionsPage() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  return (
    <main className="min-h-screen">
      <section className="section-space pb-8 text-center">
        <div className="site-container">
          <h1 className="font-script text-6xl text-primary/80 md:text-7xl">Anfahrt</h1>
        </div>
      </section>

      <section className="pb-8 md:pb-10">
        <div className="site-container max-w-4xl">
          <div className="panel p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">Mit dem Auto</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Über die A13, Abfahrt Bestensee, fahren Sie Richtung Motzen/Kallinchen. Nach ca. 8 km erreichen Sie Kallinchen.
                  Der Alte Krug befindet sich direkt an der Hauptstraße 15.
                </p>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">Mit der Bahn</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Nächste Bahnhöfe: Zossen oder Bestensee. Von dort bieten wir auf Anfrage einen Abholservice an — sprechen Sie uns einfach vor Ihrer Anreise an.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-primary/10 pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">Abholservice & Shuttle</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Damit Ihre Anreise so entspannt wie Ihr Aufenthalt wird, bieten wir Ihnen gerne gegen Gebühr einen Abholservice von den umliegenden Bahnhöfen sowie vom nur ca. 20 Minuten entfernten Flughafen an.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/70">Zossen oder Bestensee</p>
                  <p className="mt-1 text-lg font-serif text-primary">25,00 €</p>
                </div>
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/70">Königs Wusterhausen</p>
                  <p className="mt-1 text-lg font-serif text-primary">35,00 €</p>
                </div>
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/70">Flughafen BER</p>
                  <p className="mt-1 text-lg font-serif text-primary">55,00 €</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="site-container">
          <div className="overflow-hidden rounded-[2rem] border border-white/60 shadow-[0_18px_44px_-33px_rgba(22,12,6,0.52)]">
            <div className="relative aspect-[16/9] min-h-[320px]">
              <GoogleMapsEmbed
                src="https://maps.google.com/maps?q=Alter+Krug+Kallinchen,+Hauptstra%C3%9Fe+15,+15806+Zossen&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                title="Anfahrt Alter Krug"
              />
            </div>
          </div>

          <div className="panel mx-auto mt-8 max-w-xl p-6 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary/80">Adresse fürs Navi</h2>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              {content.footer.address.lines.map((line: string, i: number) => (
                <p key={line + i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
