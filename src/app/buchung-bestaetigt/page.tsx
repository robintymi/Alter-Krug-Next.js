import { Suspense } from 'react'
import { CheckCircle2 } from 'lucide-react'
import BookingSuccessClient from './BookingSuccessClient'

export default function BookingSuccessPage() {
    return (
        <main className="min-h-screen">
            <div className="site-container flex flex-col items-center justify-center py-24 text-center">
                <div className="max-w-md space-y-6">
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>

                    <h1 className="font-serif text-4xl">Buchung bestätigt!</h1>

                    <p className="text-muted-foreground">
                        Vielen Dank für Ihre Buchung. Sie erhalten in Kürze eine
                        Bestätigungs-E-Mail mit allen Details.
                    </p>

                    <div className="rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-sm text-green-800">
                        Wir freuen uns auf Ihren Besuch beim Alten Krug Kallinchen!
                    </div>

                    <Suspense>
                        <BookingSuccessClient />
                    </Suspense>
                </div>
            </div>
        </main>
    )
}
