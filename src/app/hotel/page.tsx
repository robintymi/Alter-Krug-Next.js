import Image from "next/image";
import { getSiteContent } from "@/lib/content";
import { GallerySection } from "@/components/GallerySection";
import { ImageCarousel } from "@/components/ImageCarousel";

export default async function HotelPage() {
  const content = await getSiteContent();

  if (!content) {
    return <div className="site-container py-16">Laden der Inhalte fehlgeschlagen.</div>;
  }

  const { hotel_page } = content;
  const rooms = hotel_page.rooms ?? [];

  return (
    <main className="min-h-screen">
      {hotel_page.image && (
        <section className="relative isolate overflow-hidden">
          <div className="relative h-[58svh] min-h-[480px] w-full md:h-[70svh]">
            <Image src={hotel_page.image} alt="Hotel Alter Krug" fill priority sizes="100vw" className="object-cover object-[center_25%]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/65" />
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="site-container text-white">
              <h1 className="font-script text-6xl text-white md:text-8xl">Hotel</h1>
              <a
                href={hotel_page.heroButtonLink || "https://neo.cultbooking.com/CPC/?agentcode=58078&hotelcode=38740"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand mt-6"
              >
                {hotel_page.heroButtonText || "Zimmer buchen"}
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="section-space">
        <div className="site-container grid gap-7 lg:grid-cols-[1.2fr_1fr]">
          <article className="panel p-6 md:p-8">
            <h2 className="font-script text-5xl text-primary/80 md:text-6xl">Erholung am Motzener See</h2>
            <p className="mt-5 text-muted-foreground">{hotel_page.mission}</p>
          </article>

          <article className="panel p-6 md:p-8">
            <h3 className="font-script text-5xl text-primary/80 md:text-6xl">Ihr Aufenthalt</h3>
            <p className="mt-4 text-muted-foreground">{hotel_page.bookingText}</p>
            <a
              href={hotel_page.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand mt-6"
            >
              {hotel_page.buttonText}
            </a>
          </article>
        </div>
      </section>

      {rooms.length > 0 && (
        <section className="section-space bg-[#f7efe2]/65">
          <div className="site-container">
            <div className="mb-10 text-center">
              <h2 className="font-script text-5xl text-primary/80 md:text-6xl">Zimmer & Preise</h2>
            </div>

            <div className="space-y-8">
              {rooms.map((room, index) => (
                <article key={room.type + index} className="panel p-5 md:p-7">
                  <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-center">
                    <div>
                      <h3 className="font-serif text-3xl text-foreground md:text-4xl">{room.type}</h3>
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground md:text-base">
                        {room.features.map((feature, featureIndex) => (
                          <li key={feature + featureIndex}>{feature}</li>
                        ))}
                      </ul>
                      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-primary">{room.price}</p>
                    </div>

                    <div>
                      {room.images && room.images.length > 0 ? (
                        <ImageCarousel images={room.images} aspectRatio="aspect-[16/10]" />
                      ) : room.image ? (
                        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                          <Image
                            src={room.image}
                            alt={room.type}
                            fill
                            loading="lazy"
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] rounded-2xl bg-muted" />
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {hotel_page.gallery && <GallerySection images={hotel_page.gallery} />}

      {hotel_page.apartmentRecommendation && (
        <section className="section-space">
          <div className="site-container">
            <div className="rounded-[2rem] border border-primary/20 bg-primary/10 p-8 text-center">
              <p className="mx-auto max-w-3xl text-muted-foreground">{hotel_page.apartmentRecommendation.text}</p>
              <a
                href={hotel_page.apartmentRecommendation.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-semibold text-primary underline decoration-primary/40 underline-offset-4"
              >
                {hotel_page.apartmentRecommendation.recommendationText}: {hotel_page.apartmentRecommendation.linkText}
              </a>
            </div>
          </div>
        </section>
      )}

      {hotel_page.bottomBooking && (
        <section className="section-space pt-0">
          <div className="site-container">
            <div className="panel mx-auto max-w-4xl p-8 text-center md:p-10">
              <h2 className="font-script text-5xl text-primary/80 md:text-6xl">{hotel_page.bottomBooking.title}</h2>
              <p className="mt-5 text-muted-foreground">{hotel_page.bottomBooking.text}</p>
              <a
                href={hotel_page.bottomBooking.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand mt-7"
              >
                {hotel_page.bottomBooking.buttonText}
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
