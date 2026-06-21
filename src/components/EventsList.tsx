'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { Event } from '@/data/types'
import { getOptimizedImageSrc } from '@/lib/site-image'

const API = process.env.NEXT_PUBLIC_API_URL || '/api'

function parseGermanDate(dateStr: string): Date | null {
    const parts = dateStr.split('.')
    if (parts.length < 3) return null
    const d = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const y = parseInt(parts[2], 10)
    if (isNaN(d) || isNaN(m) || isNaN(y)) return null
    return new Date(y, m, d)
}

function isEventPast(event: Event): boolean {
    if (event.recurring) return false
    const date = parseGermanDate(event.date)
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
}

function getImageUrl(path: string): string {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
    if (siteUrl) return siteUrl + path
    return path
}

export function EventsList({ fallbackEvents }: { fallbackEvents: Event[] }) {
    const [events, setEvents] = useState<Event[]>(fallbackEvents)

    // IDs der statisch gebauten Events (für die existiert eine eigene Seite)
    const staticIds = useMemo(
        () => new Set(fallbackEvents.map((e) => e.id)),
        [fallbackEvents]
    )

    useEffect(() => {
        async function loadEvents() {
            try {
                const res = await fetch(`${API}/events.php`)
                if (!res.ok) return
                const data = await res.json()

                const mapped: Event[] = (data ?? []).map((row: Record<string, unknown>) => ({
                    id: row.id as string,
                    title: row.title as string,
                    date: row.date as string,
                    time: (row.time as string) || '',
                    price: (row.price as string) || '',
                    description: (row.description as string) || '',
                    image: (row.image as string) || '',
                    galleryImage: (row.gallery_image as string) || '',
                    recurring: row.recurring === 1 || row.recurring === true || row.recurring === '1',
                    maxSeats: row.max_seats ? Number(row.max_seats) : undefined,
                    priceInCents: row.price_in_cents ? Number(row.price_in_cents) : undefined,
                }))

                if (mapped.length > 0) {
                    setEvents(mapped)
                }
            } catch {
                // Fallback-Events bleiben
            }
        }

        loadEvents()
    }, [])

    const visibleEvents = events.filter((e) => !isEventPast(e))

    if (visibleEvents.length === 0) {
        return (
            <div className="site-container py-12 text-center text-muted-foreground">
                <p>Aktuell sind keine Veranstaltungen geplant.</p>
            </div>
        )
    }

    return (
        <div className="site-container grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleEvents.map((event: Event) => {
                // Statisch gebaute Events → direkte URL, dynamische → Fallback-Seite
                const href = staticIds.has(event.id)
                    ? `/events/${event.id}`
                    : `/events/fallback?id=${encodeURIComponent(event.id)}`

                return (
                    <Link
                        key={event.id}
                        href={href}
                        prefetch={false}
                        className="group overflow-hidden rounded-3xl border border-white/60 bg-white/78 shadow-[0_18px_42px_-34px_rgba(18,10,4,0.6)] transition-all hover:-translate-y-1"
                    >
                        <div className="relative aspect-[16/10] bg-gray-100">
                            {event.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={getImageUrl(getOptimizedImageSrc(event.image))}
                                    alt={event.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-muted" />
                            )}
                            {event.recurring && (
                                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                                    Wöchentlich
                                </span>
                            )}
                        </div>

                        <div className="p-5 md:p-6">
                            <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-primary" />
                                    {event.date}
                                </span>
                                {event.time && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-primary" />
                                        {event.time}
                                    </span>
                                )}
                            </div>
                            <h2 className="font-serif text-3xl transition-colors group-hover:text-primary">{event.title}</h2>
                            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{event.description}</p>
                            <div className="mt-5 flex items-center justify-between border-t border-primary/10 pt-4 text-sm">
                                <span className="font-semibold text-primary">{event.price}</span>
                                <span className="font-medium text-foreground/70">Mehr erfahren</span>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
