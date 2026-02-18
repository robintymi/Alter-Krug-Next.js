'use client'

import { Button } from "@/components/ui/button"
import { adminLogout } from "@/lib/admin-auth"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { AuthGuard } from "@/components/admin/AuthGuard"

function AdminNav({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    // Login-Seite braucht kein Nav-Layout
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-3xl text-primary font-serif">Admin Dashboard</span>
                        <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div>
                        <span className="text-sm text-muted-foreground hidden md:block">Alter Krug Kallinchen</span>
                        <div className="hidden items-center gap-2 md:flex">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin">Übersicht</Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/events">Events</Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/karten">Speise- & Getränkekarte</Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/buchungen">Buchungen</Link>
                            </Button>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                            await adminLogout()
                            router.push('/admin/login')
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        Abmelden
                    </Button>
                </div>
            </nav>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <AdminNav>{children}</AdminNav>
        </AuthGuard>
    )
}
