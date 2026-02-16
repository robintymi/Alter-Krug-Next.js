import Image from "next/image";

interface GallerySectionProps {
  images: string[];
}

export function GallerySection({ images }: GallerySectionProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="section-space">
      <div className="site-container">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Impressionen</p>
          <h2 className="section-title mt-3">Einblicke in den Alten Krug</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((img, index) => (
            <div key={img + index} className="group relative overflow-hidden rounded-2xl border border-white/60 shadow-md">
              <div className="relative aspect-square">
                <Image
                  src={img}
                  alt={`Galerie ${index + 1}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
