import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookingSuccessPage({ params }: PageProps) {
  const { slug } = await params;

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

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
            <Link
              href={`/events/${slug}`}
              className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-primary/10 px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Zurück zur Veranstaltung
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] hover:bg-primary/90"
            >
              Alle Veranstaltungen
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
