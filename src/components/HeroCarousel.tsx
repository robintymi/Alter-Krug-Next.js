'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroCarouselProps {
  images: string[];
  content: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
}

export function HeroCarousel({ images, content }: HeroCarouselProps) {
  const autoplay = useRef(Autoplay({ delay: 6000, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onSelect();
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!images.length) {
    return null;
  }

  return (
    <div className="group relative w-full min-h-[66svh] overflow-hidden md:min-h-[76svh]">
      <div className="embla h-full w-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {images.map((src, index) => (
            <div className="embla__slide relative h-[66svh] min-w-0 flex-[0_0_100%] md:h-[76svh]" key={src + index}>
              <Image
                src={src}
                alt={`Alter Krug Ansicht ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/65" />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
        <div className="max-w-5xl text-center text-white">
          <p className="mb-4 font-script text-5xl text-white/85 md:text-6xl">
            Alter Krug Kallinchen
          </p>
          <h1 className="text-display font-serif font-semibold drop-shadow-[0_8px_28px_rgba(0,0,0,0.45)]">
            {content.title}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-white/90 md:text-xl">{content.subtitle}</p>
          <div className="pointer-events-auto mt-9">
            <a
              href={content.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand h-12 px-8 text-[0.8rem] uppercase tracking-[0.16em]"
            >
              {content.buttonText}
            </a>
          </div>
        </div>
      </div>

      <button
        className="absolute left-3 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-white/25 bg-black/25 p-2.5 text-white/90 transition-colors hover:bg-black/55 md:block"
        onClick={scrollPrev}
        aria-label="Vorheriges Bild"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute right-3 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-white/25 bg-black/25 p-2.5 text-white/90 transition-colors hover:bg-black/55 md:block"
        onClick={scrollNext}
        aria-label="Nächstes Bild"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              'h-2.5 w-2.5 rounded-full border border-white/60 transition-all',
              index === selectedIndex ? 'scale-110 bg-white' : 'bg-white/30 hover:bg-white/60',
            )}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Zu Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
