import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Buffet data                                                        */
/* ------------------------------------------------------------------ */

interface BuffetCategory {
  heading: string;
  items: string[];
}

interface Buffet {
  name: string;
  subtitle?: string;
  categories: BuffetCategory[];
}

const buffetGroups: { label: string; buffets: Buffet[] }[] = [
  {
    label: "Brunch",
    buffets: [
      {
        name: "Brunchbüffet",
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Großer Frühstückskorb mit Brot und Brötchen, Konfitüre, Honig, Nutella, Butter, Schmalz, Kräuterquark",
              "Müslibar mit Joghurt, Quark und Obst, frische Milch und Orangensaft, Frühstückskaffee und Tee",
              "Käsespezialitäten, Wurst- und Schinkenauswahl",
              "Rührei, Speck und Nürnberger Würstchen",
              "Räucherfischplatte von Lachs, Forelle und Makrele",
              "Tomate-Mozzarella mit Basilikum",
              "Gemüsesticks mit Joghurtdip",
              "Roastbeef mit Sahnemeerrettich",
            ],
          },
          {
            heading: "Suppe",
            items: ["Rahmsüppchen von frischen Gurken"],
          },
          {
            heading: "Warmes",
            items: [
              "Medaillons vom Schweinefilet in Waldpilzrahmsoße und Spätzle",
              "Gebratene Wildlachsfilets auf Wurzelgemüse und Kräuter-Reis",
              "Broccoli-Nudel-Auflauf",
            ],
          },
          {
            heading: "Dessert",
            items: ["Obstkorb", "Rote Grütze mit Vanillesauce"],
          },
        ],
      },
    ],
  },
  {
    label: "Klassiker",
    buffets: [
      {
        name: 'Büffet „Alter Krug"',
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Roastbeef-Röllchen mit Sahne-Meerrettich",
              "Räucherfischplatte von Lachs, Forelle und Pfeffermakrele",
              "Internationale Käsespezialitäten mit Trauben und Crackern",
              "Kartoffelsalat und Partybuletten",
              "Marinierter Fetakäse mit frischen Kräutern",
              "Geflügelsalat",
              "Brotkorb mit Butter, Schmalz und Kräuterquark",
            ],
          },
          {
            heading: "Suppe",
            items: [
              "Märkische Hochzeitssuppe mit Fleischklößchen, Eierstich und Spargel",
            ],
          },
          {
            heading: "Warmes",
            items: [
              "Schweinemedaillons in Pilzrahmsauce und Kartoffelkroketten",
              "Zanderfilet in Spreewaldsoße mit Kartoffeln",
            ],
          },
          {
            heading: "Dessert",
            items: [
              "Weiße Schokoladencreme mit Orangenfilets",
              "Hausgemachte Rote Grütze mit Vanillesauce",
            ],
          },
        ],
      },
      {
        name: 'Büffet „Classic"',
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Partybuletten",
              "Hackepeter mit Zwiebelwürfeln",
              "Pikanter Gurkensalat, Tomatensalat",
              "Internationale Käseauswahl mit Trauben",
              "Brotkorb",
            ],
          },
          {
            heading: "Suppe",
            items: ["Soljanka"],
          },
          {
            heading: "Warmes",
            items: [
              "Gebratene Hähnchenbrust mit Rahmchampignons und Kroketten",
              "Schollenfilets in Dillsoße und Petersilienkartoffeln",
            ],
          },
          {
            heading: "Dessert",
            items: ["Hausgemachte Rote Grütze mit Vanillesauce"],
          },
        ],
      },
    ],
  },
  {
    label: "Grillbüffets",
    buffets: [
      {
        name: "Kleines Grillbüffet",
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Marinierte Fetawürfel mit Oliven und Peperoni",
              "Kartoffelsalat",
              "Tomatensalat",
              "Gurkensalat",
              "Brotkorb",
            ],
          },
          {
            heading: "Warmes",
            items: [
              "Marinierte Zucchini und Riesenchampignons vom Grill",
              "Bratwurst",
              "Marinierte Putensteaks",
              "Marinierter Schweinenacken",
              "Rosmarinkartoffeln mit Kräuterquark",
              "Verschiedene Grillsoßen",
            ],
          },
          {
            heading: "Dessert",
            items: ["Rote Grütze mit Vanillesoße"],
          },
        ],
      },
      {
        name: "Großes Grillbüffet",
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Marinierter Fetakäse mit Oliven und Peperoni",
              "Bunter Nudelsalat mit Curry, Ananas und Cashewkernen",
              "Kartoffelsalat",
              "Tomatensalat",
              "Gurkensalat",
              "Brotkorb",
            ],
          },
          {
            heading: "Warmes",
            items: [
              "Bunte Schaschlikspieße vom Grill",
              "Gebratenes Lachsfilet",
              "Marinierte Zucchini und Riesenchampignons vom Grill",
              "Bratwurst",
              "Marinierte Putensteaks vom Grill",
              "Grilltomate mit Käsefüllung",
              "Marinierter Schweinenacken vom Grill",
              "Ofenkartoffel mit Kräuterquark",
              "Verschiedene Grillsoßen",
            ],
          },
          {
            heading: "Dessert",
            items: ["Rote Grütze mit Vanillesoße", "Tiramisu"],
          },
        ],
      },
    ],
  },
  {
    label: "Internationale Büffets",
    buffets: [
      {
        name: 'Büffet „Mittelmeer"',
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Marinierter Schafskäse mit Oliven und Peperoni",
              "Salat von Kirschtomaten und Mozzarellabällchen mit Pesto",
              "Rucolasalat mit geriebenem Parmesan und Tomatenvinaigrette",
              "Farfallesalat mit getrockneten Tomaten, Frühlingszwiebeln und Oliven",
              "Honigmelone mit Serranoschinken",
              "Bunte Antipastiauswahl",
              "Baguettebrot mit Aioli und Mojo Rojo",
            ],
          },
          {
            heading: "Suppe",
            items: ["Tomatencremesuppe mit Basilikumschmand"],
          },
          {
            heading: "Warmes",
            items: [
              "Schweinemedaillons in Gorgonzolasoße mit Broccoli und Tortellini",
              "Wildlachssteak auf mediterranem Pfannengemüse und Risotto",
              'Spanischer Kartoffelauflauf „Tortilla" mit Grilltomaten',
            ],
          },
          {
            heading: "Dessert",
            items: ["Hausgemachtes Tiramisu", "Panna Cotta mit Mango"],
          },
        ],
      },
      {
        name: 'Büffet „International"',
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Bunte Canapées mit ungarischer Salami, spanischem Serrano, französischem Roquefort und norwegischem Lachs",
              "Auberginentaler in Sesamkruste",
              "Gefüllte Zucchini mit Oliven, Tomaten und Feta",
              "Meeresfrüchtesalat",
              "Bunter Nudelsalat mit Curry, Ananas und Cashewkernen",
              "Brotkorb",
            ],
          },
          {
            heading: "Suppe",
            items: ["Paprikacremesuppe mit Putenbruststreifen"],
          },
          {
            heading: "Warmes",
            items: [
              "Hähnchenbrust auf Chinagemüse und Limettenreis",
              "Bandnudeln mit Lachs-Sahnesoße",
              "Kalbshüftsteak in Morchelrahm mit Kräutercouscous",
            ],
          },
          {
            heading: "Dessert",
            items: [
              "Röllchen von Mascarpone-Crêpes mit Erdbeeren",
              "Limetten-Joghurt-Crème",
            ],
          },
        ],
      },
      {
        name: 'Büffet „Hawaii"',
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Ika Mata Thunfischsalat",
              "Käseauswahl mit Früchten",
              "Wassermelonensalat mit Rucola und Feta",
              "Exotischer Hühnchensalat",
              'Reissalat „Hawaii"',
              "Brotkorb mit Guacamole",
            ],
          },
          {
            heading: "Suppe",
            items: ["Hawaiianische Kokos-Ingwer-Karottensuppe"],
          },
          {
            heading: "Warmes",
            items: [
              "Gegrillte Dorade mit kanarischen Kartoffeln und Mojo Rojo",
              "Fruchtige Hähnchenspieße",
              "Garnelenspieße in Curry-Ananas-Marinade",
              "Schweinemedaillons Florida mit Curryreis",
              "Süßkartoffel-Gemüsepfanne mit Kokos",
            ],
          },
          {
            heading: "Dessert",
            items: [
              "Piña-Colada-Creme mit Mangospiegel",
              "Kokos-Bananencreme unter gebrannter Rohrzuckerhaube",
              "Exotischer Obstsalat",
              "Eisbombe",
            ],
          },
        ],
      },
      {
        name: 'Büffet „Gourmet"',
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Heringshäckerle auf Pumpernickeltaler",
              "Internationale Käseauswahl mit Trauben und Cracker",
              "Tomaten-Castellosalat mit Frühlingszwiebeln",
              "Geflügelsalat mit Spargel und Mandarinen",
              "Räucherfisch-Canapees von Lachs, Forelle und Makrele",
              "Partybrötchen",
            ],
          },
          {
            heading: "Suppe",
            items: ["Waldpilzcremesuppe mit Vollkorncroutons"],
          },
          {
            heading: "Warmes",
            items: [
              "Marinierte Wildschweinmedaillons in Preiselbeersoße und Schupfnudeln",
              "Flugentenbrust in Orangensoße mit Schwarzwurzel-Lauchgemüse und Kroketten",
              "Pochierte Schollenfilets in Weißweinsoße mit Broccoli und Limettenreis",
            ],
          },
          {
            heading: "Dessert",
            items: ["Grießflammerie mit Himbeeren", "Crème Caramel"],
          },
        ],
      },
    ],
  },
  {
    label: "Weihnachten",
    buffets: [
      {
        name: "Weihnachtliches Büffet",
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Winterliche Blattsalate mit Sprossen, Nüssen, Croutons und Walnussvinaigrette",
              "Deftiger Speckkartoffelsalat",
              "Hausgebeizter Caipirinha-Lachs mit Honig-Senfsoße",
              "Bunte Käsespieße",
              "Möhrensalat mit Kokos und Ananas",
              "Brotkorb mit Brezeln, Partybrötchen und Baguette",
            ],
          },
          {
            heading: "Suppe",
            items: ["Deftige Zwiebelsuppe mit Käsecroutons"],
          },
          {
            heading: "Warmes",
            items: [
              "Welsfilet in Weinteig gebacken mit Kräuterreis",
              "Gänsebrust mit Rotkohl, Grünkohl und Klößen",
              "Schweinebraten in Backobstsoße, Rotkohl und Kartoffeln",
            ],
          },
          {
            heading: "Dessert",
            items: [
              "Warmer Apfelstrudel mit Vanillesoße",
              "Grießflammerie",
              "Apfel-Zimt",
              "Obstaufplatte",
            ],
          },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BuffetPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="section-space pb-8 text-center">
        <div className="site-container">
          <h1 className="font-script text-6xl text-primary/80 md:text-7xl">
            Unsere Büffets
          </h1>
          <p className="section-lead mx-auto">
            Sie planen eine Familienfeier, eine Hochzeit oder organisieren Ihr
            Betriebsfest? Unsere beliebten Büffets sind sicher genau das
            Richtige für Ihre Veranstaltung.
          </p>
        </div>
      </section>

      {/* Hochzeitssaal-Bild */}
      <section className="pb-10 md:pb-14">
        <div className="site-container">
          <div className="panel overflow-hidden">
            <div className="relative aspect-[16/7] w-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/img/Hochzeitssaal.jpeg`}
                alt="Festlich dekorierter Hochzeitssaal im Alten Krug"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1240px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Intro-Text */}
      <section className="pb-10 md:pb-14">
        <div className="site-container max-w-3xl text-center">
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Im Folgenden finden Sie einige Büffetvorschläge, die Sie gerne auch
            miteinander kombinieren können. Für spezielle Wünsche sind wir
            natürlich ganz offen und erstellen Ihr ganz individuelles Angebot.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            In den Wintermonaten arrangieren wir Büffets für bis zu 60 Personen
            und in den Sommermonaten bis ca. 20 Personen.
          </p>
        </div>
      </section>

      {/* Büffet-Impressionen */}
      <section className="pb-10 md:pb-14">
        <div className="site-container">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { src: "/img/BüffetVorspeise1.jpeg", alt: "Büffet Vorspeise" },
              { src: "/img/BüffetVorspeise2.jpeg", alt: "Büffet Vorspeise" },
              { src: "/img/BüffetDessert.jpeg", alt: "Büffet Dessert" },
            ].map((img) => (
              <div
                key={img.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/60 shadow-md"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Büffet-Gruppen */}
      {buffetGroups.map((group) => (
        <section key={group.label} className="pb-14 md:pb-18">
          <div className="site-container">
            <p className="section-label mb-6 text-center">{group.label}</p>

            <div className="grid gap-6 md:grid-cols-2">
              {group.buffets.map((buffet) => (
                <article
                  key={buffet.name}
                  className="panel p-6 md:p-8"
                >
                  <h2 className="font-serif text-2xl font-semibold md:text-3xl">
                    {buffet.name}
                  </h2>

                  <div className="mt-5 space-y-5">
                    {buffet.categories.map((cat) => (
                      <div key={cat.heading}>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
                          {cat.heading}
                        </h3>
                        <ul className="mt-2 space-y-1">
                          {cat.items.map((item, i) => (
                            <li
                              key={item + i}
                              className="text-sm leading-relaxed text-muted-foreground"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="pb-16 md:pb-20">
        <div className="site-container max-w-3xl">
          <div className="panel p-7 text-center md:p-10">
            <p className="section-label">Interesse?</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">
              Ihr individuelles Büffet
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sie möchten ein Büffet für Ihre Feier oder Veranstaltung
              zusammenstellen? Schreiben Sie uns gerne eine E-Mail — wir beraten
              Sie persönlich und erstellen Ihnen ein individuelles Angebot.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="mailto:info@alter-krug-kallinchen.de?subject=Büffet-Anfrage"
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
