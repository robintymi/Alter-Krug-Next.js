import type { Metadata } from 'next'
import { EventDetailClient } from '@/components/EventDetailClient'

export const metadata: Metadata = {
    title: 'Veranstaltung',
    // Diese Seite lädt den Event-Inhalt erst im Browser nach (Platzhalter für
    // neue, noch nicht neu gebaute Events) — Google soll stattdessen die
    // statische Event-Seite unter /events/[slug] indexieren.
    robots: { index: false, follow: false },
}

export default function EventFallbackPage() {
    return <EventDetailClient />
}
