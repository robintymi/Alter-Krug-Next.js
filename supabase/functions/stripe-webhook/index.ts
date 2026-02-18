import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14?target=deno'

serve(async (req) => {
    try {
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
        const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
        if (!stripeKey || !webhookSecret) {
            throw new Error('Stripe Secrets nicht konfiguriert')
        }

        const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' })

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const body = await req.text()
        const sig = req.headers.get('stripe-signature')

        if (!sig) {
            return new Response('No signature', { status: 400 })
        }

        const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session
            const bookingId = session.metadata?.booking_id

            if (bookingId) {
                // Buchung als bestätigt markieren
                await supabase
                    .from('bookings')
                    .update({ status: 'confirmed' })
                    .eq('id', bookingId)

                // Buchungsdaten laden für E-Mail
                const { data: booking } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('id', bookingId)
                    .single()

                if (booking) {
                    // Bestätigungs-E-Mail an Kunden senden
                    const resendKey = Deno.env.get('RESEND_API_KEY')
                    const fromEmail = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev'
                    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'info@alter-krug.de'

                    if (resendKey) {
                        const totalFormatted = (booking.total_price_cents / 100).toFixed(2).replace('.', ',') + ' €'

                        // E-Mail an Kunden
                        await fetch('https://api.resend.com/emails', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${resendKey}`,
                            },
                            body: JSON.stringify({
                                from: `Alter Krug <${fromEmail}>`,
                                to: [booking.customer_email],
                                subject: `Buchungsbestätigung: ${booking.event_title}`,
                                html: `
                                    <h2>Buchungsbestätigung</h2>
                                    <p>Hallo ${booking.customer_name},</p>
                                    <p>vielen Dank für Ihre Buchung!</p>
                                    <table style="border-collapse:collapse;margin:16px 0">
                                        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Veranstaltung:</td><td>${booking.event_title}</td></tr>
                                        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Datum:</td><td>${booking.event_date}</td></tr>
                                        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Plätze:</td><td>${booking.seats}</td></tr>
                                        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Gesamtpreis:</td><td>${totalFormatted}</td></tr>
                                    </table>
                                    <p>Wir freuen uns auf Sie!</p>
                                    <p>Ihr Team vom Alter Krug</p>
                                `,
                            }),
                        })

                        // Benachrichtigungs-E-Mail an Admin
                        await fetch('https://api.resend.com/emails', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${resendKey}`,
                            },
                            body: JSON.stringify({
                                from: `Buchungssystem <${fromEmail}>`,
                                to: [adminEmail],
                                subject: `Neue Buchung: ${booking.event_title} — ${booking.seats} Plätze`,
                                html: `
                                    <h2>Neue Buchung eingegangen</h2>
                                    <table style="border-collapse:collapse;margin:16px 0">
                                        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Event:</td><td>${booking.event_title}</td></tr>
                                        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Datum:</td><td>${booking.event_date}</td></tr>
                                        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Kunde:</td><td>${booking.customer_name}</td></tr>
                                        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">E-Mail:</td><td>${booking.customer_email}</td></tr>
                                        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Telefon:</td><td>${booking.customer_phone || '—'}</td></tr>
                                        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Plätze:</td><td>${booking.seats}</td></tr>
                                        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Betrag:</td><td>${totalFormatted}</td></tr>
                                    </table>
                                `,
                            }),
                        })
                    }
                }
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (err) {
        console.error('Webhook error:', err)
        return new Response(
            JSON.stringify({ error: (err as Error).message }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
    }
})
