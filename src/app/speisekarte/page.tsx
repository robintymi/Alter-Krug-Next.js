import Image from "next/image";
import { getSiteContent } from "@/app/actions";
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Restaurant</p>
          <h1 className="section-title mt-3">{menu_page.title}</h1>
          <p className="section-lead mx-auto">{menu_page.intro}</p>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="site-container max-w-5xl space-y-8">
          {menu_page.categories.map((cat: MenuCategory, idx: number) => (
            <article key={cat.name + idx} className="panel p-5 md:p-7">
              <h2 className="font-serif text-3xl md:text-4xl">{cat.name}</h2>
              <div className="mt-5 grid gap-5">
                {cat.items.map((item, itemIdx) => {
                  const alignRight = cat.layout === "alternating" && itemIdx % 2 !== 0;

                  return (
                    <div key={item.name + itemIdx} className={`flex gap-4 ${alignRight ? "flex-row-reverse text-right" : "text-left"}`}>
                      {item.image && (
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-primary/10 md:h-24 md:w-24">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            loading="lazy"
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className={`mb-1 flex gap-3 border-b border-dotted border-primary/20 pb-2 ${alignRight ? "flex-row-reverse" : "justify-between"}`}>
                          <h3 className="text-base font-semibold md:text-lg">{item.name}</h3>
                          <span className="whitespace-nowrap text-sm font-semibold text-primary md:text-base">{item.price} €</span>
                        </div>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
