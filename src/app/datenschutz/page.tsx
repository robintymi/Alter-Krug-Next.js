export default function DatenschutzPage() {
  return (
    <main className="min-h-screen">
      <section className="section-space">
        <div className="site-container max-w-3xl">
          <div className="panel p-7 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
              Rechtliches
            </p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl">
              Datenschutzerklärung
            </h1>
            <p className="mt-4 text-muted-foreground">
              In dieser Datenschutzerklärung informieren wir Sie über die
              Verarbeitung Ihrer personenbezogenen Daten.
            </p>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
              {/* Verantwortlich */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Verantwortlich
                </h2>
                <div className="mt-3 space-y-1">
                  <p>Marco Hinrichs</p>
                  <p>Alter Krug Kallinchen</p>
                  <p>Hauptstraße 15</p>
                  <p>15806 Zossen OT Kallinchen, Deutschland</p>
                  <p>
                    <a
                      href="mailto:info@alter-krug-kallinchen.de"
                      className="hover:text-primary"
                    >
                      info@alter-krug-kallinchen.de
                    </a>
                  </p>
                  <p>
                    <a href="tel:+49337698980" className="hover:text-primary">
                      (033769) 8980
                    </a>
                  </p>
                </div>
              </div>

              {/* Hosting Provider */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Hosting Provider
                </h2>
                <div className="mt-3 space-y-1">
                  <p>
                    <strong className="text-foreground">Dienst:</strong> UD
                    Media GmbH
                  </p>
                  <p>
                    <strong className="text-foreground">Anbieter:</strong> UD
                    Media GmbH, Kölner Str. 28, 41812 Erkelenz, Deutschland
                  </p>
                </div>
              </div>

              {/* Server Log Files */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Server Log Files
                </h2>
                <div className="mt-3 space-y-3">
                  <p>
                    Zum Zweck der Überwachung der technischen Funktion und zur
                    Erhöhung der Betriebssicherheit unseres Webhosts werden
                    Verbindungsdaten verarbeitet. Die Dauer der Verarbeitung ist
                    auf 7 Tage beschränkt.
                  </p>
                  <p>
                    Die Rechtsgrundlage für die Datenverarbeitung ist das
                    berechtigte Interesse (unbedingte technische Notwendigkeit
                    eines Server Log Files als grundlegende Datenbasis zur
                    Fehleranalyse und für Sicherheitsmaßnahmen im Rahmen des
                    durch Ihren Aufruf ausdrücklich gewünschten Dienstes
                    &bdquo;Website&ldquo;) gemäß Art. 6 Abs. 1 lit. f DSGVO.
                  </p>
                </div>
              </div>

              {/* Kontaktformular */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Kontaktformular
                </h2>
                <div className="mt-3 space-y-3">
                  <p>
                    Auf unserer Website besteht die Möglichkeit, durch ein
                    Kontaktformular direkt mit uns in Kontakt zu treten. Nach
                    Absenden des Kontaktformulars erfolgt eine Verarbeitung der
                    von Ihnen eingegebenen personenbezogenen Daten durch den
                    Verantwortlichen zum Zweck der Bearbeitung Ihrer Anfrage auf
                    Grundlage der von Ihnen durch das Absenden des Formulars
                    erteilten Einwilligung gem. Art. 6 Abs. 1 lit. a DSGVO bis
                    auf Widerruf.
                  </p>
                  <p>
                    Es besteht keine gesetzliche oder vertragliche Verpflichtung
                    zur Bereitstellung der personenbezogenen Daten. Die
                    Nichtbereitstellung hat lediglich zur Folge, dass Sie Ihr
                    Anliegen nicht übermitteln und wir dieses nicht bearbeiten
                    können.
                  </p>
                </div>
              </div>

              {/* Bewerbungsformular */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Bewerbungsformular
                </h2>
                <div className="mt-3 space-y-3">
                  <p>
                    Wir bieten Ihnen auf unserer Website die Möglichkeit, Ihre
                    Bewerbung online einzureichen. Zum Zweck der Bearbeitung
                    Ihrer Bewerbung verarbeiten wir Ihre im Rahmen des
                    Bewerbungsformulars angeführten personenbezogenen Daten auf
                    Grundlage eines vorvertraglichen Verhältnisses gem. Art. 6
                    Abs. 1 lit. b DSGVO bis auf Widerruf bzw. längstens jedoch
                    für die Dauer von 6 Monaten nach Abschluss des
                    Bewerbungsverfahrens.
                  </p>
                  <p>
                    Sollten Sie eine Evidenzhaltung Ihrer übermittelten
                    Unterlagen ausdrücklich wünschen, erfolgt die Aufbewahrung
                    Ihrer Unterlagen für die Dauer von maximal 18 Monaten auf der
                    Rechtsgrundlage Ihrer Einwilligung gem. Art. 6 Abs. 1 lit. a
                    DSGVO.
                  </p>
                  <p>
                    Es besteht keine gesetzliche oder vertragliche Verpflichtung
                    zur Bereitstellung der personenbezogenen Daten. Die
                    Nichtbereitstellung hat lediglich zur Folge, dass wir Ihre
                    Bewerbung nicht bearbeiten können.
                  </p>
                  <p>
                    Eine Weitergabe Ihrer Bewerberdaten an Dritte erfolgt nicht.
                  </p>
                </div>
              </div>

              {/* Sicherheitsdienste */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Sicherheitsdienste
                </h2>
                <p className="mt-3">
                  Auf dieser Website nutzen wir zur Vermeidung von nicht
                  menschlichen und automatisierten Eingaben das Angebot von
                  Sicherheitsdienstleistern wie Captcha-Diensten.
                </p>
              </div>

              {/* Google reCAPTCHA */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Google reCAPTCHA
                </h2>
                <div className="mt-3 space-y-3">
                  <p>
                    Im Fall der Erteilung Ihrer Einwilligung verarbeiten wir mit
                    dem Dienst Google reCaptcha, Google Ireland Limited, Gordon
                    House, Barrow Street, Dublin 4, Irland als gemeinsame
                    Verantwortliche Ihre personenbezogenen Daten zum Zweck der
                    Vermeidung nicht menschlicher und automatisierter Eingaben.
                    Dabei ermöglichen wir dem Dienst das Setzen von Cookies, die
                    Erhebung von Verbindungsdaten und Daten ihres Webbrowsers.
                    Zudem ermöglichen wir dem Dienst die Berechnung einer User-ID
                    zur eindeutigen Identifizierung des Users im Rahmen des von
                    Google betriebenen Werbenetzwerkes. Daten werden auf Ihrem
                    Gerät für die Dauer von bis zu zwei Jahren gespeichert.
                  </p>
                  <p>
                    Die Rechtsgrundlage für die Datenverarbeitung ist Ihre
                    Einwilligung gemäß Art. 6 Abs 1 lit. a DSGVO. Die
                    Nichterteilung der Einwilligung hat zur Folge, dass die
                    Nutzung von reCaptcha und damit verbundenen Formularen nicht
                    möglich ist.
                  </p>
                  <p>
                    Eine bereits erteilte Einwilligung können Sie widerrufen,
                    indem Sie die Datenschutzeinstellungen ändern.
                  </p>
                  <p>
                    Der Google Konzern übermittelt Ihre personenbezogenen Daten in
                    die USA. Die Rechtsgrundlage für die Datenübermittlung in die
                    USA ist Ihre Einwilligung gemäß Art. 49 Abs 1 lit a iVm Art.
                    6 Abs 1 lit a DSGVO in Verbindung mit §25 TTDSG. Sie wurden
                    bereits vor Erteilung Ihrer Einwilligung informiert, dass die
                    USA über kein den Standards der EU entsprechendes
                    Datenschutzniveau verfügt. Insbesondere können US
                    Geheimdienste auf Ihre Daten zugreifen, ohne dass Sie darüber
                    informiert werden und ohne dass Sie dagegen rechtlich vorgehen
                    können. Der Europäische Gerichtshof hat aus diesem Grund in
                    einem Urteil den früheren Angemessenheitsbeschluss (Privacy
                    Shield) für ungültig erklärt.
                  </p>
                </div>
              </div>

              {/* Google Maps */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Google Maps
                </h2>
                <div className="mt-3 space-y-3">
                  <p>
                    Im Fall der Erteilung Ihrer Einwilligung verarbeiten wir mit
                    dem Dienst Google Maps, Google LLC, Amphitheatre Parkway,
                    Mountain View, CA 94043, USA, als gemeinsame Verantwortliche
                    Ihre personenbezogenen Daten zum Zweck der Anzeige
                    interaktiver Karten auf unserer Website.
                  </p>
                  <p>
                    Wir ermöglichen dem Dienst die Erhebung von
                    Verbindungsdaten, die Erhebung von Daten ihres Webbrowsers
                    sowie die Platzierung eines Werbecookies. Durch die
                    Platzierung von Werbecookies ist es Google möglich, für
                    jeden Nutzer eine individuelle User-ID zu berechnen. Diese
                    zur eindeutigen Identifizierung geeigneten personenbezogenen
                    Daten werden sodann im Rahmen des von Google betriebenen
                    Werbenetzwerks verarbeitet.
                  </p>
                  <p>
                    Soweit durch Google eine weitergehende eigenständige
                    Verarbeitung der Daten insbesondere im Rahmen des
                    Werbenetzwerkes von Google erfolgt, ist Google dafür alleinige
                    Verantwortliche. Details finden Sie in der
                    Datenschutzerklärung von Google.
                  </p>
                  <p>
                    Die Nichterteilung der Einwilligung hat lediglich zur Folge,
                    dass Ihnen der Dienst Google Maps nicht zur Verfügung gestellt
                    wird. Eine bereits erteilte Einwilligung können Sie
                    widerrufen, indem Sie die Datenschutzeinstellungen ändern.
                  </p>
                  <p>
                    Die Rechtsgrundlage für die Datenverarbeitung ist Ihre
                    Einwilligung gemäß Art. 6 Abs 1 lit. a DSGVO.
                  </p>
                  <p>
                    Der Google Konzern übermittelt Ihre personenbezogenen Daten in
                    die USA. Die Rechtsgrundlage für die Datenübermittlung in die
                    USA ist Ihre Einwilligung gemäß Art. 49 Abs 1 lit a iVm Art.
                    6 Abs 1 lit a DSGVO in Verbindung mit §25 TTDSG. Sie wurden
                    bereits vor Erteilung Ihrer Einwilligung informiert, dass die
                    USA über kein den Standards der EU entsprechendes
                    Datenschutzniveau verfügt. Insbesondere können US
                    Geheimdienste auf Ihre Daten zugreifen, ohne dass Sie darüber
                    informiert werden und ohne dass Sie dagegen rechtlich vorgehen
                    können. Der Europäische Gerichtshof hat aus diesem Grund in
                    einem Urteil den früheren Angemessenheitsbeschluss (Privacy
                    Shield) für ungültig erklärt.
                  </p>
                </div>
              </div>

              {/* Widerspruchsrecht */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Widerspruchsrecht
                </h2>
                <div className="mt-3 space-y-3">
                  <p>
                    Sofern die Verarbeitung Ihrer personenbezogenen Daten auf
                    Grundlage des berechtigten Interesses erfolgt, haben Sie das
                    Recht gegen diese Verarbeitung zu widersprechen.
                  </p>
                  <p>
                    Sofern keine zwingenden schutzwürdigen Gründe für die
                    Verarbeitung unsererseits vorliegen, wird die Verarbeitung
                    Ihrer Daten auf Basis dieser Rechtsgrundlage eingestellt.
                  </p>
                  <p>
                    Zudem haben Sie das Recht, der Verarbeitung Ihrer
                    personenbezogenen Daten zum Zweck der Direktwerbung zu
                    widersprechen. Im Fall des Widerspruchs werden Ihre
                    personenbezogenen Daten nicht mehr zum Zweck der
                    Direktwerbung verarbeitet.
                  </p>
                  <p>
                    Die Rechtmäßigkeit der bis zum Widerspruch verarbeiteten
                    Daten wird durch den Widerspruch nicht berührt.
                  </p>
                </div>
              </div>

              {/* Widerrufsrecht */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Widerrufsrecht
                </h2>
                <div className="mt-3 space-y-3">
                  <p>
                    Sie haben das Recht eine bereits erteilte Einwilligung
                    jederzeit zu widerrufen, indem Sie die
                    Datenschutzeinstellungen ändern.
                  </p>
                  <p>
                    Im Fall der Einwilligung in den Erhalt elektronischer Werbung
                    kann der Widerruf Ihrer Einwilligung durch Klick auf den
                    Abmeldelink erfolgen. In diesem Fall wird eine Verarbeitung,
                    sofern keine andere Rechtsgrundlage besteht, eingestellt.
                  </p>
                  <p>
                    Die Rechtmäßigkeit der bis zum Widerruf verarbeiteten Daten
                    wird durch den Widerruf nicht berührt.
                  </p>
                </div>
              </div>

              {/* Betroffenenrechte */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Betroffenenrechte
                </h2>
                <div className="mt-3 space-y-3">
                  <p>
                    Sie haben zudem das Recht auf Auskunft, Berichtigung,
                    Löschung und Einschränkung der Verarbeitung der
                    personenbezogenen Daten.
                  </p>
                  <p>
                    Soweit die Rechtsgrundlage der Verarbeitung Ihrer
                    personenbezogenen Daten in Ihrer Einwilligung oder in einem
                    mit Ihnen abgeschlossenen Vertrag besteht, haben Sie überdies
                    das Recht auf Datenübertragbarkeit.
                  </p>
                  <p>
                    Weiters haben Sie das Recht auf Beschwerde bei der
                    Aufsichtsbehörde.
                  </p>
                </div>
              </div>

              {/* Externe Anbieter */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  Weitere Informationen über externe Anbieter
                </h2>

                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="font-semibold text-foreground">CultBooking</h3>
                    <div className="mt-2 space-y-2">
                      <p>
                        Der Dienst CultBooking, Cultuzz Digital Media GmbH,
                        Ullsteinstraße 130, 12109 Berlin, Deutschland stellt für
                        uns eine Internet Booking Engine zur Verfügung, mit der
                        Sie Zimmer online buchen können.
                      </p>
                      <p>
                        Soweit durch die Cultuzz Digital Media GmbH eine
                        weitergehende eigenständige Verarbeitung der Daten
                        erfolgt, ist die Cultuzz Digital Media GmbH dafür
                        alleinige Verantwortliche. Details finden Sie in der
                        Datenschutzerklärung des Anbieters.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">Yovite.com</h3>
                    <div className="mt-2 space-y-2">
                      <p>
                        Der Dienst Yovite.com Gutscheinsysteme, Graf e.K.,
                        Forsmannstraße 8-b, 22303 Hamburg, Deutschland stellt für
                        uns eine Internet Booking Engine zur Verfügung, mit der
                        Sie Gutscheine für die Leistungserbringung im Alten Krug
                        Kallinchen erwerben können.
                      </p>
                      <p>
                        Soweit durch Yovite.com eine weitergehende eigenständige
                        Verarbeitung der Daten erfolgt, ist Yovite.com dafür
                        alleiniger Verantwortlicher. Details finden Sie in der
                        Datenschutzerklärung des Anbieters.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">
                      Stripe (Zahlungsabwicklung)
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p>
                        Für die Abwicklung von Online-Buchungen nutzen wir den
                        Zahlungsdienst Stripe, Stripe Inc., 510 Townsend Street,
                        San Francisco, CA 94103, USA. Bei einer Buchung werden Sie
                        auf eine von Stripe gehostete Zahlungsseite weitergeleitet.
                        Dabei werden die zur Zahlungsabwicklung erforderlichen Daten
                        (Name, E-Mail, Zahlungsinformationen) direkt von Stripe
                        verarbeitet.
                      </p>
                      <p>
                        Die Rechtsgrundlage für die Datenverarbeitung ist die
                        Erfüllung eines Vertrags gemäß Art. 6 Abs. 1 lit. b
                        DSGVO. Details finden Sie in der Datenschutzerklärung von
                        Stripe.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">
                      Datenbankserver (Buchungssystem)
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p>
                        Für die Speicherung von Buchungsdaten und die
                        Authentifizierung im Administrationsbereich nutzen wir
                        eine MySQL-Datenbank auf unserem Hosting-Server bei UD
                        Media GmbH in Deutschland. Die Daten verlassen zu keinem
                        Zeitpunkt den europäischen Raum.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
