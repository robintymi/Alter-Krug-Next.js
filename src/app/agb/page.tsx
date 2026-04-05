export default function AGBPage() {
  return (
    <main className="min-h-screen">
      <section className="section-space">
        <div className="site-container max-w-3xl">
          <div className="panel p-7 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
              Rechtliches
            </p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl">
              Allgemeine Geschäftsbedingungen
            </h1>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
              {/* §1 Geltungsbereich */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  § 1 Geltungsbereich
                </h2>
                <div className="mt-3 space-y-2">
                  <p>
                    Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für den
                    Erwerb von Eintrittskarten und Tickets für Veranstaltungen
                    über die Webseite von Hotel &amp; Restaurant Alter Krug
                    Kallinchen, Inh. Marco Hinrichs, Hauptstraße 15, 15806
                    Zossen OT Kallinchen (nachfolgend &quot;Veranstalter&quot;).
                  </p>
                  <p>
                    Die AGB gelten für alle Buchungen, die über das
                    Online-Buchungssystem auf dieser Webseite getätigt werden.
                    Mit der Buchung erkennt der Kunde diese AGB an.
                  </p>
                </div>
              </div>

              {/* §2 Vertragsschluss */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  § 2 Vertragsschluss
                </h2>
                <div className="mt-3 space-y-2">
                  <p>
                    Die Darstellung der Veranstaltungen auf der Webseite stellt
                    kein rechtlich bindendes Angebot, sondern eine Aufforderung
                    zur Bestellung (invitatio ad offerendum) dar.
                  </p>
                  <p>
                    Der Vertrag kommt zustande, wenn der Kunde den
                    Buchungsvorgang abschließt und die Zahlung über den
                    Zahlungsdienstleister Stripe erfolgreich durchgeführt wird.
                    Der Kunde erhält eine Bestätigung per E-Mail.
                  </p>
                </div>
              </div>

              {/* §3 Preise und Zahlung */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  § 3 Preise und Zahlung
                </h2>
                <div className="mt-3 space-y-2">
                  <p>
                    Alle angegebenen Preise sind Endpreise und verstehen sich
                    inklusive der gesetzlichen Mehrwertsteuer. Zusätzliche
                    Gebühren werden nicht erhoben.
                  </p>
                  <p>
                    Die Zahlung erfolgt über den Zahlungsdienstleister Stripe
                    (Stripe Payments Europe, Ltd.). Es werden gängige
                    Zahlungsmittel (Kredit-/Debitkarten) akzeptiert. Die
                    Abbuchung erfolgt unmittelbar bei Buchung.
                  </p>
                </div>
              </div>

              {/* §4 Tickets und Einlass */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  § 4 Tickets und Einlass
                </h2>
                <div className="mt-3 space-y-2">
                  <p>
                    Nach erfolgreicher Buchung erhält der Kunde eine
                    Buchungsbestätigung per E-Mail. Diese dient als
                    Eintrittsberechtigung und ist beim Einlass vorzuzeigen.
                  </p>
                  <p>
                    Tickets sind personenbezogen. Eine Weitergabe an Dritte ist
                    nur mit vorheriger Zustimmung des Veranstalters gestattet.
                  </p>
                </div>
              </div>

              {/* §5 Widerrufsrecht */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  § 5 Ausschluss des Widerrufsrechts
                </h2>
                <div className="mt-3 space-y-2">
                  <p>
                    Gemäß § 312g Abs. 2 Nr. 9 BGB besteht bei Verträgen zur
                    Erbringung von Dienstleistungen im Zusammenhang mit
                    Freizeitbetätigungen, wenn der Vertrag für die Erbringung
                    einen spezifischen Termin vorsieht, <strong className="text-foreground">kein
                    Widerrufsrecht</strong>.
                  </p>
                  <p>
                    Da unsere Veranstaltungen an einem bestimmten Datum
                    stattfinden, ist das gesetzliche 14-tägige Widerrufsrecht
                    für Fernabsatzverträge ausgeschlossen. Bitte beachten Sie
                    dies vor Abschluss Ihrer Buchung.
                  </p>
                </div>
              </div>

              {/* §6 Stornierung */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  § 6 Freiwillige Stornierung
                </h2>
                <div className="mt-3 space-y-2">
                  <p>
                    Obwohl kein gesetzliches Widerrufsrecht besteht, bieten wir
                    eine freiwillige Stornierungsmöglichkeit auf Kulanzbasis an.
                    Bitte kontaktieren Sie uns hierzu direkt:
                  </p>
                  <div className="rounded-lg border bg-amber-50/50 p-4 mt-3">
                    <p className="font-semibold text-foreground">
                      Hotel &amp; Restaurant Alter Krug Kallinchen
                    </p>
                    <p className="mt-1">
                      Telefon:{" "}
                      <a href="tel:+49337698980" className="text-primary hover:underline">
                        (033769) 8980
                      </a>
                    </p>
                    <p>
                      E-Mail:{" "}
                      <a href="mailto:info@alter-krug-kallinchen.de" className="text-primary hover:underline">
                        info@alter-krug-kallinchen.de
                      </a>
                    </p>
                  </div>
                  <p>
                    Stornierungsanfragen werden individuell geprüft. Ein
                    Anspruch auf Erstattung besteht nicht. Wir bemühen uns
                    jedoch, im Rahmen unserer Möglichkeiten kulante Lösungen zu
                    finden (z.&nbsp;B. Umbuchung auf einen anderen Termin oder
                    Weitergabe an eine andere Person).
                  </p>
                </div>
              </div>

              {/* §7 Absage durch den Veranstalter */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  § 7 Absage durch den Veranstalter
                </h2>
                <div className="mt-3 space-y-2">
                  <p>
                    Der Veranstalter behält sich das Recht vor, Veranstaltungen
                    aus wichtigem Grund (z.&nbsp;B. höhere Gewalt,
                    Sicherheitsbedenken, behördliche Auflagen) abzusagen oder zu
                    verschieben. In diesem Fall wird der volle Ticketpreis
                    erstattet.
                  </p>
                  <p>
                    Weitergehende Ansprüche, insbesondere auf Ersatz von Reise-
                    oder Übernachtungskosten, sind ausgeschlossen, sofern den
                    Veranstalter kein Vorsatz oder grobe Fahrlässigkeit trifft.
                  </p>
                </div>
              </div>

              {/* §8 Haftung */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  § 8 Haftung
                </h2>
                <div className="mt-3 space-y-2">
                  <p>
                    Der Veranstalter haftet unbeschränkt für Schäden aus der
                    Verletzung des Lebens, des Körpers oder der Gesundheit, die
                    auf einer vorsätzlichen oder fahrlässigen
                    Pflichtverletzung beruhen, sowie für sonstige Schäden, die
                    auf einer vorsätzlichen oder grob fahrlässigen
                    Pflichtverletzung beruhen.
                  </p>
                  <p>
                    Im Übrigen ist die Haftung auf den vertragstypischen,
                    vorhersehbaren Schaden begrenzt. Die Haftung für mittelbare
                    Schäden, Folgeschäden und entgangenen Gewinn ist
                    ausgeschlossen.
                  </p>
                </div>
              </div>

              {/* §9 Datenschutz */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  § 9 Datenschutz
                </h2>
                <p className="mt-3">
                  Die Verarbeitung personenbezogener Daten erfolgt gemäß
                  unserer{" "}
                  <a
                    href="/datenschutz"
                    className="text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    Datenschutzerklärung
                  </a>
                  . Die im Rahmen der Buchung erhobenen Daten werden
                  ausschließlich zur Vertragsabwicklung und Kommunikation
                  verwendet.
                </p>
              </div>

              {/* §10 Schlussbestimmungen */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80">
                  § 10 Schlussbestimmungen
                </h2>
                <div className="mt-3 space-y-2">
                  <p>
                    Es gilt das Recht der Bundesrepublik Deutschland.
                    Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des
                    Veranstalters.
                  </p>
                  <p>
                    Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder
                    werden, bleibt die Wirksamkeit der übrigen Bestimmungen
                    hiervon unberührt. Anstelle der unwirksamen Bestimmung gilt
                    eine solche, die dem wirtschaftlichen Zweck der unwirksamen
                    Bestimmung am nächsten kommt.
                  </p>
                </div>
              </div>

              {/* Stand */}
              <div className="border-t pt-6">
                <p className="text-xs text-muted-foreground">
                  Stand: März 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
