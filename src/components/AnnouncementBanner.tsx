'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || '/api'
const DISMISS_KEY = 'announcement_dismissed'

interface Announcement {
    active: boolean
    message: string
}

/**
 * Hinweis-Banner für die Startseite. Wird live vom Server geladen, damit
 * Betreiber ihn im Admin-Bereich ändern können, ohne dass die Website neu
 * gebaut/hochgeladen werden muss.
 */
export function AnnouncementBanner() {
    const [content, setContent] = useState<Announcement | null>(null)
    const [dismissed, setDismissed] = useState(true) // erst nach dem Laden ggf. einblenden, kein Flackern

    useEffect(() => {
        fetch(`${API}/content.php?key=announcement`, { cache: 'no-store' })
            .then(res => (res.ok ? res.json() : null))
            .then((data: Announcement | null) => {
                setContent(data)
                try {
                    setDismissed(!!data?.message && sessionStorage.getItem(DISMISS_KEY) === data.message)
                } catch {
                    setDismissed(false)
                }
            })
            .catch(() => setContent(null))
    }, [])

    if (!content?.active || !content.message.trim() || dismissed) return null

    function handleDismiss() {
        try {
            sessionStorage.setItem(DISMISS_KEY, content!.message)
        } catch {
            // ignorieren (z.B. privater Modus)
        }
        setDismissed(true)
    }

    return (
        <div className="site-container pt-4 md:pt-6">
            <div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-primary/15 bg-[#fbf3e7]/95 py-4 pl-6 pr-11 shadow-[0_15px_45px_-28px_rgba(35,25,10,0.5)] backdrop-blur sm:flex-row sm:items-center sm:gap-5">
                <div className="absolute inset-y-0 left-0 w-1.5 bg-primary" />
                <p className="shrink-0 font-script text-3xl leading-none text-primary">Hinweis</p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90 md:text-[15px]">
                    {content.message}
                </p>
                <button
                    onClick={handleDismiss}
                    aria-label="Hinweis schließen"
                    className="absolute right-3 top-3 rounded-full p-1.5 text-foreground/40 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
