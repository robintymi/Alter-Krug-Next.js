'use server'

import { db, type Booking } from '@/lib/supabase'

export async function getBookings(): Promise<Booking[]> {
    const { data, error } = await db
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching bookings:', error)
        return []
    }

    return (data ?? []) as Booking[]
}

export async function getBookingsForEvent(eventId: string): Promise<Booking[]> {
    const { data, error } = await db
        .from('bookings')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching bookings for event:', error)
        return []
    }

    return (data ?? []) as Booking[]
}

export async function cancelBooking(bookingId: string) {
    const { error } = await db
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

    if (error) {
        return { error: 'Buchung konnte nicht storniert werden.' }
    }

    return { success: true }
}
