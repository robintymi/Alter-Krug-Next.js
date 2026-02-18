'use client'

import { useEffect, useState } from 'react'
import { getMenuPages, type MenuPageData } from '@/lib/admin-api'
import { MenuCardsEditor } from '@/components/admin/MenuCardsEditor'

export default function AdminMenuCardsPage() {
    const [menuPage, setMenuPage] = useState<MenuPageData | null>(null)
    const [drinksPage, setDrinksPage] = useState<MenuPageData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMenuPages()
            .then(({ menuPage: m, drinksPage: d }) => {
                setMenuPage(m)
                setDrinksPage(d)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading || !menuPage || !drinksPage) {
        return <div className="text-muted-foreground">Laden...</div>
    }

    return <MenuCardsEditor initialMenuPage={menuPage} initialDrinksPage={drinksPage} />
}
