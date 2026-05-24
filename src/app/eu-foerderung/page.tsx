import Image from "next/image";

export default function EuFoerderungPage() {
  return (
    <main className="min-h-screen">
      <section className="section-space pb-8 text-center">
        <div className="site-container">
          <p className="section-label">Investition in die Zukunft</p>
          <h1 className="section-title mt-3">EU-geförderte Baumaßnahmen</h1>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="site-container max-w-3xl space-y-6">

          {/* EU Logo */}
          <div className="panel flex justify-center p-8">
            <div className="relative h-24 w-96">
              <Image
                src="/img/eu-kofinanziert.jpg"
                alt="Kofinanziert von der Europäischen Union"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Projektbeschreibung */}
          <div className="panel p-8 md:p-10 space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/70">Projektbezeichnung</h2>
              <p className="mt-2 text-base font-medium text-foreground">
                Umbau- und Modernisierungsmaßnahmen Hotel und Restaurant „Alter Krug"
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Hauptstraße 15, 15806 Zossen OT Kallinchen</p>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/70">Geförderte Maßnahmen</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Energetische Sanierung (Fenster)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Umbau Schankraum
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Modernisierung Veranstaltungstechnik (Licht-, Mikrofon- und Lautsprechertechnik)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Schaffung von Barrierefreiheit (ein Hotelzimmer und WCs des Restaurants)
                </li>
              </ul>
            </div>

            <div className="border-t border-primary/10 pt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Im Hotel und Restaurant Alter Krug investieren wir in die Zukunft für mehr Komfort,
                Nachhaltigkeit und noch schönere Erlebnisse für unsere Gäste.
              </p>
              <p>
                Im Rahmen einer durch die Europäische Union kofinanzierten Baumaßnahme werden diese
                umfangreichen Umbau- und Modernisierungsmaßnahmen umgesetzt. Mit diesen Maßnahmen möchten
                wir den Alten Krug zukunftsfähig gestalten und gleichzeitig den besonderen Charakter und
                die Gastfreundschaft unseres Hauses erhalten.
              </p>
              <p>
                Wir freuen uns darauf, unsere Gäste künftig in einem noch zeitgemäßeren, komfortablen
                und einladenden Ambiente begrüßen zu dürfen.
              </p>
              <p className="font-medium text-foreground">Ihr Team vom Alten Krug</p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
