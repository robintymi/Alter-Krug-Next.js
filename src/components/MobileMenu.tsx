"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { type SiteContent } from "@/data/types";

interface MobileMenuProps {
  content: SiteContent["header"];
}

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function MobileMenu({ content }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-white/80 text-primary"
        aria-label="Navigation umschalten"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/45 backdrop-blur-[2px]">
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto border-l border-white/20 bg-[#f9f3e8] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Navigation</p>
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-white/70 text-primary"
                aria-label="Menü schließen"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-2">
              {content.navItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-primary/10 bg-white/65 p-3">
                  {isExternalLink(item.href) ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm font-semibold uppercase tracking-[0.12em] text-foreground/85"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="block text-sm font-semibold uppercase tracking-[0.12em] text-foreground/85"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}

                  {item.items && (
                    <div className="mt-2 space-y-1 border-l border-primary/20 pl-3">
                      {item.items.map((subItem) =>
                        isExternalLink(subItem.href) ? (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block py-1 text-sm text-muted-foreground"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.label}
                          </a>
                        ) : (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            prefetch={false}
                            className="block py-1 text-sm text-muted-foreground"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-8 grid gap-3">
              <a
                href={content.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand-soft w-full"
                onClick={() => setIsOpen(false)}
              >
                Zimmer buchen
              </a>
              <a
                href={content.reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand w-full"
                onClick={() => setIsOpen(false)}
              >
                Tisch reservieren
              </a>
              {content.voucherUrl && (
                <a
                  href={content.voucherUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brand-soft w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Gutschein bestellen
                </a>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
