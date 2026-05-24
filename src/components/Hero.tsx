import { HeroCarousel } from "@/components/HeroCarousel";

interface HeroProps {
  content: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    images: string[];
  };
  bookingUrl?: string;
  reservationUrl?: string;
}

export function Hero({ content, bookingUrl, reservationUrl }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <HeroCarousel
        images={content.images}
        content={content}
        bookingUrl={bookingUrl}
        reservationUrl={reservationUrl}
      />
    </section>
  );
}
