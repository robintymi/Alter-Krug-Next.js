import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Euro } from "lucide-react";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/app/actions";

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  const event = content.events_page.events.find((entry: { id: string }) => entry.id === slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <section className="pt-8">
        <div className="site-container">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Übersicht
          </Link>
        </div>
      </section>

      <article className="section-space pt-5">
        <div className="site-container">
          <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 shadow-[0_18px_52px_-34px_rgba(20,12,6,0.55)]">
            <div className="relative aspect-[16/9]">
              {event.image ? (
                <Image src={event.image} alt={event.title} fill priority sizes="100vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            </div>

            <div className="p-6 md:p-10">
              <div className="mb-6 flex flex-wrap gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {event.date}
                </span>
                {event.time && (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {event.time}
                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <Euro className="h-4 w-4 text-primary" />
                  {event.price}
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-6xl">{event.title}</h1>
              <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">{event.description}</p>

              <div className="mt-9 border-t border-primary/10 pt-6">
                <a
                  href={content.header.reservationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brand"
                >
                  Jetzt reservieren
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
