'use server'

import { getEvents } from './admin-events'

export interface BookingFormData {
    eventId: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    seats: number
}

export async function createCheckoutSession(data: BookingFormData) {
    // Dynamic imports so no service client is evaluated at module load time
    const { stripe } = await import('@/lib/stripe')
    const { db } = await import('@/lib/supabase')

    // 1. Load event
    const events = await getEvents()
    const event = events.find((e) => e.id === data.eventId)

    if (!event) {
        return { error: 'Veranstaltung nicht gefunden.' }
    }

    if (!event.priceInCents || !event.maxSeats) {
        return { error: 'Diese Veranstaltung unterstützt keine Online-Buchung.' }
    }

    // 2. Check available seats
    const { data: existingBookings, error: dbError } = await db
        .from('bookings')
        .select('seats')
        .eq('event_id', data.eventId)
        .in('status', ['pending', 'confirmed'])

    if (dbError) {
        console.error('Supabase error:', dbError)
        return { error: 'Datenbankfehler. Bitte versuche es erneut.' }
    }

    const bookedSeats = ((existingBookings ?? []) as { seats: number }[]).reduce((sum, b) => sum + b.seats, 0)
    const availableSeats = event.maxSeats - bookedSeats

    if (data.seats > availableSeats) {
        return { error: `Nur noch ${availableSeats} Plätze verfügbar.` }
    }

    const totalPriceCents = event.priceInCents * data.seats
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    // 3. Create pending booking in Supabase
    const { data: booking, error: insertError } = await db
        .from('bookings')
        .insert({
            event_id: event.id,
            event_title: event.title,
            event_date: event.date,
            customer_name: data.customerName,
            customer_email: data.customerEmail,
            customer_phone: data.customerPhone ?? null,
            seats: data.seats,
            total_price_cents: totalPriceCents,
            status: 'pending',
        })
        .select('id')
        .single()

    if (insertError || !booking) {
        console.error('Insert error:', insertError)
        return { error: 'Buchung konnte nicht erstellt werden.' }
    }

    const bookingId = (booking as { id: string }).id

    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: event.title,
                        description: `${event.date}${event.time ? ` um ${event.time}` : ''} · ${data.seats} Platz/Plätze`,
                    },
                    unit_amount: event.priceInCents,
                },
                quantity: data.seats,
            },
        ],
        mode: 'payment',
        customer_email: data.customerEmail,
        metadata: { booking_id: bookingId },
        success_url: `${baseUrl}/events/${event.id}/buchung-bestaetigt?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/events/${event.id}?buchung=abgebrochen`,
    })

    // 5. Save Stripe session ID to booking
    await db.from('bookings').update({ stripe_session_id: session.id }).eq('id', bookingId)

    return { url: session.url }
}

export async function getAvailableSeats(eventId: string, maxSeats: number): Promise<number> {
    const { db } = await import('@/lib/supabase')

    const { data: bookings } = await db
        .from('bookings')
        .select('seats')
        .eq('event_id', eventId)
        .in('status', ['pending', 'confirmed'])

    const bookedSeats = ((bookings ?? []) as { seats: number }[]).reduce((sum, b) => sum + b.seats, 0)
    return Math.max(0, maxSeats - bookedSeats)
}
