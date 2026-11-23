import type { Event } from "@/data/types"

const SITE_URL = "https://alter-krug-kallinchen.de"

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Hauptstraße 15",
  addressLocality: "Zossen – Kallinchen",
  postalCode: "15806",
  addressRegion: "Brandenburg",
  addressCountry: "DE",
}

const HERO_IMAGE = `${SITE_URL}/img/alter-krug-scharf.jpg`

/**
 * Site-weite Hotel-Daten (JSON-LD) — im Root-Layout eingebunden, erscheint
 * also auf jeder Seite. Zeigt Google z.B. Adresse und Telefonnummer direkt
 * im Suchergebnis an.
 */
export function buildHotelJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: "Alter Krug Kallinchen",
    description: "Hotel & Restaurant am Motzener See in Kallinchen bei Zossen, Brandenburg.",
    url: SITE_URL,
    image: HERO_IMAGE,
    telephone: "+49 33769 8980",
    email: "info@alter-krug-kallinchen.de",
    address: ADDRESS,
  }
}

/**
 * Restaurant-Daten (JSON-LD) — auf den Restaurant-/Speisekarten-Seiten
 * eingebunden.
 */
export function buildRestaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Restaurant Alter Krug Kallinchen",
    description: "Regionale Küche im Restaurant Alter Krug in Kallinchen am Motzener See.",
    url: `${SITE_URL}/restaurant/`,
    image: HERO_IMAGE,
    telephone: "+49 33769 8980",
    address: ADDRESS,
    servesCuisine: "Regionale Küche",
    menu: `${SITE_URL}/speisekarte/`,
  }
}

/**
 * Event-Daten (JSON-LD) — auf jeder Event-Detailseite eingebunden. Ermöglicht
 * Google reichhaltigere Suchergebnisse (Datum, Ort, Preis) für Veranstaltungen.
 */
export function buildEventJsonLd(event: Event) {
    const startDate = parseGermanDateToIso(event.date, event.time)

    const data: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.description || undefined,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
            "@type": "Place",
            name: "Alter Krug Kallinchen",
            address: ADDRESS,
        },
        image: event.image ? `${SITE_URL}${event.image}` : HERO_IMAGE,
        url: `${SITE_URL}/events/${event.id}/`,
    }

    if (startDate) {
        data.startDate = startDate
    }

    if (event.priceInCents) {
        data.offers = {
            "@type": "Offer",
            price: (event.priceInCents / 100).toFixed(2),
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/events/${event.id}/`,
        }
    }

    return data
}

/**
 * Wandelt ein deutsches Datum ("24.04.2026") + optionale Uhrzeit ("18:00")
 * in ein ISO-8601-Datum um. Gibt null zurück, wenn das Datum nicht im
 * erwarteten Format vorliegt (z.B. bei wiederkehrenden Events wie
 * "Jeden Dienstag").
 */
function parseGermanDateToIso(date: string, time: string): string | null {
    const match = date.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
    if (!match) return null

    const [, day, month, year] = match
    const timeMatch = time?.match(/^(\d{1,2})[:.](\d{2})$/)
    const hours = timeMatch ? timeMatch[1].padStart(2, "0") : "00"
    const minutes = timeMatch ? timeMatch[2] : "00"

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hours}:${minutes}:00+01:00`
}
