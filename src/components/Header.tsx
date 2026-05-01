import Link from "next/link";
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

        <div className="hidden lg:flex items-center shrink-0">
          <div className="group relative">
            <button className="btn-brand h-9 px-5 text-[0.7rem] flex items-center gap-1.5">
              Buchen
              <svg className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="invisible absolute right-0 top-full z-30 w-56 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="rounded-2xl border border-white/60 bg-[#fff9f2] p-2 shadow-xl">
                <a href={content.bookingUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary">
                  <span className="text-base">🛏</span> Hotelzimmer buchen
                </a>
                <a href={content.reservationUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary">
                  <span className="text-base">🍽</span> Tisch reservieren
                </a>
                {content.voucherUrl && (
                  <a href={content.voucherUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary">
                    <span className="text-base">🎁</span> Gutschein kaufen
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="ml-auto lg:hidden">
          <MobileMenu content={content} />
        </div>
      </div>
    </header>
  );
}
