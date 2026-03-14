"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { hasExternalConsent } from "@/components/CookieConsent";

interface GoogleMapsEmbedProps {
  src: string;
  title?: string;
}

export function GoogleMapsEmbed({ src, title = "Google Maps" }: GoogleMapsEmbedProps) {
  const [consented, setConsented] = useState(() => hasExternalConsent());

  useEffect(() => {
    function onConsentChange(e: Event) {
      const detail = (e as CustomEvent).detail;
      setConsented(detail?.external === true);
    }

    window.addEventListener("cookie-consent-change", onConsentChange);
    return () => window.removeEventListener("cookie-consent-change", onConsentChange);
  }, []);

  if (!consented) {
    return (
      <div className="flex aspect-[16/9] min-h-[320px] w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#f7ecdb] to-[#efe1cc] p-6 text-center">
        <div className="rounded-full bg-primary/10 p-4">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="font-serif text-xl text-foreground md:text-2xl">
            Google Maps
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Zum Anzeigen der Karte müssen externe Inhalte von Google geladen
            werden. Dabei werden Daten an Google übermittelt.
          </p>
        </div>
        <button
          onClick={() => {
            const consent = { necessary: true as const, external: true };
            localStorage.setItem("cookie_consent", JSON.stringify(consent));
            window.dispatchEvent(
              new CustomEvent("cookie-consent-change", { detail: consent })
            );
          }}
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] hover:bg-primary/90"
        >
          Karte laden
        </button>
        <a
          href="/datenschutz"
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-primary"
        >
          Datenschutzerklärung
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={src}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="absolute inset-0"
      title={title}
    />
  );
}
