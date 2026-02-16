import { HeroCarousel } from "@/components/HeroCarousel";

interface HeroProps {
  content: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    images: string[];
  };
}

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <HeroCarousel images={content.images} content={content} />
    </section>
  );
}
