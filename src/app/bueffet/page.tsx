import { SiteImage } from "@/components/SiteImage";
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
        name: "BrunchbÃ¼ffet",
        categories: [
          {
            heading: "Kaltes",
            items: [
              "GroÃŸer FrÃ¼hstÃ¼ckskorb mit Brot und BrÃ¶tchen, KonfitÃ¼re, Honig, Nutella, Butter, Schmalz, KrÃ¤uterquark",
              "MÃ¼slibar mit Joghurt, Quark und Obst, frische Milch und Orangensaft, FrÃ¼hstÃ¼ckskaffee und Tee",
              "KÃ¤sespezialitÃ¤ten, Wurst- und Schinkenauswahl",
              "RÃ¼hrei, Speck und NÃ¼rnberger WÃ¼rstchen",
              "RÃ¤ucherfischplatte von Lachs, Forelle und Makrele",
              "Tomate-Mozzarella mit Basilikum",
              "GemÃ¼sesticks mit Joghurtdip",
              "Roastbeef mit Sahnemeerrettich",
            ],
          },
          {
            heading: "Suppe",
            items: ["RahmsÃ¼ppchen von frischen Gurken"],
          },
          {
            heading: "Warmes",
            items: [
              "Medaillons vom Schweinefilet in WaldpilzrahmsoÃŸe und SpÃ¤tzle",
              "Gebratene Wildlachsfilets auf WurzelgemÃ¼se und KrÃ¤uter-Reis",
              "Broccoli-Nudel-Auflauf",
            ],
          },
          {
            heading: "Dessert",
            items: ["Obstkorb", "Rote GrÃ¼tze mit Vanillesauce"],
          },
        ],
      },
    ],
  },
  {
    label: "Klassiker",
    buffets: [
      {
        name: 'BÃ¼ffet â€žAlter Krug"',
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Roastbeef-RÃ¶llchen mit Sahne-Meerrettich",
              "RÃ¤ucherfischplatte von Lachs, Forelle und Pfeffermakrele",
              "Internationale KÃ¤sespezialitÃ¤ten mit Trauben und Crackern",
              "Kartoffelsalat und Partybuletten",
              "Marinierter FetakÃ¤se mit frischen KrÃ¤utern",
              "GeflÃ¼gelsalat",
              "Brotkorb mit Butter, Schmalz und KrÃ¤uterquark",
            ],
          },
          {
            heading: "Suppe",
            items: [
              "MÃ¤rkische Hochzeitssuppe mit FleischklÃ¶ÃŸchen, Eierstich und Spargel",
            ],
          },
          {
            heading: "Warmes",
            items: [
              "Schweinemedaillons in Pilzrahmsauce und Kartoffelkroketten",
              "Zanderfilet in SpreewaldsoÃŸe mit Kartoffeln",
            ],
          },
          {
            heading: "Dessert",
            items: [
              "WeiÃŸe Schokoladencreme mit Orangenfilets",
              "Hausgemachte Rote GrÃ¼tze mit Vanillesauce",
            ],
          },
        ],
      },
      {
        name: 'BÃ¼ffet â€žClassic"',
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Partybuletten",
              "Hackepeter mit ZwiebelwÃ¼rfeln",
              "Pikanter Gurkensalat, Tomatensalat",
              "Internationale KÃ¤seauswahl mit Trauben",
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
              "Gebratene HÃ¤hnchenbrust mit Rahmchampignons und Kroketten",
              "Schollenfilets in DillsoÃŸe und Petersilienkartoffeln",
            ],
          },
          {
            heading: "Dessert",
            items: ["Hausgemachte Rote GrÃ¼tze mit Vanillesauce"],
          },
        ],
      },
    ],
  },
  {
    label: "GrillbÃ¼ffets",
    buffets: [
      {
        name: "Kleines GrillbÃ¼ffet",
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Marinierte FetawÃ¼rfel mit Oliven und Peperoni",
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
              "Rosmarinkartoffeln mit KrÃ¤uterquark",
              "Verschiedene GrillsoÃŸen",
            ],
          },
          {
            heading: "Dessert",
            items: ["Rote GrÃ¼tze mit VanillesoÃŸe"],
          },
        ],
      },
      {
        name: "GroÃŸes GrillbÃ¼ffet",
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Marinierter FetakÃ¤se mit Oliven und Peperoni",
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
              "Bunte SchaschlikspieÃŸe vom Grill",
              "Gebratenes Lachsfilet",
              "Marinierte Zucchini und Riesenchampignons vom Grill",
              "Bratwurst",
              "Marinierte Putensteaks vom Grill",
              "Grilltomate mit KÃ¤sefÃ¼llung",
              "Marinierter Schweinenacken vom Grill",
              "Ofenkartoffel mit KrÃ¤uterquark",
              "Verschiedene GrillsoÃŸen",
            ],
          },
          {
            heading: "Dessert",
            items: ["Rote GrÃ¼tze mit VanillesoÃŸe", "Tiramisu"],
          },
        ],
      },
    ],
  },
  {
    label: "Internationale BÃ¼ffets",
    buffets: [
      {
        name: 'BÃ¼ffet â€žMittelmeer"',
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Marinierter SchafskÃ¤se mit Oliven und Peperoni",
              "Salat von Kirschtomaten und MozzarellabÃ¤llchen mit Pesto",
              "Rucolasalat mit geriebenem Parmesan und Tomatenvinaigrette",
              "Farfallesalat mit getrockneten Tomaten, FrÃ¼hlingszwiebeln und Oliven",
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
              "Schweinemedaillons in GorgonzolasoÃŸe mit Broccoli und Tortellini",
              "Wildlachssteak auf mediterranem PfannengemÃ¼se und Risotto",
              'Spanischer Kartoffelauflauf â€žTortilla" mit Grilltomaten',
            ],
          },
          {
            heading: "Dessert",
            items: ["Hausgemachtes Tiramisu", "Panna Cotta mit Mango"],
          },
        ],
      },
      {
        name: 'BÃ¼ffet â€žInternational"',
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Bunte CanapÃ©es mit ungarischer Salami, spanischem Serrano, franzÃ¶sischem Roquefort und norwegischem Lachs",
              "Auberginentaler in Sesamkruste",
              "GefÃ¼llte Zucchini mit Oliven, Tomaten und Feta",
              "MeeresfrÃ¼chtesalat",
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
              "HÃ¤hnchenbrust auf ChinagemÃ¼se und Limettenreis",
              "Bandnudeln mit Lachs-SahnesoÃŸe",
              "KalbshÃ¼ftsteak in Morchelrahm mit KrÃ¤utercouscous",
            ],
          },
          {
            heading: "Dessert",
            items: [
              "RÃ¶llchen von Mascarpone-CrÃªpes mit Erdbeeren",
              "Limetten-Joghurt-CrÃ¨me",
            ],
          },
        ],
      },
      {
        name: 'BÃ¼ffet â€žHawaii"',
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Ika Mata Thunfischsalat",
              "KÃ¤seauswahl mit FrÃ¼chten",
              "Wassermelonensalat mit Rucola und Feta",
              "Exotischer HÃ¼hnchensalat",
              'Reissalat â€žHawaii"',
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
              "Fruchtige HÃ¤hnchenspieÃŸe",
              "GarnelenspieÃŸe in Curry-Ananas-Marinade",
              "Schweinemedaillons Florida mit Curryreis",
              "SÃ¼ÃŸkartoffel-GemÃ¼sepfanne mit Kokos",
            ],
          },
          {
            heading: "Dessert",
            items: [
              "PiÃ±a-Colada-Creme mit Mangospiegel",
              "Kokos-Bananencreme unter gebrannter Rohrzuckerhaube",
              "Exotischer Obstsalat",
              "Eisbombe",
            ],
          },
        ],
      },
      {
        name: 'BÃ¼ffet â€žGourmet"',
        categories: [
          {
            heading: "Kaltes",
            items: [
              "HeringshÃ¤ckerle auf Pumpernickeltaler",
              "Internationale KÃ¤seauswahl mit Trauben und Cracker",
              "Tomaten-Castellosalat mit FrÃ¼hlingszwiebeln",
              "GeflÃ¼gelsalat mit Spargel und Mandarinen",
              "RÃ¤ucherfisch-Canapees von Lachs, Forelle und Makrele",
              "PartybrÃ¶tchen",
            ],
          },
          {
            heading: "Suppe",
            items: ["Waldpilzcremesuppe mit Vollkorncroutons"],
          },
          {
            heading: "Warmes",
            items: [
              "Marinierte Wildschweinmedaillons in PreiselbeersoÃŸe und Schupfnudeln",
              "Flugentenbrust in OrangensoÃŸe mit Schwarzwurzel-LauchgemÃ¼se und Kroketten",
              "Pochierte Schollenfilets in WeiÃŸweinsoÃŸe mit Broccoli und Limettenreis",
            ],
          },
          {
            heading: "Dessert",
            items: ["GrieÃŸflammerie mit Himbeeren", "CrÃ¨me Caramel"],
          },
        ],
      },
    ],
  },
  {
    label: "Weihnachten",
    buffets: [
      {
        name: "Weihnachtliches BÃ¼ffet",
        categories: [
          {
            heading: "Kaltes",
            items: [
              "Winterliche Blattsalate mit Sprossen, NÃ¼ssen, Croutons und Walnussvinaigrette",
              "Deftiger Speckkartoffelsalat",
              "Hausgebeizter Caipirinha-Lachs mit Honig-SenfsoÃŸe",
              "Bunte KÃ¤sespieÃŸe",
              "MÃ¶hrensalat mit Kokos und Ananas",
              "Brotkorb mit Brezeln, PartybrÃ¶tchen und Baguette",
            ],
          },
          {
            heading: "Suppe",
            items: ["Deftige Zwiebelsuppe mit KÃ¤secroutons"],
          },
          {
            heading: "Warmes",
            items: [
              "Welsfilet in Weinteig gebacken mit KrÃ¤uterreis",
              "GÃ¤nsebrust mit Rotkohl, GrÃ¼nkohl und KlÃ¶ÃŸen",
              "Schweinebraten in BackobstsoÃŸe, Rotkohl und Kartoffeln",
            ],
          },
          {
            heading: "Dessert",
            items: [
              "Warmer Apfelstrudel mit VanillesoÃŸe",
              "GrieÃŸflammerie",
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
            Unsere BÃ¼ffets
          </h1>
          <p className="section-lead mx-auto">
            Sie planen eine Familienfeier, eine Hochzeit oder organisieren Ihr
            Betriebsfest? Unsere beliebten BÃ¼ffets sind sicher genau das
            Richtige fÃ¼r Ihre Veranstaltung.
          </p>
        </div>
      </section>

      {/* Hochzeitssaal-Bild */}
      <section className="pb-10 md:pb-14">
        <div className="site-container">
          <div className="panel overflow-hidden">
            <div className="relative aspect-[16/7] w-full">
              <SiteImage
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
            Im Folgenden finden Sie einige BÃ¼ffetvorschlÃ¤ge, die Sie gerne auch
            miteinander kombinieren kÃ¶nnen. FÃ¼r spezielle WÃ¼nsche sind wir
            natÃ¼rlich ganz offen und erstellen Ihr ganz individuelles Angebot.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            In den Wintermonaten arrangieren wir BÃ¼ffets fÃ¼r bis zu 60 Personen
            und in den Sommermonaten bis ca. 20 Personen.
          </p>
        </div>
      </section>

      {/* BÃ¼ffet-Impressionen */}
      <section className="pb-10 md:pb-14">
        <div className="site-container">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { src: "/img/buffet-vorspeise-1.jpeg", alt: "BÃ¼ffet Vorspeise" },
              { src: "/img/buffet-vorspeise-2.jpeg", alt: "BÃ¼ffet Vorspeise" },
              { src: "/img/buffet-dessert.jpeg", alt: "BÃ¼ffet Dessert" },
            ].map((img) => (
              <div
                key={img.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/60 shadow-md"
              >
                <SiteImage
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

      {/* BÃ¼ffet-Gruppen */}
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
              Ihr individuelles BÃ¼ffet
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sie mÃ¶chten ein BÃ¼ffet fÃ¼r Ihre Feier oder Veranstaltung
              zusammenstellen? Schreiben Sie uns gerne eine E-Mail â€” wir beraten
              Sie persÃ¶nlich und erstellen Ihnen ein individuelles Angebot.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="mailto:info@alter-krug-kallinchen.de?subject=BÃ¼ffet-Anfrage"
                className="btn-brand gap-2"
              >
                <Mail className="h-4 w-4" />
                E-Mail schreiben
              </a>
              <Link href="/kontakt" prefetch={false} className="btn-brand-soft">
                Kontaktseite
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}



