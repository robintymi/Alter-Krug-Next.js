export default function ImpressumPage() {
  return (
    <main className="min-h-screen">
      <section className="section-space">
        <div className="site-container max-w-3xl">
          <div className="panel p-7 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
              Rechtliches
            </p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl">Impressum</h1>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
              {/* Angaben gemäß § 5 TMG */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Angaben gemäß § 5 TMG
                </h2>
                <div className="mt-3 space-y-1">
                  <p className="font-semibold text-foreground">
                    Hotel &amp; Restaurant Alter Krug Kallinchen
                  </p>
                  <p>Inh. Marco Hinrichs</p>
                  <p>Hauptstraße 15</p>
                  <p>15806 Zossen OT Kallinchen</p>
                </div>
              </div>

              {/* Vertreten durch */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Vertreten durch
                </h2>
                <p className="mt-3">Marco Hinrichs</p>
              </div>

              {/* Kontakt */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Kontakt
                </h2>
                <div className="mt-3 space-y-1">
                  <p>
                    Telefon:{" "}
                    <a href="tel:+49337698980" className="hover:text-primary">
                      (033769) 8980
                    </a>
                  </p>
                  <p>Fax: (033769) 89815</p>
                  <p>
                    E-Mail:{" "}
                    <a
                      href="mailto:info@alter-krug-kallinchen.de"
                      className="hover:text-primary"
                    >
                      info@alter-krug-kallinchen.de
                    </a>
                  </p>
                </div>
              </div>

              {/* Umsatzsteuer-ID */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Umsatzsteuer-ID
                </h2>
                <p className="mt-3">
                  Umsatzsteuer-Identifikationsnummer gemäß §27a
                  Umsatzsteuergesetz: 050/272/03568
                </p>
              </div>

              {/* Verantwortlich für den Inhalt */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
                </h2>
                <div className="mt-3 space-y-1">
                  <p>Marco Hinrichs, Claudia Hinrichs</p>
                  <p>Hauptstraße 15</p>
                  <p>15806 Zossen OT Kallinchen</p>
                </div>
              </div>

              {/* Online-Streitbeilegung */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Europäische Online-Streitbeilegung
                </h2>
                <div className="mt-3 space-y-2">
                  <p>
                    Die Europäische Kommission stellt eine Plattform zur
                    Online-Streitbeilegung (OS) bereit:{" "}
                    <a
                      href="https://ec.europa.eu/consumers/odr/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      ec.europa.eu/consumers/odr
                    </a>
                  </p>
                  <p>
                    Wir sind nicht bereit oder verpflichtet, an
                    Streitbeilegungsverfahren vor einer
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>
              </div>

              {/* Fotos */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Fotos
                </h2>
                <p className="mt-3">
                  Marco Hinrichs, Claudia Hinrichs, Britta Konrad –
                  Fotografin, rechtefreie Fotos
                </p>
              </div>

              {/* Haftungsausschluss */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Haftung für Inhalte
                </h2>
                <p className="mt-3">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
                  Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                  verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                  Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                  gespeicherte fremde Informationen zu überwachen oder nach
                  Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                  hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
                  Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
                  hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst
                  ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                  möglich. Bei Bekanntwerden von entsprechenden
                  Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                </p>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Haftung für Links
                </h2>
                <p className="mt-3">
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf
                  deren Inhalte wir keinen Einfluss haben. Deshalb können wir
                  für diese fremden Inhalte auch keine Gewähr übernehmen. Für
                  die Inhalte der verlinkten Seiten ist stets der jeweilige
                  Anbieter oder Betreiber der Seiten verantwortlich. Die
                  verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
                  mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte
                  waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine
                  permanente inhaltliche Kontrolle der verlinkten Seiten ist
                  jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
                  zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
                  derartige Links umgehend entfernen.
                </p>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Urheberrecht
                </h2>
                <p className="mt-3">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                  diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                  Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                  Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen
                  der schriftlichen Zustimmung des jeweiligen Autors bzw.
                  Erstellers. Downloads und Kopien dieser Seite sind nur für den
                  privaten, nicht kommerziellen Gebrauch gestattet. Soweit die
                  Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden,
                  werden die Urheberrechte Dritter beachtet. Insbesondere werden
                  Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem
                  auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir
                  um einen entsprechenden Hinweis. Bei Bekanntwerden von
                  Rechtsverletzungen werden wir derartige Inhalte umgehend
                  entfernen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
