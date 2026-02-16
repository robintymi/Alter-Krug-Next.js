import Image from "next/image";
import Link from "next/link";

interface PromoSectionProps {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function PromoSection({ title, subtitle, description, buttonText, buttonLink, image }: PromoSectionProps) {
  const cta = isExternalLink(buttonLink) ? (
    <a href={buttonLink} target="_blank" rel="noopener noreferrer" className="btn-brand mt-8 w-fit">
      {buttonText}
    </a>
  ) : (
    <Link href={buttonLink} className="btn-brand mt-8 w-fit">
      {buttonText}
    </Link>
  );

  return (
    <section className="section-space">
      <div className="site-container">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/50">
          <Image
            src={image}
            alt={subtitle}
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f1a13]/80 via-[#1f1a13]/62 to-[#1f1a13]/20" />

          <div className="relative z-10 max-w-3xl px-6 py-14 text-white md:px-10 md:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{subtitle}</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">{title}</h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">{description}</p>
            {cta}
          </div>
        </div>
      </div>
    </section>
  );
}
