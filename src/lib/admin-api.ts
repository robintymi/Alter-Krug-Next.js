import { getAuthToken } from './admin-auth'
import type { Event, MenuCategory } from '@/data/types'

function getApiBase(): string {
    // Explizite API-URL hat immer Vorrang (lokal + Produktion)
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL
    }
    // Fallback: gleicher Origin + basePath
    if (typeof window !== 'undefined') {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
        return window.location.origin + basePath + '/api'
    }
    return '/api'
}

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
    const url = getApiBase() + path
    const token = getAuthToken()
    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers as Record<string, string> ?? {}),
        },
    })
}

// ─── Events ──────────────────────────────────────────────

export async function getEvents(): Promise<Event[]> {
    const res = await authFetch(`/events.php`)
    if (!res.ok) throw new Error('Events konnten nicht geladen werden.')
    const data = await res.json()

    return (data ?? []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        title: row.title as string,
        date: row.date as string,
        time: (row.time as string) || '',
        price: (row.price as string) || '',
        description: (row.description as string) || '',
        image: (row.image as string) || '',
        galleryImage: (row.gallery_image as string) || '',
        recurring: row.recurring === 1 || row.recurring === true,
        maxSeats: row.max_seats ? Number(row.max_seats) : undefined,
        priceInCents: row.price_in_cents ? Number(row.price_in_cents) : undefined,
        website: (row.website as string) || '',
        imagePosition: (row.image_position as 'top' | 'center' | 'bottom') || 'center',
    }))
}

export async function addEvent(event: Partial<Event> & { id: string }) {
    const res = await authFetch(`/events.php`, {
        method: 'POST',
        body: JSON.stringify({
            id: event.id,
            title: event.title,
            date: event.date,
            time: event.time || '',
            price: event.price || '',
            description: event.description || '',
            image: event.image || '',
            galleryImage: event.galleryImage || '',
            recurring: event.recurring || false,
            maxSeats: event.maxSeats || null,
            priceInCents: event.priceInCents || null,
            website: event.website || '',
            imagePosition: event.imagePosition || 'center',
            sort_order: 999,
        }),
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Fehler beim Erstellen.')
    }
    return { success: true }
}

export async function updateEvent(id: string, updates: Partial<Event>) {
    const res = await authFetch(`/events.php?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Fehler beim Aktualisieren.')
    }
    return { success: true }
}

export async function deleteEvent(id: string) {
    const res = await authFetch(`/events.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Fehler beim Löschen.')
    }
    return { success: true }
}

// ─── Site Content ────────────────────────────────────────

export async function getSiteContentSection<T = unknown>(key: string): Promise<T | null> {
    const res = await authFetch(`/content.php?key=${encodeURIComponent(key)}`)
    if (!res.ok) return null
    return await res.json() as T
}

export async function updateSiteContentSection(key: string, newData: unknown) {
    const res = await authFetch(`/content.php?key=${encodeURIComponent(key)}`, {
        method: 'PUT',
        body: JSON.stringify(newData),
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Fehler beim Speichern.')
    }
    return { success: true }
}

// ─── Menu & Drinks ───────────────────────────────────────

export interface MenuPageData {
    title: string
    intro?: string
    categories: MenuCategory[]
}

export async function getMenuPages(): Promise<{ menuPage: MenuPageData; drinksPage: MenuPageData }> {
    const res = await authFetch(`/menu.php`)
    if (!res.ok) throw new Error('Menü konnte nicht geladen werden.')
    return await res.json()
}

export async function saveMenuPages(menuPage: MenuPageData, drinksPage: MenuPageData) {
    const res = await authFetch(`/menu.php`, {
        method: 'PUT',
        body: JSON.stringify({ menuPage, drinksPage }),
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Fehler beim Speichern.')
    }
    return { success: true }
}

// ─── Image Upload ───────────────────────────────────────

export async function uploadImage(file: File, folder?: string): Promise<{ path: string; filename: string }> {
    const url = getApiBase() + '/upload.php'
    const token = getAuthToken()

    const formData = new FormData()
    formData.append('image', file)
    if (folder) formData.append('folder', folder)

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
    })

    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload fehlgeschlagen.')
    }

    return await res.json()
}

// ─── Bookings ────────────────────────────────────────────

export interface Booking {
    id: string
    event_id: string
    event_title: string
    event_date: string
    customer_name: string
    customer_email: string
    customer_phone: string | null
    seats: number
    total_price_cents: number
    stripe_session_id: string | null
    status: 'pending' | 'confirmed' | 'cancelled'
    created_at: string
}

export async function getBookings(): Promise<Booking[]> {
    const res = await authFetch(`/bookings.php`)
    if (!res.ok) throw new Error('Buchungen konnten nicht geladen werden.')
    return await res.json() as Booking[]
}

export async function getBookingsForEvent(eventId: string): Promise<Booking[]> {
    const res = await authFetch(`/bookings.php?event_id=${encodeURIComponent(eventId)}`)
    if (!res.ok) throw new Error('Buchungen konnten nicht geladen werden.')
    return await res.json() as Booking[]
}

export async function cancelBooking(bookingId: string) {
    const res = await authFetch(`/bookings.php?id=${encodeURIComponent(bookingId)}&action=cancel`, {
        method: 'PUT',
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Fehler beim Stornieren.')
    }
    return { success: true }
}
