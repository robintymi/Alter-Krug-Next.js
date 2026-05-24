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
        <div className="site-container max-w-3xl">
          <div className="panel p-8 md:p-12 space-y-8">

            {/* EU Logo */}
            <div className="flex justify-center">
              <div className="relative h-24 w-96">
                <Image
                  src="/img/eu-kofinanziert.png"
                  alt="Kofinanziert von der Europäischen Union"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Im Hotel und Restaurant Alter Krug investieren wir in die Zukunft für mehr Komfort,
                Nachhaltigkeit und noch schönere Erlebnisse für unsere Gäste.
              </p>
              <p>
                Im Rahmen einer durch die Europäische Union kofinanzierten Baumaßnahme werden umfangreiche
                Umbaumaßnahmen umgesetzt. Dazu gehören die energetische Sanierung (Fenster), die Modernisierung
                des Schankraums, die Erneuerung der Veranstaltungstechnik sowie die Schaffung barrierefreier
                Zugänge und Nutzungsmöglichkeiten.
              </p>
              <p>
                Mit diesen Maßnahmen möchten wir den Alten Krug zukunftsfähig gestalten und gleichzeitig
                den besonderen Charakter und die Gastfreundschaft unseres Hauses erhalten.
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
