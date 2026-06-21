'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getEvents, deleteEvent } from '@/lib/admin-api'
import type { Event } from '@/data/types'

function isEventPast(event: Event): boolean {
    if (event.recurring) return false
    const parts = event.date.split('.')
    if (parts.length < 3) return false
    const d = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const y = parseInt(parts[2], 10)
    if (isNaN(d) || isNaN(m) || isNaN(y)) return false
    const date = new Date(y, m, d)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    async function loadEvents() {
        try {
            const data = await getEvents()
            setEvents(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadEvents() }, [])

    async function handleDelete(id: string) {
        if (!confirm('Möchten Sie dieses Event wirklich löschen?')) return
        try {
            await deleteEvent(id)
            setEvents((prev) => prev.filter((e) => e.id !== id))
        } catch (err) {
            alert('Fehler beim Löschen: ' + (err as Error).message)
        }
    }

    if (loading) {
        return <div className="text-muted-foreground">Laden...</div>
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Veranstaltungen</h1>
                    <p className="text-muted-foreground">Verwalten Sie hier Ihre Events und Termine.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/events/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Neues Event
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6">
                {events.length === 0 ? (
                    <div className="rounded-lg border bg-gray-50 p-12 text-center text-muted-foreground">
                        <p>Keine Veranstaltungen gefunden. Erstellen Sie die erste.</p>
                    </div>
                ) : (
                    <div className="divide-y rounded-md border bg-white shadow-sm">
                        {events.map((event) => {
                            const past = isEventPast(event)
                            return (
                            <div
                                key={event.id}
                                className={`flex flex-col justify-between gap-4 p-6 transition-colors hover:bg-gray-50 md:flex-row md:items-center ${past ? 'opacity-50' : ''}`}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold">{event.title}</h3>
                                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">#{event.id}</span>
                                        {past && (
                                            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">Vergangen</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col text-sm text-gray-500 sm:flex-row sm:gap-4">
                                        <span>{event.date}</span>
                                        <span className="hidden sm:inline">|</span>
                                        <span>{event.time}</span>
                                        <span className="hidden sm:inline">|</span>
                                        <span>{event.price}</span>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-3">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/events/edit?id=${event.id}`}>Bearbeiten</Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(event.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Löschen</span>
                                    </Button>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
