import { Resend } from 'resend'
import type { Booking } from './supabase'

function getResend() {
    return new Resend(process.env.RESEND_API_KEY!)
}

const adminEmail = () => process.env.ADMIN_EMAIL ?? 'info@alter-krug.de'
const fromEmail = () => process.env.FROM_EMAIL ?? 'buchung@alter-krug.de'

function formatPrice(cents: number) {
    return (cents / 100).toFixed(2).replace('.', ',') + ' €'
}

export async function sendConfirmationEmail(booking: Booking) {
    await getResend().emails.send({
        from: `Alter Krug Kallinchen <${fromEmail()}>`,
        to: booking.customer_email,
        subject: `Buchungsbestätigung: ${booking.event_title}`,
        html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1b1107;">
                <h2 style="color: #7c5c2e;">Ihre Buchung ist bestätigt!</h2>
                <p>Vielen Dank für Ihre Buchung, ${booking.customer_name}.</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e8ddd0; font-weight: bold;">Veranstaltung</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e8ddd0;">${booking.event_title}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e8ddd0; font-weight: bold;">Datum</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e8ddd0;">${booking.event_date}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e8ddd0; font-weight: bold;">Plätze</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e8ddd0;">${booking.seats}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Gesamtpreis</td>
                        <td style="padding: 8px;">${formatPrice(booking.total_price_cents)}</td>
                    </tr>
                </table>
                <p>Wir freuen uns auf Ihren Besuch!</p>
                <p style="margin-top: 32px; font-size: 14px; color: #7c5c2e;">
                    Alter Krug Kallinchen<br>
                    Am Alten Krug 1 · 15741 Bestensee<br>
                    Tel: 033769 8980
                </p>
            </div>
        `,
    })
}

export async function sendAdminNotification(booking: Booking) {
    await getResend().emails.send({
        from: `Buchungssystem <${fromEmail()}>`,
        to: adminEmail(),
        subject: `Neue Buchung: ${booking.event_title} (${booking.seats} Plätze)`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Neue Buchung eingegangen</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 6px; font-weight: bold;">Veranstaltung</td><td style="padding: 6px;">${booking.event_title}</td></tr>
                    <tr><td style="padding: 6px; font-weight: bold;">Datum</td><td style="padding: 6px;">${booking.event_date}</td></tr>
                    <tr><td style="padding: 6px; font-weight: bold;">Name</td><td style="padding: 6px;">${booking.customer_name}</td></tr>
                    <tr><td style="padding: 6px; font-weight: bold;">E-Mail</td><td style="padding: 6px;">${booking.customer_email}</td></tr>
                    <tr><td style="padding: 6px; font-weight: bold;">Telefon</td><td style="padding: 6px;">${booking.customer_phone ?? '—'}</td></tr>
                    <tr><td style="padding: 6px; font-weight: bold;">Plätze</td><td style="padding: 6px;">${booking.seats}</td></tr>
                    <tr><td style="padding: 6px; font-weight: bold;">Betrag</td><td style="padding: 6px;">${formatPrice(booking.total_price_cents)}</td></tr>
                </table>
            </div>
        `,
    })
}
