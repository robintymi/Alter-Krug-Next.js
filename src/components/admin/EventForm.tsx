'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { addEvent, updateEvent } from '@/app/actions/admin-events'
import { Event } from '@/data/types'

interface EventFormProps {
    mode: 'create' | 'edit'
    initialData?: Partial<Event>
    index?: number
}

export function EventForm({ mode, initialData, index }: EventFormProps) {
    const action = mode === 'create' ? addEvent : updateEvent.bind(null, index as number)

    return (
        <Card className="mx-auto max-w-2xl">
            <CardHeader>
                <CardTitle>{mode === 'create' ? 'Neues Event erstellen' : 'Event bearbeiten'}</CardTitle>
            </CardHeader>
            <form
                action={async (formData) => {
                    const result = await action(formData)
                    if (result?.success) {
                        window.location.href = '/admin/events'
                    } else {
                        alert(result?.error || 'Fehler beim Speichern')
                    }
                }}
            >
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
                            <Label htmlFor="price">Preis</Label>
                            <Input id="price" name="price" defaultValue={initialData?.price} placeholder="z.B. 15,00 EUR" />
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
                    <Button type="submit">Speichern</Button>
                </CardFooter>
            </form>
        </Card>
    )
}
