import Link from 'next/link'
import { CalendarDays, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getEvents } from '@/app/actions/admin-events'
import { getMenuAndDrinksPages } from '@/app/actions/admin-menu'

export default async function AdminDashboardPage() {
    const [events, pages] = await Promise.all([getEvents(), getMenuAndDrinksPages()])
    const menuCategoryCount = pages.menuPage.categories.length
    const drinksCategoryCount = pages.drinksPage.categories.length

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Verwalten Sie Veranstaltungen sowie Speise- und Getränkekarte.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <section className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Veranstaltungen</p>
                            <h2 className="mt-1 text-2xl font-bold">{events.length} Einträge</h2>
                        </div>
                        <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <Button asChild className="w-full">
                        <Link href="/admin/events">Events verwalten</Link>
                    </Button>
                </section>

                <section className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Karten</p>
                            <h2 className="mt-1 text-2xl font-bold">{menuCategoryCount + drinksCategoryCount} Sektionen</h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Speisen: {menuCategoryCount} · Getränke: {drinksCategoryCount}
                            </p>
                        </div>
                        <ChefHat className="h-6 w-6 text-primary" />
                    </div>
                    <Button asChild className="w-full">
                        <Link href="/admin/karten">Speise- & Getränkekarte verwalten</Link>
                    </Button>
                </section>
            </div>
        </div>
    )
}
