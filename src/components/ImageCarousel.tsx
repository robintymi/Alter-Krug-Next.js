'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SiteImage } from '@/components/SiteImage';

interface ImageCarouselProps {
  images: string[];
  className?: string;
  aspectRatio?: string;
}

export function ImageCarousel({ images, className, aspectRatio = 'aspect-[4/3]' }: ImageCarouselProps) {
  const autoplay = useRef(Autoplay({ delay: 5500, stopOnInteraction: false }));
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

  if (!images || images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className={cn('relative w-full overflow-hidden rounded-2xl bg-muted', aspectRatio, className)}>
        <SiteImage
          src={images[0]}
          alt="Galeriebild"
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  const shouldRenderSlideImage = (index: number) => {
    const lastIndex = images.length - 1;
    const previousIndex = selectedIndex === 0 ? lastIndex : selectedIndex - 1;
    const nextIndex = selectedIndex === lastIndex ? 0 : selectedIndex + 1;

    return index === selectedIndex || index === previousIndex || index === nextIndex;
  };

  return (
    <div className={cn('group relative w-full overflow-hidden rounded-2xl bg-muted', aspectRatio, className)}>
      <div className="embla h-full w-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {images.map((src, index) => (
            <div className="embla__slide relative h-full min-w-0 flex-[0_0_100%]" key={src + index}>
              {shouldRenderSlideImage(index) ? (
                <SiteImage
                  src={src}
                  alt={`Zimmerbild ${index + 1}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[#ebe2d4]" />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-1.5 text-white transition-colors hover:bg-black/50 md:block"
        onClick={scrollPrev}
        aria-label="Vorheriges Bild"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-1.5 text-white transition-colors hover:bg-black/50 md:block"
        onClick={scrollNext}
        aria-label="Nächstes Bild"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              'h-2 w-2 rounded-full border border-white/70 transition-all',
              index === selectedIndex ? 'scale-110 bg-white' : 'bg-white/35 hover:bg-white/65',
            )}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Zu Bild ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
