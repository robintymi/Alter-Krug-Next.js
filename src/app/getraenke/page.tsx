import Image from "next/image";
import { getSiteContent } from "@/app/actions";
import { MenuCategory } from "@/data/types";

export default async function DrinksPage() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  const { drinks_page } = content;

  return (
    <main className="min-h-screen">
      <section className="section-space pb-8 text-center">
        <div className="site-container">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Restaurant</p>
          <h1 className="section-title mt-3">{drinks_page.title}</h1>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="site-container max-w-5xl space-y-8">
          {drinks_page.categories.map((cat: MenuCategory, idx: number) => (
            <article key={cat.name + idx} className="panel p-5 md:p-7">
              <div className="grid gap-5 md:grid-cols-[1fr_220px] md:items-start">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl">{cat.name}</h2>
                  <div className="mt-4 space-y-3">
                    {cat.items.map((item, itemIdx: number) => (
                      <div key={item.name + itemIdx} className="flex items-start justify-between gap-4 border-b border-dotted border-primary/15 pb-2">
                        <div>
                          <p className="text-sm font-medium text-foreground md:text-base">{item.name}</p>
                          {item.description && <p className="mt-1 text-xs text-muted-foreground md:text-sm">{item.description}</p>}
                        </div>
                        <span className="whitespace-nowrap text-sm font-semibold text-primary md:text-base">{item.price} €</span>
                      </div>
                    ))}
                  </div>
                </div>

                {cat.image && (
                  <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl border border-primary/10 md:block">
                    <Image src={cat.image} alt={cat.name} fill loading="lazy" sizes="220px" className="object-cover" />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
