import type { SiteContent, Event } from '@/data/types'
import fs from 'fs/promises'
import path from 'path'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://neu.alter-krug-kallinchen.de/api'
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

/**
 * Prefixed alle Bild-Pfade (/img/...) mit dem basePath für Static Export.
 */
function prefixImagePaths<T>(obj: T): T {
    if (typeof obj === 'string') {
        if (obj.startsWith('/img/')) return (BASE_PATH + obj) as T
        return obj
    }
    if (Array.isArray(obj)) return obj.map(prefixImagePaths) as T
    if (obj && typeof obj === 'object') {
        const result: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(obj)) {
            result[key] = prefixImagePaths(value)
        }
        return result as T
    }
    return obj
}

/**
 * Fallback: site-content.json laden wenn PHP API nicht verfügbar
 */
async function loadFallbackContent(): Promise<SiteContent | null> {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'site-content.json')
        const raw = await fs.readFile(filePath, 'utf-8')
        return prefixImagePaths(JSON.parse(raw) as SiteContent)
    } catch {
        return null
    }
}

/**
 * Lädt alle Site-Content-Abschnitte aus der PHP API.
 * Fällt auf die lokale JSON-Datei zurück wenn die API nicht verfügbar ist.
 */
export async function getSiteContent(): Promise<SiteContent | null> {
    try {
        const res = await fetch(`${API}/content.php`, { next: { revalidate: 0 } })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const rows: { key: string; data: unknown }[] = await res.json()

        if (!rows || rows.length === 0) throw new Error('Keine Daten')

        const content: Record<string, unknown> = {}
        for (const row of rows) {
            content[row.key] = row.data
        }

        // Events aus der separaten Tabelle laden und in events_page einfügen
        const events = await getEvents()
        const eventsPage = content['events_page'] as Record<string, unknown> | undefined
        if (eventsPage) {
            eventsPage.events = events
        }

        // hotel_page.rooms aus rooms_page übernehmen (falls separat gespeichert)
        const roomsPage = content['rooms_page'] as Record<string, unknown> | undefined
        const hotelPage = content['hotel_page'] as Record<string, unknown> | undefined
        if (roomsPage && hotelPage && !hotelPage.rooms) {
            hotelPage.rooms = (roomsPage as { rooms?: unknown[] }).rooms
        }

        return prefixImagePaths(content as unknown as SiteContent)
    } catch (err) {
        console.warn('PHP API not available, using fallback JSON:', (err as Error).message)
        return loadFallbackContent()
    }
}

/**
 * Lädt alle Events aus der PHP API, sortiert nach sort_order.
 * Fällt auf events aus der JSON-Datei zurück.
 */
export async function getEvents(): Promise<Event[]> {
    try {
        const res = await fetch(`${API}/events.php`, { next: { revalidate: 0 } })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        return prefixImagePaths((data ?? []).map((row: Record<string, unknown>) => ({
            id: row.id as string,
            title: row.title as string,
            date: row.date as string,
            time: (row.time as string) || '',
            price: (row.price as string) || '',
            description: (row.description as string) || '',
            image: (row.image as string) || '',
            galleryImage: (row.gallery_image as string) || '',
            recurring: row.recurring === 1 || row.recurring === true || row.recurring === '1',
            maxSeats: row.max_seats ? Number(row.max_seats) : undefined,
            priceInCents: row.price_in_cents ? Number(row.price_in_cents) : undefined,
        })))
    } catch (err) {
        console.warn('PHP API events not available, using fallback JSON:', (err as Error).message)
        const fallback = await loadFallbackContent()
        return fallback?.events_page?.events ?? []
    }
}

/**
 * Lädt ein einzelnes Event anhand seines Slugs/ID.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
    try {
        const res = await fetch(`${API}/events.php?id=${encodeURIComponent(slug)}`, { next: { revalidate: 0 } })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const row = await res.json() as Record<string, unknown>

        return {
            id: row.id as string,
            title: row.title as string,
            date: row.date as string,
            time: (row.time as string) || '',
            price: (row.price as string) || '',
            description: (row.description as string) || '',
            image: (row.image as string) || '',
            galleryImage: (row.gallery_image as string) || '',
            recurring: row.recurring === 1 || row.recurring === true || row.recurring === '1',
            maxSeats: row.max_seats ? Number(row.max_seats) : undefined,
            priceInCents: row.price_in_cents ? Number(row.price_in_cents) : undefined,
        }
    } catch {
        const events = await getEvents()
        return events.find(e => e.id === slug) ?? null
    }
}
