'use client'

import { useEffect, useState } from 'react'
import { getSession } from '@/lib/admin-auth'
import { useRouter, usePathname } from 'next/navigation'

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/'

    const [loading, setLoading] = useState(!isLoginPage)
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        if (isLoginPage) return
        let cancelled = false
        getSession().then((session) => {
            if (cancelled) return
            if (session) {
                setAuthenticated(true)
            } else {
                router.replace('/admin/login')
            }
            setLoading(false)
        })
        return () => { cancelled = true }
    }, [router, isLoginPage])

    if (isLoginPage) return <>{children}</>

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
