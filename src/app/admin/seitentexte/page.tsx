'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    getHotelPageContent,
    saveHotelPageContent,
    getRestaurantPageContent,
    saveRestaurantPageContent,
} from '@/lib/admin-api'
import type { SiteContent } from '@/data/types'

export default function AdminSeitentextePage() {
    const [loading, setLoading] = useState(true)

    const [hotelPage, setHotelPage] = useState<SiteContent['hotel_page'] | null>(null)
    const [mission, setMission] = useState('')
    const [bookingText, setBookingText] = useState('')
    const [savingHotel, setSavingHotel] = useState(false)
    const [hotelSaved, setHotelSaved] = useState(false)

    const [restaurantPage, setRestaurantPage] = useState<SiteContent['restaurant_page'] | null>(null)
    const [sections, setSections] = useState<{ title: string; content: string }[]>([])
    const [savingRestaurant, setSavingRestaurant] = useState(false)
    const [restaurantSaved, setRestaurantSaved] = useState(false)

    useEffect(() => {
        Promise.all([getHotelPageContent(), getRestaurantPageContent()])
            .then(([hotel, restaurant]) => {
                if (hotel) {
                    setHotelPage(hotel)
                    setMission(hotel.mission || '')
                    setBookingText(hotel.bookingText || '')
                }
                if (restaurant) {
                    setRestaurantPage(restaurant)
                    setSections(restaurant.sections || [])
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    async function handleSaveHotel() {
        if (!hotelPage) return
        setSavingHotel(true)
        setHotelSaved(false)
        try {
            await saveHotelPageContent({ ...hotelPage, mission, bookingText })
            setHotelSaved(true)
        } catch (err) {
            alert('Fehler beim Speichern: ' + (err as Error).message)
        } finally {
            setSavingHotel(false)
        }
    }

    async function handleSaveRestaurant() {
        if (!restaurantPage) return
        setSavingRestaurant(true)
        setRestaurantSaved(false)
        try {
            await saveRestaurantPageContent({ ...restaurantPage, sections })
            setRestaurantSaved(true)
        } catch (err) {
            alert('Fehler beim Speichern: ' + (err as Error).message)
        } finally {
            setSavingRestaurant(false)
        }
    }

    function updateSection(index: number, field: 'title' | 'content', value: string) {
        setSections((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
    }

    if (loading) {
        return <div className="text-muted-foreground">Laden...</div>
    }

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Seitentexte</h1>
                <p className="text-muted-foreground">
                    Die Haupttexte auf Hotel- und Restaurant-Seite. Gut geeignet, um z.B. die Umgebung
                    (Zossen, Königs Wusterhausen, Motzener See) im Fließtext zu erwähnen — hilft dabei,
                    bei Google auch für Suchen aus der Umgebung gefunden zu werden.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hotel-Seite</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="mission">Haupttext (&bdquo;Erholung am Motzener See&ldquo;)</Label>
                        <Textarea id="mission" rows={5} value={mission} onChange={(e) => setMission(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="bookingText">Text unter &bdquo;Ihr Aufenthalt&ldquo;</Label>
                        <Textarea id="bookingText" rows={4} value={bookingText} onChange={(e) => setBookingText(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <span className="text-xs text-green-600">{hotelSaved ? 'Gespeichert ✓' : ''}</span>
                    <Button onClick={handleSaveHotel} disabled={savingHotel || !hotelPage}>
                        {savingHotel ? 'Speichern...' : 'Hotel-Texte speichern'}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Restaurant-Seite</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    {sections.map((section, i) => (
                        <div key={i} className="space-y-2 rounded-lg border p-4">
                            <Label htmlFor={`section-title-${i}`} className="text-xs">Überschrift</Label>
                            <Input
                                id={`section-title-${i}`}
                                value={section.title}
                                onChange={(e) => updateSection(i, 'title', e.target.value)}
                            />
                            <Label htmlFor={`section-content-${i}`} className="text-xs">Text</Label>
                            <Textarea
                                id={`section-content-${i}`}
                                rows={4}
                                value={section.content}
                                onChange={(e) => updateSection(i, 'content', e.target.value)}
                            />
                        </div>
                    ))}
                    {sections.length === 0 && (
                        <p className="text-sm text-muted-foreground">Keine Abschnitte vorhanden.</p>
                    )}
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <span className="text-xs text-green-600">{restaurantSaved ? 'Gespeichert ✓' : ''}</span>
                    <Button onClick={handleSaveRestaurant} disabled={savingRestaurant || !restaurantPage}>
                        {savingRestaurant ? 'Speichern...' : 'Restaurant-Texte speichern'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
