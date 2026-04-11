'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function BookingSuccessClient() {
    const params = useSearchParams()
    const eventId = params.get('event_id')

    const backHref = eventId
        ? `/events/fallback?id=${encodeURIComponent(eventId)}`
        : '/events'

    return (
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
            {eventId && (
                <Link
                    href={backHref}
                    className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-primary/10 px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                    Zurück zur Veranstaltung
                </Link>
            )}
            <Link
                href="/events"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] hover:bg-primary/90"
            >
                Alle Veranstaltungen
            </Link>
        </div>
    )
}
