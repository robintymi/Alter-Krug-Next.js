import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { getSiteContent } from "@/app/actions";
import { Event } from "@/data/types";

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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Veranstaltungen</p>
          <h1 className="section-title mt-3">{events_page.title}</h1>
          <p className="section-lead mx-auto">{events_page.intro}</p>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <div className="site-container grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events_page.events.map((event: Event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group overflow-hidden rounded-3xl border border-white/60 bg-white/78 shadow-[0_18px_42px_-34px_rgba(18,10,4,0.6)] transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10]">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted" />
                )}
                {event.recurring && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                    Wöchentlich
                  </span>
                )}
              </div>

              <div className="p-5 md:p-6">
                <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {event.date}
                  </span>
                  {event.time && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {event.time}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-3xl transition-colors group-hover:text-primary">{event.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{event.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-primary/10 pt-4 text-sm">
                  <span className="font-semibold text-primary">{event.price}</span>
                  <span className="font-medium text-foreground/70">Mehr erfahren</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
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
