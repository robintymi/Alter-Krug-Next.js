'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || '/api'

/**
 * Hinweis-Banner für die Startseite. Wird live vom Server geladen, damit
 * Betreiber ihn im Admin-Bereich ändern können, ohne dass die Website neu
 * gebaut/hochgeladen werden muss.
 */
export function AnnouncementBanner() {
    const [content, setContent] = useState<{ active: boolean; message: string } | null>(null)

    useEffect(() => {
        fetch(`${API}/content.php?key=announcement`, { cache: 'no-store' })
            .then(res => (res.ok ? res.json() : null))
            .then(data => setContent(data))
            .catch(() => setContent(null))
    }, [])

    if (!content?.active || !content.message.trim()) return null

    return (
        <div className="border-b border-amber-200 bg-amber-50">
            <div className="site-container flex items-center gap-3 py-3 text-sm text-amber-900">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                <p className="whitespace-pre-line leading-relaxed">{content.message}</p>
            </div>
        </div>
    )
}
