'use client'

import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || '/api'

interface OpeningHoursProps {
    initial: { title: string; lines: string[] }
}

/**
 * Öffnungszeiten im Footer. Startet mit dem beim Build eingebetteten Stand
 * und lädt danach live nach, damit Änderungen aus dem Admin-Bereich sofort
 * sichtbar sind, ohne dass die Website neu gebaut werden muss.
 */
export function OpeningHours({ initial }: OpeningHoursProps) {
    const [hours, setHours] = useState(initial)

    useEffect(() => {
        fetch(`${API}/content.php?key=footer`, { cache: 'no-store' })
            .then(res => (res.ok ? res.json() : null))
            .then(data => {
                if (data?.openingHours?.lines) setHours(data.openingHours)
            })
            .catch(() => {})
    }, [])

    return (
        <>
            <h3 className="mt-3 font-script text-5xl leading-none">{hours.title}</h3>
            <ul className="mt-4 space-y-1 text-sm text-white/80">
                {hours.lines.map((line, i) => (
                    <li key={line + i}>{line}</li>
                ))}
            </ul>
        </>
    )
}
