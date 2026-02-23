'use client'

import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'

interface AvailableSeatsDisplayProps {
    eventId: string
    maxSeats: number
}

export function AvailableSeatsDisplay({ eventId, maxSeats }: AvailableSeatsDisplayProps) {
    const [available, setAvailable] = useState<number | null>(null)

    useEffect(() => {
        const API = process.env.NEXT_PUBLIC_API_URL || '/api'
        fetch(`${API}/seats.php?event_id=${encodeURIComponent(eventId)}`)
            .then(res => res.json())
            .then(data => setAvailable(data.available ?? 0))
            .catch(() => setAvailable(0))
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
