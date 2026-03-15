import Image from "next/image";
import { getSiteContent } from "@/lib/content";
import { MenuCategory } from "@/data/types";

export default async function MenuPage() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  const { menu_page } = content;

  return (
    <main className="min-h-screen">
      <section className="section-space pb-8 text-center">
        <div className="site-container">
          <p className="section-label">Restaurant</p>
          <h1 className="section-title mt-3">{menu_page.title}</h1>
          <p className="section-lead mx-auto">{menu_page.intro}</p>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="site-container max-w-5xl space-y-8">
          {menu_page.categories.map((cat: MenuCategory, idx: number) => {
            return (
              <article key={cat.name + idx} className="panel p-5 md:p-7">
                <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
                  <div>
                    <h2 className="font-serif text-3xl md:text-4xl">{cat.name}</h2>

                    {cat.items.length > 0 ? (
                      <div className="mt-4 space-y-3">
                        {cat.items.map((item, itemIdx: number) => (
                          <div key={item.name + itemIdx} className="flex items-start justify-between gap-4 border-b border-dotted border-primary/15 pb-2">
                            <div>
                              <p className="text-sm font-medium text-foreground md:text-base">{item.name}</p>
                              {item.description && <p className="mt-1 text-xs text-muted-foreground md:text-sm">{item.description}</p>}
                            </div>
                            <span className="whitespace-nowrap text-sm font-normal text-black/75 md:text-base">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-muted-foreground">Noch keine Einträge in dieser Sektion.</p>
                    )}
                  </div>

                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-[#f7ecdb] to-[#efe1cc]">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        loading="lazy"
                        sizes="220px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/50">Platzhalter</p>
                        <p className="font-script text-4xl text-foreground/50">Foto folgt</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
