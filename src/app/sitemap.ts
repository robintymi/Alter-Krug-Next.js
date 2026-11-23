import type { MetadataRoute } from 'next'
import { getEvents } from '@/lib/content'

export const dynamic = 'force-static'

const BASE_URL = 'https://alter-krug-kallinchen.de'

// Rein informative Seiten (kein Veranstaltungskalender etc.)
const STATIC_PATHS = [
    '',
    'hotel',
    'restaurant',
    'speisekarte',
    'getraenke',
    'bueffet',
    'events',
    'gesundheit',
    'kontakt',
    'anfahrt',
    'stellenangebote',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()

    const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
        url: path ? `${BASE_URL}/${path}/` : `${BASE_URL}/`,
        lastModified: now,
    }))

    const events = await getEvents()
    const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
        url: `${BASE_URL}/events/${event.id}/`,
        lastModified: now,
    }))

    return [...staticEntries, ...eventEntries]
}
