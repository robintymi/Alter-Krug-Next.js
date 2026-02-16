import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <span className="font-bold text-3xl text-primary font-serif">Admin Dashboard</span>
               <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div>
               <span className="text-sm text-muted-foreground hidden md:block">Alter Krug Kallinchen</span>
            </div>
            
            <form action={logout}>
                <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    Abmelden
                </Button>
            </form>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
