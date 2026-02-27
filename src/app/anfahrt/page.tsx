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
                  Bahnhof Zossen oder Bestensee. Von dort aus bieten wir auf Anfrage einen Shuttleservice an. Bitte kontaktieren Sie uns rechtzeitig.
                </p>
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
