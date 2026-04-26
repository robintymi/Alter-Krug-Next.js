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
        className="inline-flex items-center text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-foreground/80 transition-colors hover:text-primary"
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className="inline-flex items-center text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-foreground/80 transition-colors hover:text-primary"
    >
      {label}
    </Link>
  );
}

export function Header({ content }: HeaderProps) {
  return (
    <>
    <header className="w-full">
      <div className="w-full border-b border-white/40 bg-[#fcf6eb]/95">
        <div className="site-container flex min-h-[100px] items-center justify-between gap-6 py-2">
          <div className="hidden lg:flex flex-col text-xs uppercase tracking-[0.15em] text-muted-foreground">
            <span>Hotel & Restaurant</span>
            <span className="text-foreground">Am Motzener See</span>
          </div>

          <Link href="/" className="relative mx-auto block h-[86px] w-[270px] md:h-[96px] md:w-[320px]">
            <SiteImage
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/img/allgemein/Logo-neu.png`}
              alt="Alter Krug Kallinchen"
              fill
              priority
              sizes="(max-width: 768px) 240px, 280px"
              className="object-contain"
            />
          </Link>

          <a
            href="tel:+49337698980"
            className="hidden lg:inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            033769 8980
          </a>
        </div>
      </div>
    </header>

      <div className="nav-surface sticky top-0 z-50 shadow-[0_8px_20px_-20px_rgba(27,17,7,0.7)]">
        <div className="site-container flex min-h-[66px] items-center gap-4">
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
              href={content.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand-soft"
            >
              Zimmer buchen
            </a>
            <a
              href={content.reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand"
            >
              Tisch reservieren
            </a>
            {content.voucherUrl && (
              <a
                href={content.voucherUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand-soft"
              >
                Gutschein
              </a>
            )}
          </div>

          <div className="ml-auto lg:hidden">
            <MobileMenu content={content} />
          </div>
        </div>
      </div>
    </>
  );
}
