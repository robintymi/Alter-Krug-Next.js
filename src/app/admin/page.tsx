'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, ChefHat, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getEvents, getMenuPages, getBookings } from '@/lib/admin-api'

export default function AdminDashboardPage() {
    const [eventsCount, setEventsCount] = useState(0)
    const [menuCount, setMenuCount] = useState(0)
    const [drinksCount, setDrinksCount] = useState(0)
    const [bookingsCount, setBookingsCount] = useState(0)
    const [confirmedCount, setConfirmedCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getEvents(), getMenuPages(), getBookings()])
            .then(([events, pages, bookings]) => {
                setEventsCount(events.length)
                setMenuCount(pages.menuPage.categories.length)
                setDrinksCount(pages.drinksPage.categories.length)
                setBookingsCount(bookings.length)
                setConfirmedCount(bookings.filter((b) => b.status === 'confirmed').length)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="text-muted-foreground">Laden...</div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Verwalten Sie Veranstaltungen, Buchungen sowie Speise- und Getränkekarte.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <section className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Veranstaltungen</p>
                            <h2 className="mt-1 text-2xl font-bold">{eventsCount} Einträge</h2>
                        </div>
                        <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <Button asChild className="w-full">
                        <Link href="/admin/events">Events verwalten</Link>
                    </Button>
                </section>

                <section className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Buchungen</p>
                            <h2 className="mt-1 text-2xl font-bold">{bookingsCount} gesamt</h2>
                            <p className="mt-1 text-xs text-muted-foreground">{confirmedCount} bestätigt</p>
                        </div>
                        <Ticket className="h-6 w-6 text-primary" />
                    </div>
                    <Button asChild className="w-full">
                        <Link href="/admin/buchungen">Buchungen ansehen</Link>
                    </Button>
                </section>

                <section className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Karten</p>
                            <h2 className="mt-1 text-2xl font-bold">{menuCount + drinksCount} Sektionen</h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Speisen: {menuCount} · Getränke: {drinksCount}
                            </p>
                        </div>
                        <ChefHat className="h-6 w-6 text-primary" />
                    </div>
                    <Button asChild className="w-full">
                        <Link href="/admin/karten">Speise- & Getränkekarte verwalten</Link>
                    </Button>
                </section>
            </div>
        </div>
    )
}
