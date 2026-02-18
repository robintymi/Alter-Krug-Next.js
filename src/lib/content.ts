import { supabaseServer } from './supabase-server'
import type { SiteContent, Event } from '@/data/types'
import fs from 'fs/promises'
import path from 'path'

/**
 * Fallback: site-content.json laden wenn Supabase nicht verfügbar
 */
async function loadFallbackContent(): Promise<SiteContent | null> {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'site-content.json')
        const raw = await fs.readFile(filePath, 'utf-8')
        return JSON.parse(raw) as SiteContent
    } catch {
        return null
    }
}

/**
 * Lädt alle Site-Content-Abschnitte aus Supabase und setzt sie zu einem SiteContent-Objekt zusammen.
 * Fällt auf die lokale JSON-Datei zurück wenn Supabase nicht verfügbar ist.
 */
export async function getSiteContent(): Promise<SiteContent | null> {
    const { data, error } = await supabaseServer
        .from('site_content')
        .select('key, data')

    if (error || !data || data.length === 0) {
        console.warn('Supabase site_content not available, using fallback JSON:', error?.message)
        return loadFallbackContent()
    }

    const content: Record<string, unknown> = {}
    for (const row of data as { key: string; data: unknown }[]) {
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

    return content as unknown as SiteContent
}

/**
 * Lädt alle Events aus der events-Tabelle, sortiert nach sort_order.
 * Fällt auf events aus der JSON-Datei zurück.
 */
export async function getEvents(): Promise<Event[]> {
    const { data, error } = await supabaseServer
        .from('events')
        .select('*')
        .order('sort_order', { ascending: true })

    if (error || !data) {
        console.warn('Supabase events not available, using fallback JSON:', error?.message)
        const fallback = await loadFallbackContent()
        return fallback?.events_page?.events ?? []
    }

    return (data ?? []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        title: row.title as string,
        date: row.date as string,
        time: (row.time as string) || '',
        price: (row.price as string) || '',
        description: (row.description as string) || '',
        image: (row.image as string) || '',
        galleryImage: (row.gallery_image as string) || '',
        recurring: (row.recurring as boolean) || false,
        maxSeats: row.max_seats as number | undefined,
        priceInCents: row.price_in_cents as number | undefined,
    }))
}

/**
 * Lädt ein einzelnes Event anhand seines Slugs/ID.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
    const { data, error } = await supabaseServer
        .from('events')
        .select('*')
        .eq('id', slug)
        .single()

    if (error || !data) {
        // Fallback: aus JSON suchen
        const events = await getEvents()
        return events.find(e => e.id === slug) ?? null
    }

    const row = data as Record<string, unknown>
    return {
        id: row.id as string,
        title: row.title as string,
        date: row.date as string,
        time: (row.time as string) || '',
        price: (row.price as string) || '',
        description: (row.description as string) || '',
        image: (row.image as string) || '',
        galleryImage: (row.gallery_image as string) || '',
        recurring: (row.recurring as boolean) || false,
        maxSeats: row.max_seats as number | undefined,
        priceInCents: row.price_in_cents as number | undefined,
    }
}
