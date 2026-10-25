'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    getAnnouncement,
    saveAnnouncement,
    getFooterContent,
    saveFooterContent,
} from '@/lib/admin-api'
import type { SiteContent } from '@/data/types'

export default function AdminHinweisePage() {
    const [loading, setLoading] = useState(true)

    // Ankündigungs-Banner (Startseite)
    const [bannerActive, setBannerActive] = useState(false)
    const [bannerMessage, setBannerMessage] = useState('')
    const [savingBanner, setSavingBanner] = useState(false)
    const [bannerSaved, setBannerSaved] = useState(false)

    // Öffnungszeiten (Footer)
    const [footer, setFooter] = useState<SiteContent['footer'] | null>(null)
    const [hoursTitle, setHoursTitle] = useState('')
    const [hoursLines, setHoursLines] = useState<string[]>([])
    const [savingHours, setSavingHours] = useState(false)
    const [hoursSaved, setHoursSaved] = useState(false)

    useEffect(() => {
        Promise.all([getAnnouncement(), getFooterContent()])
            .then(([announcement, footerData]) => {
                setBannerActive(announcement.active)
                setBannerMessage(announcement.message)
                if (footerData) {
                    setFooter(footerData)
                    setHoursTitle(footerData.openingHours.title)
                    setHoursLines(footerData.openingHours.lines)
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    async function handleSaveBanner() {
        setSavingBanner(true)
        setBannerSaved(false)
        try {
            await saveAnnouncement({ active: bannerActive, message: bannerMessage })
            setBannerSaved(true)
        } catch (err) {
            alert('Fehler beim Speichern: ' + (err as Error).message)
        } finally {
            setSavingBanner(false)
        }
    }

    async function handleSaveHours() {
        if (!footer) return
        setSavingHours(true)
        setHoursSaved(false)
        try {
            await saveFooterContent({
                ...footer,
                openingHours: { title: hoursTitle, lines: hoursLines.filter((l) => l.trim() !== '') },
            })
            setHoursSaved(true)
        } catch (err) {
            alert('Fehler beim Speichern: ' + (err as Error).message)
        } finally {
            setSavingHours(false)
        }
    }

    function updateLine(index: number, value: string) {
        setHoursLines((lines) => lines.map((l, i) => (i === index ? value : l)))
    }

    function removeLine(index: number) {
        setHoursLines((lines) => lines.filter((_, i) => i !== index))
    }

    if (loading) {
        return <div className="text-muted-foreground">Laden...</div>
    }

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hinweise & Öffnungszeiten</h1>
                <p className="text-muted-foreground">Änderungen sind sofort auf der Website sichtbar — kein Hochladen nötig.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ankündigungs-Banner (Startseite)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Erscheint ganz oben auf der Startseite, z.B. für kurzfristige Hinweise wie
                        &bdquo;Achtung liebe Gäste, morgen geschlossene Veranstaltung&ldquo; oder Betriebsferien.
                    </p>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={bannerActive}
                            onChange={(e) => setBannerActive(e.target.checked)}
                            className="accent-primary"
                        />
                        Banner auf der Startseite anzeigen
                    </label>
                    <div className="space-y-1.5">
                        <Label htmlFor="banner-message">Text</Label>
                        <Textarea
                            id="banner-message"
                            rows={3}
                            value={bannerMessage}
                            onChange={(e) => setBannerMessage(e.target.value)}
                            placeholder="z.B. Achtung liebe Gäste: Vom 31.12.2026 bis 08.01.2027 bleibt unser Restaurant wegen Betriebsferien geschlossen..."
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <span className="text-xs text-green-600">{bannerSaved ? 'Gespeichert ✓' : ''}</span>
                    <Button onClick={handleSaveBanner} disabled={savingBanner}>
                        {savingBanner ? 'Speichern...' : 'Banner speichern'}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Öffnungszeiten (im Footer auf jeder Seite)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="hours-title">Überschrift</Label>
                        <Input id="hours-title" value={hoursTitle} onChange={(e) => setHoursTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Zeilen</Label>
                        {hoursLines.map((line, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Input value={line} onChange={(e) => updateLine(i, e.target.value)} />
                                <button
                                    type="button"
                                    onClick={() => removeLine(i)}
                                    className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                                >
                                    Entfernen
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setHoursLines((lines) => [...lines, ''])}
                            className="rounded-md border border-dashed px-3 py-1.5 text-xs text-muted-foreground hover:border-amber-300 hover:bg-amber-50"
                        >
                            + Zeile hinzufügen
                        </button>
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <span className="text-xs text-green-600">{hoursSaved ? 'Gespeichert ✓' : ''}</span>
                    <Button onClick={handleSaveHours} disabled={savingHours || !footer}>
                        {savingHours ? 'Speichern...' : 'Öffnungszeiten speichern'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
