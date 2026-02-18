'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { EventForm } from "@/components/admin/EventForm"
import { getEvents } from '@/lib/admin-api'
import type { Event } from '@/data/types'

export default function EditEventPage() {
    const searchParams = useSearchParams()
    const eventId = searchParams.get('id') ?? ''
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!eventId) {
            setLoading(false)
            return
        }
        getEvents().then((events) => {
            const found = events.find((e) => e.id === eventId)
            setEvent(found ?? null)
            setLoading(false)
        })
    }, [eventId])

    if (loading) {
        return <div className="text-muted-foreground py-8 text-center">Laden...</div>
    }

    if (!event) {
        return <div className="text-red-500 py-8 text-center">Event nicht gefunden.</div>
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <EventForm mode="edit" initialData={event} eventId={event.id} />
        </div>
    )
}
