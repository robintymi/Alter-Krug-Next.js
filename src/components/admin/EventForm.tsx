'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { addEvent, updateEvent } from '@/lib/admin-api'
import { Event } from '@/data/types'

interface EventFormProps {
    mode: 'create' | 'edit'
    initialData?: Partial<Event>
    eventId?: string
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export function EventForm({ mode, initialData, eventId }: EventFormProps) {
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSaving(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        const eventData: Partial<Event> = {
            title: formData.get('title') as string,
            date: formData.get('date') as string,
            time: (formData.get('time') as string) || '',
            price: (formData.get('price') as string) || '',
            description: (formData.get('description') as string) || '',
            image: (formData.get('image') as string) || '',
        }

        const maxSeatsRaw = formData.get('maxSeats') as string
        const priceInCentsRaw = formData.get('priceInCents') as string
        if (maxSeatsRaw) eventData.maxSeats = parseInt(maxSeatsRaw, 10)
        if (priceInCentsRaw) eventData.priceInCents = Math.round(parseFloat(priceInCentsRaw) * 100)

        try {
            if (mode === 'create') {
                const id = slugify(eventData.title || 'event')
                await addEvent({ ...eventData, id } as Event & { id: string })
            } else if (eventId) {
                await updateEvent(eventId, eventData)
            }
            router.push('/admin/events')
        } catch (err) {
            alert('Fehler beim Speichern: ' + (err as Error).message)
            setSaving(false)
        }
    }

    return (
        <Card className="mx-auto max-w-2xl">
            <CardHeader>
                <CardTitle>{mode === 'create' ? 'Neues Event erstellen' : 'Event bearbeiten'}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Titel *</Label>
                            <Input id="title" name="title" required defaultValue={initialData?.title} placeholder="z.B. Yoga im Krug" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Datum *</Label>
                            <Input id="date" name="date" required defaultValue={initialData?.date} placeholder="z.B. 24.04.2026" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="time">Uhrzeit</Label>
                            <Input id="time" name="time" defaultValue={initialData?.time} placeholder="z.B. 18:00" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Preis (Anzeigetext)</Label>
                            <Input id="price" name="price" defaultValue={initialData?.price} placeholder="z.B. 15,00 EUR" />
                        </div>
                    </div>

                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-4">
                        <p className="text-sm font-semibold text-amber-900">Online-Buchung (optional)</p>
                        <p className="text-xs text-amber-700">Wenn beide Felder ausgefüllt sind, können Kunden online buchen und per Karte bezahlen.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="maxSeats">Max. Plätze</Label>
                                <Input
                                    id="maxSeats"
                                    name="maxSeats"
                                    type="number"
                                    min="1"
                                    defaultValue={initialData?.maxSeats ?? ''}
                                    placeholder="z.B. 30"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priceInCents">Preis pro Platz (EUR)</Label>
                                <Input
                                    id="priceInCents"
                                    name="priceInCents"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    defaultValue={initialData?.priceInCents ? (initialData.priceInCents / 100).toFixed(2) : ''}
                                    placeholder="z.B. 15.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Bild-Pfad (optional)</Label>
                        <Input id="image" name="image" defaultValue={initialData?.image} placeholder="/img/events/beispiel.jpg" />
                        <p className="text-xs text-muted-foreground">Geben Sie den Pfad zu einem Bild im public-Ordner an.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Beschreibung</Label>
                        <Textarea id="description" name="description" rows={5} defaultValue={initialData?.description} placeholder="Beschreibung des Events..." />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" asChild>
                        <Link href="/admin/events">Abbrechen</Link>
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Speichern...' : 'Speichern'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
