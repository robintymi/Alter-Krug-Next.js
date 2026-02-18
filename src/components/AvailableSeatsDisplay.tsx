'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-browser'
import { Users } from 'lucide-react'

interface AvailableSeatsDisplayProps {
    eventId: string
    maxSeats: number
}

export function AvailableSeatsDisplay({ eventId, maxSeats }: AvailableSeatsDisplayProps) {
    const [available, setAvailable] = useState<number | null>(null)

    useEffect(() => {
        supabase
            .from('bookings')
            .select('seats')
            .eq('event_id', eventId)
            .in('status', ['pending', 'confirmed'])
            .then(({ data }) => {
                const booked = (data ?? []).reduce((sum: number, b: { seats: number }) => sum + b.seats, 0)
                setAvailable(Math.max(0, maxSeats - booked))
            })
    }, [eventId, maxSeats])

    if (available === null) {
        return (
            <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Laden...
            </span>
        )
    }

    return (
        <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            {available > 0
                ? `${available} von ${maxSeats} Plätzen frei`
                : 'Ausgebucht'}
        </span>
    )
}
