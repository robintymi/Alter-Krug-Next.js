import { SiteImage } from "@/components/SiteImage";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Euro } from "lucide-react";
import { notFound } from "next/navigation";
import { getEvents, getEventBySlug } from "@/lib/content";
import { BookingForm } from "@/components/BookingForm";
import { AvailableSeatsDisplay } from "@/components/AvailableSeatsDisplay";

export const dynamicParams = false;

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.id }));
}

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const bookingEnabled = !!(event.priceInCents && event.maxSeats);

  return (
    <main className="min-h-screen">
      <section className="pt-8">
        <div className="site-container">
          <Link href="/events" prefetch={false} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            ZurÃ¼ck zur Ãœbersicht
          </Link>
        </div>
      </section>

      <article className="section-space pt-5">
        <div className="site-container">
          <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 shadow-[0_18px_52px_-34px_rgba(20,12,6,0.55)]">
            <div className="relative aspect-[16/9]">
              {event.image ? (
                <SiteImage src={event.image} alt={event.title} fill priority sizes="100vw" className="object-cover" />
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
                {bookingEnabled && (
                  <AvailableSeatsDisplay eventId={event.id} maxSeats={event.maxSeats!} />
                )}
              </div>

              <h1 className="font-serif text-4xl md:text-6xl">{event.title}</h1>
              <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">{event.description}</p>

              {bookingEnabled && (
                <div className="mt-9 border-t border-primary/10 pt-6">
                  <BookingForm
                    eventId={event.id}
                    eventTitle={event.title}
                    priceInCents={event.priceInCents!}
                    maxSeats={event.maxSeats!}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}




