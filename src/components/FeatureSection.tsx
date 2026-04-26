import Link from "next/link";
import { cn } from "@/lib/utils";
import { SiteImage } from "@/components/SiteImage";

interface FeatureSectionProps {
  id?: string;
  label?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageSrc?: string;
  reversed?: boolean;
}

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function FeatureSection({
  id,
  title,
  description,
  buttonText,
  buttonLink,
  imageSrc,
  reversed,
}: FeatureSectionProps) {
  const cta = isExternalLink(buttonLink) ? (
    <a href={buttonLink} target="_blank" rel="noopener noreferrer" className="btn-brand mt-2 w-fit">
      {buttonText}
    </a>
  ) : (
    <Link href={buttonLink} className="btn-brand mt-2 w-fit">
      {buttonText}
    </Link>
  );

  return (
    <section id={id} className="section-space defer-render">
      <div
        className={cn(
          "site-container grid items-center gap-8 lg:gap-14",
          reversed ? "md:grid-cols-[1.05fr_1fr]" : "md:grid-cols-[1fr_1.05fr]",
        )}
      >
        <div className={cn("panel p-6 md:p-8", reversed && "md:order-2")}>
          <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">{title}</h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
          {cta}
        </div>

        <div className={cn("relative overflow-hidden rounded-3xl", reversed && "md:order-1")}>
          <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/20 to-transparent" />
          {imageSrc ? (
            <div className="relative aspect-[16/11]">
              <SiteImage
                src={imageSrc}
                alt={title}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ) : (
            <div className="aspect-[16/11] bg-muted" />
          )}
        </div>
      </div>
    </section>
  );
}
