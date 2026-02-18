'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BookingFormProps {
    eventId: string
    eventTitle: string
    priceInCents: number
    maxSeats: number
}

export function BookingForm({ eventId, eventTitle, priceInCents, maxSeats }: BookingFormProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [seats, setSeats] = useState(1)
    const [availableSeats, setAvailableSeats] = useState<number | null>(null)

    const priceFormatted = (priceInCents / 100).toFixed(2).replace('.', ',') + ' €'
    const totalFormatted = ((priceInCents * seats) / 100).toFixed(2).replace('.', ',') + ' €'

    // Verfügbare Plätze client-side laden
    useEffect(() => {
        supabase
            .from('bookings')
            .select('seats')
            .eq('event_id', eventId)
            .in('status', ['pending', 'confirmed'])
            .then(({ data }) => {
                const booked = (data ?? []).reduce((sum: number, b: { seats: number }) => sum + b.seats, 0)
                setAvailableSeats(Math.max(0, maxSeats - booked))
            })
    }, [eventId, maxSeats])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const form = e.currentTarget
        const formData = new FormData(form)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-checkout-session`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                        eventId,
                        customerName: formData.get('name') as string,
                        customerEmail: formData.get('email') as string,
                        customerPhone: (formData.get('phone') as string) || undefined,
                        seats,
                    }),
                }
            )

            const result = await response.json()

            if (result.error) {
                setError(result.error)
                setLoading(false)
                return
            }

            if (result.url) {
                window.location.href = result.url
            }
        } catch {
            setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.')
            setLoading(false)
        }
    }

    if (availableSeats === null) {
        return (
            <div className="text-sm text-muted-foreground">Verfügbarkeit wird geladen...</div>
        )
    }

    if (availableSeats === 0) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-700">
                Diese Veranstaltung ist ausgebucht.
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {!open ? (
                <button
                    onClick={() => setOpen(true)}
                    className="w-full rounded-xl bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] hover:bg-primary/90"
                >
                    Jetzt buchen — {priceFormatted} / Person
                </button>
            ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Platz reservieren: {eventTitle}</h3>
                        <button
                            onClick={() => { setOpen(false); setError('') }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Schließen
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="booking-name" className="text-xs">Name *</Label>
                                <Input id="booking-name" name="name" required placeholder="Max Mustermann" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="booking-email" className="text-xs">E-Mail *</Label>
                                <Input id="booking-email" name="email" type="email" required placeholder="max@beispiel.de" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="booking-phone" className="text-xs">Telefon (optional)</Label>
                                <Input id="booking-phone" name="phone" type="tel" placeholder="0171 1234567" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="booking-seats" className="text-xs">
                                    Anzahl Plätze (max. {availableSeats})
                                </Label>
                                <Input
                                    id="booking-seats"
                                    name="seats"
                                    type="number"
                                    min={1}
                                    max={availableSeats}
                                    value={seats}
                                    onChange={(e) => setSeats(Math.max(1, Math.min(availableSeats, parseInt(e.target.value) || 1)))}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                                {error}
                            </p>
                        )}

                        <div className="flex items-center justify-between border-t pt-3">
                            <span className="text-sm text-muted-foreground">
                                {seats} × {priceFormatted} = <strong className="text-foreground">{totalFormatted}</strong>
                            </span>
                            <Button type="submit" disabled={loading} size="sm">
                                {loading ? 'Weiterleitung...' : 'Weiter zur Kasse'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
