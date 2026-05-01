import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { MobileMenu } from "@/components/MobileMenu";
import { type SiteContent } from "@/data/types";
import { SiteImage } from "@/components/SiteImage";

interface HeaderProps {
  content: SiteContent["header"];
}

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function NavItemLink({ href, label }: { href: string; label: string }) {
  if (isExternalLink(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-foreground/80 transition-colors hover:text-primary"
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className="inline-flex items-center text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-foreground/80 transition-colors hover:text-primary"
    >
      {label}
    </Link>
  );
}

export function Header({ content }: HeaderProps) {
  return (
    <header className="nav-surface sticky top-0 z-50 shadow-[0_10px_26px_-26px_rgba(27,17,7,0.9)]">
      <div className="site-container flex min-h-[64px] items-center gap-4 py-1.5">
        <Link
          href="/"
          className="relative mx-auto block h-[46px] w-[200px] shrink-0 md:h-[52px] md:w-[240px] lg:mx-0"
          aria-label="Startseite"
        >
          <SiteImage
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/img/allgemein/Logo-neu.png`}
            alt="Alter Krug Kallinchen"
            fill
            priority
            sizes="(max-width: 768px) 200px, 240px"
            className="object-contain"
          />
        </Link>

        <nav className="hidden lg:flex flex-1 items-center justify-center gap-5 xl:gap-7">
          {content.navItems.map((item) => (
            <div key={item.label} className="group relative">
              <NavItemLink href={item.href} label={item.label} />
              {item.items && (
                <div className="invisible absolute left-1/2 top-full z-30 w-64 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="rounded-2xl border border-white/60 bg-[#fff9f2] p-2 shadow-xl">
                    {item.items.map((subItem) => {
                      if (isExternalLink(subItem.href)) {
                        return (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-xl px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            {subItem.label}
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          prefetch={false}
                          className="block rounded-xl px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+49337698980"
            className="hidden xl:inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            033769 8980
          </a>

          <a href={content.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-brand-soft h-10 px-5 text-xs">
            Zimmer buchen
          </a>
          <a href={content.reservationUrl} target="_blank" rel="noopener noreferrer" className="btn-brand h-10 px-5 text-xs">
            Tisch reservieren
          </a>
          {content.voucherUrl && (
            <a href={content.voucherUrl} target="_blank" rel="noopener noreferrer" className="hidden xl:inline-flex btn-brand-soft h-10 px-5 text-xs">
              Gutschein
            </a>
          )}
        </div>

        <div className="ml-auto lg:hidden">
          <MobileMenu content={content} />
        </div>
      </div>
    </header>
  );
}
