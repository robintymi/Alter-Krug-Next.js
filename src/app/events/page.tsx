import Image from "next/image";
import { getSiteContent } from "@/lib/content";
import { EventsList } from "@/components/EventsList";

export default async function EventsPage() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  const { events_page } = content;

  return (
    <main className="min-h-screen">
      <section className="section-space pb-8">
        <div className="site-container text-center">
          <p className="section-label">Veranstaltungen</p>
          <h1 className="section-title mt-3">{events_page.title}</h1>
          <p className="section-lead mx-auto">{events_page.intro}</p>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <EventsList fallbackEvents={events_page.events} />
      </section>

      {events_page.gallery && events_page.gallery.length > 0 && (
        <section className="section-space bg-[#f7efe2]/60">
          <div className="site-container">
            <h2 className="section-title text-center">Impressionen</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {events_page.gallery.map((img: string, idx: number) => (
                <div key={img + idx} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/60 shadow-md">
                  <Image
                    src={img}
                    alt="Event Impression"
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
      )}
    </main>
  );
}
