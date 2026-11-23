import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { BreakfastGallery } from "@/components/BreakfastGallery";
import { SiteImage } from "@/components/SiteImage";
import { buildRestaurantJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Restaurant in Kallinchen am Motzener See",
  description:
    "Regionale Küche im Restaurant Alter Krug in Kallinchen — frische Gerichte und herzliche Gastlichkeit direkt am Motzener See, Brandenburg.",
};

export default async function RestaurantPage() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  const { restaurant_page } = content;

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildRestaurantJsonLd()) }}
      />
      <section className="section-space pb-8">
        <div className="site-container text-center">
          <h1 className="font-script text-6xl text-primary/80 md:text-7xl">{restaurant_page.title}</h1>
        </div>
      </section>

      <section className="pb-10 md:pb-14">
        <div className="site-container">
          <div className="overflow-hidden rounded-3xl">
            <div className="relative aspect-[16/7]">
            <SiteImage
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/img/restaurant-kaminzimmer.jpg`}
              alt="Restaurant Kaminzimmer"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="site-container grid gap-6 md:grid-cols-2">
          {restaurant_page.sections.map((section: { title: string; content: string }, idx: number) => (
            <article key={section.title + idx} className="panel p-6 md:p-8">
              <h2 className="font-serif text-3xl md:text-4xl">{section.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{section.content}</p>
            </article>
          ))}
        </div>
      </section>

      <BreakfastGallery />
    </main>
  );
}
