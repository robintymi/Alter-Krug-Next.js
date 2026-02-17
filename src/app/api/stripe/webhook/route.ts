import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    // Dynamic imports so that Resend/Supabase are not initialized at module load time
    const { stripe } = await import('@/lib/stripe')
    const { db } = await import('@/lib/supabase')
    const { sendConfirmationEmail, sendAdminNotification } = await import('@/lib/email')

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.booking_id

        if (!bookingId) {
            console.error('No booking_id in session metadata')
            return NextResponse.json({ error: 'Missing booking_id' }, { status: 400 })
        }

        // Update booking status to confirmed
        const { data: booking, error } = await db
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', bookingId)
            .select()
            .single()

        if (error || !booking) {
            console.error('Failed to update booking:', error)
            return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
        }

        // Send confirmation emails (fire and forget — don't fail the webhook)
        sendConfirmationEmail(booking).catch((e) => console.error('Confirmation email failed:', e))
        sendAdminNotification(booking).catch((e) => console.error('Admin notification failed:', e))
    }

    return NextResponse.json({ received: true })
}
