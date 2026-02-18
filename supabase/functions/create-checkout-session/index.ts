import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14?target=deno'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
        if (!stripeKey) throw new Error('STRIPE_SECRET_KEY nicht konfiguriert')

        const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' })

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { eventId, customerName, customerEmail, customerPhone, seats } = await req.json()

        if (!eventId || !customerName || !customerEmail || !seats) {
            return new Response(
                JSON.stringify({ error: 'Fehlende Pflichtfelder.' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Event laden
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single()

        if (eventError || !event) {
            return new Response(
                JSON.stringify({ error: 'Event nicht gefunden.' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (!event.price_in_cents) {
            return new Response(
                JSON.stringify({ error: 'Dieses Event ist nicht buchbar.' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Verfügbare Plätze prüfen
        if (event.max_seats) {
            const { data: bookings } = await supabase
                .from('bookings')
                .select('seats')
                .eq('event_id', eventId)
                .in('status', ['pending', 'confirmed'])

            const bookedSeats = (bookings ?? []).reduce((sum: number, b: { seats: number }) => sum + b.seats, 0)
            const available = event.max_seats - bookedSeats

            if (seats > available) {
                return new Response(
                    JSON.stringify({ error: `Nur noch ${available} Plätze verfügbar.` }),
                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }
        }

        const totalCents = event.price_in_cents * seats

        // Booking in DB erstellen (status: pending)
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                event_id: eventId,
                event_title: event.title,
                event_date: event.date,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone || null,
                seats,
                total_price_cents: totalCents,
                status: 'pending',
            })
            .select()
            .single()

        if (bookingError) {
            return new Response(
                JSON.stringify({ error: 'Buchung konnte nicht erstellt werden.' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const baseUrl = Deno.env.get('SITE_URL') || 'https://alter-krug-seddiner-see.de'

        // Stripe Checkout Session erstellen
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `${event.title} — ${seats} Platz${seats > 1 ? 'ä' : ''}tze`,
                            description: `${event.date} | ${event.time}`,
                        },
                        unit_amount: totalCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/events/${eventId}/buchung-bestaetigt?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/events/${eventId}`,
            customer_email: customerEmail,
            metadata: {
                booking_id: booking.id,
                event_id: eventId,
            },
        })

        // Stripe Session ID an Booking speichern
        await supabase
            .from('bookings')
            .update({ stripe_session_id: session.id })
            .eq('id', booking.id)

        return new Response(
            JSON.stringify({ url: session.url }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (err) {
        return new Response(
            JSON.stringify({ error: (err as Error).message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
