import { supabase } from './supabase-browser'
import type { Event, MenuCategory } from '@/data/types'

// ─── Events ──────────────────────────────────────────────

export async function getEvents(): Promise<Event[]> {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('sort_order', { ascending: true })

    if (error) throw new Error(error.message)

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

export async function addEvent(event: Partial<Event> & { id: string }) {
    const { error } = await supabase.from('events').insert({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time || '',
        price: event.price || '',
        description: event.description || '',
        image: event.image || '',
        gallery_image: event.galleryImage || '',
        recurring: event.recurring || false,
        max_seats: event.maxSeats || null,
        price_in_cents: event.priceInCents || null,
        sort_order: 999,
    })
    if (error) throw new Error(error.message)
    return { success: true }
}

export async function updateEvent(id: string, updates: Partial<Event>) {
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (updates.title !== undefined) row.title = updates.title
    if (updates.date !== undefined) row.date = updates.date
    if (updates.time !== undefined) row.time = updates.time
    if (updates.price !== undefined) row.price = updates.price
    if (updates.description !== undefined) row.description = updates.description
    if (updates.image !== undefined) row.image = updates.image
    if (updates.galleryImage !== undefined) row.gallery_image = updates.galleryImage
    if (updates.recurring !== undefined) row.recurring = updates.recurring
    if (updates.maxSeats !== undefined) row.max_seats = updates.maxSeats || null
    if (updates.priceInCents !== undefined) row.price_in_cents = updates.priceInCents || null

    const { error } = await supabase.from('events').update(row).eq('id', id)
    if (error) throw new Error(error.message)
    return { success: true }
}

export async function deleteEvent(id: string) {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return { success: true }
}

// ─── Site Content ────────────────────────────────────────

export async function getSiteContentSection<T = unknown>(key: string): Promise<T | null> {
    const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('key', key)
        .single()

    if (error || !data) return null
    return (data as { data: T }).data
}

export async function updateSiteContentSection(key: string, newData: unknown) {
    const { error } = await supabase
        .from('site_content')
        .upsert({ key, data: newData, updated_at: new Date().toISOString() })

    if (error) throw new Error(error.message)
    return { success: true }
}

// ─── Menu & Drinks ───────────────────────────────────────

export interface MenuPageData {
    title: string
    intro?: string
    categories: MenuCategory[]
}

export async function getMenuPages(): Promise<{ menuPage: MenuPageData; drinksPage: MenuPageData }> {
    const [menuResult, drinksResult] = await Promise.all([
        supabase.from('site_content').select('data').eq('key', 'menu_page').single(),
        supabase.from('site_content').select('data').eq('key', 'drinks_page').single(),
    ])

    return {
        menuPage: (menuResult.data as { data: MenuPageData } | null)?.data ?? { title: 'Speisekarte', categories: [] },
        drinksPage: (drinksResult.data as { data: MenuPageData } | null)?.data ?? { title: 'Getränkekarte', categories: [] },
    }
}

export async function saveMenuPages(menuPage: MenuPageData, drinksPage: MenuPageData) {
    const now = new Date().toISOString()
    const results = await Promise.all([
        supabase.from('site_content').upsert({ key: 'menu_page', data: menuPage, updated_at: now }),
        supabase.from('site_content').upsert({ key: 'drinks_page', data: drinksPage, updated_at: now }),
    ])
    const err = results.find(r => r.error)?.error
    if (err) throw new Error(err.message)
    return { success: true }
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
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data ?? []) as Booking[]
}

export async function getBookingsForEvent(eventId: string): Promise<Booking[]> {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data ?? []) as Booking[]
}

export async function cancelBooking(bookingId: string) {
    const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

    if (error) throw new Error(error.message)
    return { success: true }
}
