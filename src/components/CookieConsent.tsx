"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie_consent";

export type ConsentCategories = {
  necessary: true;
  external: boolean;
};

function getStoredConsent(): ConsentCategories | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function storeConsent(consent: ConsentCategories) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: consent }));
}

export function hasExternalConsent(): boolean {
  const consent = getStoredConsent();
  return consent?.external === true;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getStoredConsent();
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function acceptAll() {
    storeConsent({ necessary: true, external: true });
    setVisible(false);
  }

  function acceptNecessary() {
    storeConsent({ necessary: true, external: false });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/60 bg-[#f9f3e8]/98 p-5 shadow-[0_-8px_40px_-12px_rgba(20,10,4,0.25)] backdrop-blur-md md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Wir respektieren Ihre Privatsphäre
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
              Diese Website verwendet Cookies und externe Dienste (Google Maps)
              zur Verbesserung Ihres Erlebnisses. Mit „Alle akzeptieren" stimmen
              Sie der Nutzung externer Dienste zu. Mehr dazu in unserer{" "}
              <a
                href="/datenschutz"
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Datenschutzerklärung
              </a>
              .
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button
              onClick={acceptNecessary}
              className="inline-flex h-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10 px-5 text-sm font-semibold tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Nur notwendige
            </button>
            <button
              onClick={acceptAll}
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] hover:bg-primary/90"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
