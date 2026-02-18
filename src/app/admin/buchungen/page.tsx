'use client'

import { useEffect, useState } from 'react'
import { getBookings, getEvents, type Booking } from '@/lib/admin-api'
import type { Event } from '@/data/types'

const STATUS_LABELS: Record<Booking['status'], { label: string; class: string }> = {
    confirmed: { label: 'Bestätigt', class: 'bg-green-100 text-green-800' },
    pending: { label: 'Ausstehend', class: 'bg-yellow-100 text-yellow-800' },
    cancelled: { label: 'Storniert', class: 'bg-red-100 text-red-700' },
}

function formatPrice(cents: number) {
    return (cents / 100).toFixed(2).replace('.', ',') + ' €'
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getBookings(), getEvents()])
            .then(([b, e]) => { setBookings(b); setEvents(e) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="text-muted-foreground">Laden...</div>
    }

    const bookableEvents = events.filter((e) => e.maxSeats && e.priceInCents)

    const statsPerEvent = bookableEvents.map((event) => {
        const eventBookings = bookings.filter(
            (b) => b.event_id === event.id && (b.status === 'confirmed' || b.status === 'pending')
        )
        const bookedSeats = eventBookings.reduce((sum, b) => sum + b.seats, 0)
        const revenue = bookings
            .filter((b) => b.event_id === event.id && b.status === 'confirmed')
            .reduce((sum, b) => sum + b.total_price_cents, 0)

        return {
            event,
            bookedSeats,
            availableSeats: (event.maxSeats ?? 0) - bookedSeats,
            revenue,
            bookingCount: eventBookings.length,
        }
    })

    const totalRevenue = bookings
        .filter((b) => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.total_price_cents, 0)

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Buchungen</h1>
                <p className="text-sm text-muted-foreground">
                    Alle Buchungen für Veranstaltungen mit Online-Buchung.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Buchungen gesamt</p>
                    <p className="mt-1 text-3xl font-bold">{bookings.length}</p>
                </div>
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Bestätigt</p>
                    <p className="mt-1 text-3xl font-bold text-green-700">
                        {bookings.filter((b) => b.status === 'confirmed').length}
                    </p>
                </div>
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Umsatz (bestätigt)</p>
                    <p className="mt-1 text-3xl font-bold text-primary">{formatPrice(totalRevenue)}</p>
                </div>
            </div>

            {statsPerEvent.length > 0 && (
                <section className="space-y-3 rounded-xl border bg-white p-5 shadow-sm">
                    <h2 className="font-semibold">Auslastung pro Veranstaltung</h2>
                    <div className="divide-y">
                        {statsPerEvent.map(({ event, bookedSeats, availableSeats, revenue, bookingCount }) => (
                            <div key={event.id} className="flex flex-wrap items-center gap-4 py-3">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{event.title}</p>
                                    <p className="text-xs text-muted-foreground">{event.date}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{
                                                width: `${Math.min(100, (bookedSeats / (event.maxSeats ?? 1)) * 100)}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {bookedSeats}/{event.maxSeats} Plätze
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {bookingCount} Buchungen · {formatPrice(revenue)}
                                </span>
                                {availableSeats === 0 && (
                                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                                        Ausgebucht
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="p-5 border-b">
                    <h2 className="font-semibold">Alle Buchungen</h2>
                </div>

                {bookings.length === 0 ? (
                    <div className="p-10 text-center text-sm text-muted-foreground">
                        Noch keine Buchungen vorhanden.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left">Kunde</th>
                                    <th className="px-4 py-3 text-left">Veranstaltung</th>
                                    <th className="px-4 py-3 text-center">Plätze</th>
                                    <th className="px-4 py-3 text-right">Betrag</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-left">Datum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {bookings.map((booking) => {
                                    const statusInfo = STATUS_LABELS[booking.status]
                                    return (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{booking.customer_name}</p>
                                                <p className="text-xs text-muted-foreground">{booking.customer_email}</p>
                                                {booking.customer_phone && (
                                                    <p className="text-xs text-muted-foreground">{booking.customer_phone}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{booking.event_title}</p>
                                                <p className="text-xs text-muted-foreground">{booking.event_date}</p>
                                            </td>
                                            <td className="px-4 py-3 text-center font-medium">{booking.seats}</td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                {formatPrice(booking.total_price_cents)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.class}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                                                {formatDate(booking.created_at)}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    )
}
