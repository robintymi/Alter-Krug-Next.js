'use client'

import { useEffect, useState } from 'react'
import { getSession } from '@/lib/admin-auth'
import { useRouter } from 'next/navigation'

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        getSession().then((session) => {
            if (session) {
                setAuthenticated(true)
            } else {
                router.replace('/admin/login')
            }
            setLoading(false)
        })
    }, [router])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-muted-foreground">Laden...</div>
            </div>
        )
    }

    if (!authenticated) return null
    return <>{children}</>
}
