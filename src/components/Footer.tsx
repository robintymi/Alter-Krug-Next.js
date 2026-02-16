import Link from "next/link";
import { type SiteContent } from "@/data/types";

interface FooterProps {
  content: SiteContent["footer"];
}

export function Footer({ content }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-white/40 bg-[#20160f] text-white">
      <div className="site-container py-14 md:py-18">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Adresse</p>
            <h3 className="mt-3 font-serif text-3xl">{content.address.title}</h3>
            <div className="mt-4 space-y-1 text-sm text-white/80">
              {content.address.lines.map((line, i) => (
                <p key={line + i}>{line}</p>
              ))}
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <a href={`tel:${content.address.phone}`} className="block text-white/85 transition-colors hover:text-[#f6c38a]">
                {content.address.phone}
              </a>
              <a href={`mailto:${content.address.email}`} className="block text-white/85 transition-colors hover:text-[#f6c38a]">
                {content.address.email}
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Info</p>
            <h3 className="mt-3 font-serif text-3xl">{content.openingHours.title}</h3>
            <ul className="mt-4 space-y-1 text-sm text-white/80">
              {content.openingHours.lines.map((line, i) => (
                <li key={line + i}>{line}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Rechtliches</p>
            <h3 className="mt-3 font-serif text-3xl">Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>
                <Link href="/impressum" className="transition-colors hover:text-[#f6c38a]">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="transition-colors hover:text-[#f6c38a]">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="transition-colors hover:text-[#f6c38a]">
                  Kontakt
                </Link>
              </li>
              <li>
                <a
                  href="https://www.yovite.com/Restaurant-Gutschein-R-84831799.html?REF=REST"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#f6c38a]"
                >
                  Gutschein bestellen
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Alter Krug Kallinchen. Alle Rechte vorbehalten.</p>
          <Link href="/admin/login" className="text-white/60 transition-colors hover:text-[#f6c38a]">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
