"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const images = [
  { src: "/img/fruehstueck/bueffet-theke.jpeg", alt: "Frühstücksbüffet Theke" },
  { src: "/img/fruehstueck/joghurt-muesli.jpeg", alt: "Joghurt, Müsli & Obstsalat" },
  { src: "/img/fruehstueck/warmes-bueffet.jpeg", alt: "Warmes Frühstück" },
  { src: "/img/fruehstueck/aufschnitt.jpeg", alt: "Frischer Aufschnitt" },
  { src: "/img/fruehstueck/kaese.jpeg", alt: "Käseplatte" },
  { src: "/img/fruehstueck/broetchen.jpeg", alt: "Frische Brötchen" },
  { src: "/img/fruehstueck/kraeuter-herz.jpeg", alt: "Mit Liebe zubereitet" },
];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function BreakfastGallery() {
  const [open, setOpen] = useState(false);

  return (
    <section className="pb-16 md:pb-20">
      <div className="site-container">
        <div className="text-center">
          <h2 className="font-script text-5xl text-primary/80 md:text-6xl">
            Unser Frühstücksbüffet
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Starten Sie den Tag mit unserem reichhaltigen Frühstücksbüffet — frische
            Brötchen, Aufschnitt, Käse, Joghurt, Müsli, Obst und warme Speisen.
          </p>
        </div>

        {/* Hero image */}
        <div className="mt-8 overflow-hidden rounded-3xl">
          <div className="relative aspect-[21/9]">
            <Image
              src={`${basePath}${images[0].src}`}
              alt={images[0].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="mx-auto mt-6 flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        >
          {open ? "Galerie schließen" : "Alle Impressionen ansehen"}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Expandable gallery grid */}
        <div
          className={`grid grid-cols-2 gap-3 overflow-hidden transition-all duration-500 ease-in-out md:grid-cols-3 md:gap-4 ${
            open ? "mt-6 max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {images.slice(1).map((img) => (
            <div
              key={img.src}
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={`${basePath}${img.src}`}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                <p className="text-xs font-medium text-white/90">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
