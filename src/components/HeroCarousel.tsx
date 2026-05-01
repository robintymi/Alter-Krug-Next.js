'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SiteImage } from '@/components/SiteImage';

interface HeroCarouselProps {
  images: string[];
  content: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
  bookingUrl?: string;
  reservationUrl?: string;
}

export function HeroCarousel({ images, content, bookingUrl, reservationUrl }: HeroCarouselProps) {
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

  const shouldRenderSlideImage = (index: number) => {
    const lastIndex = images.length - 1;
    const previousIndex = selectedIndex === 0 ? lastIndex : selectedIndex - 1;
    const nextIndex = selectedIndex === lastIndex ? 0 : selectedIndex + 1;

    return index === selectedIndex || index === previousIndex || index === nextIndex;
  };

  const primaryCta =
    content.buttonText && content.buttonLink
      ? { label: content.buttonText, href: content.buttonLink }
      : bookingUrl
        ? { label: 'Zimmer buchen', href: bookingUrl }
        : null;

  const secondaryCta = reservationUrl ? { label: 'Tisch reservieren', href: reservationUrl } : null;
  const subtitle =
    content.subtitle?.trim() ||
    'Erholung am See, regionale Küche und herzliche Gastlichkeit – wir freuen uns auf Ihren Besuch.';

  return (
    <div className="group relative w-full min-h-[80svh] overflow-hidden md:min-h-[90svh]">
      <div className="embla h-full w-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {images.map((src, index) => (
            <div className="embla__slide relative h-[80svh] min-w-0 flex-[0_0_100%] md:h-[90svh]" key={src + index}>
              {shouldRenderSlideImage(index) ? (
                <SiteImage
                  src={src}
                  alt={`Alter Krug Ansicht ${index + 1}`}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? undefined : 'lazy'}
                  sizes="100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[#e8dcc6]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
        <div className="max-w-4xl text-center text-white">
          <p className="mx-auto mb-4 inline-flex items-center justify-center rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-white/85 backdrop-blur">
            Hotel &amp; Restaurant am Motzener See
          </p>
          <p className="mb-4 font-script text-4xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] md:text-5xl">Alter Krug Kallinchen</p>
          <h1 className="font-serif text-display font-semibold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            {content.title}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:text-xl">{subtitle}</p>

          {(primaryCta || secondaryCta) && (
            <div className="pointer-events-auto mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {primaryCta && (
                <a
                  href={primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brand h-12 px-9 text-[0.78rem] uppercase tracking-[0.16em]"
                >
                  {primaryCta.label}
                </a>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/45 bg-black/35 px-9 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_30px_-24px_rgba(0,0,0,0.85)] backdrop-blur transition-colors hover:bg-white hover:text-foreground"
                >
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/80">
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-white/60" />
              Direkt am See
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-white/60" />
              Regionale Küche
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-white/60" />
              Für Feiern &amp; Events
            </span>
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
