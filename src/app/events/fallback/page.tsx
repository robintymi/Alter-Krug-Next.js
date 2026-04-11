import { getSiteContent } from '@/lib/content'
import { EventDetailClient } from '@/components/EventDetailClient'

export default async function EventFallbackPage() {
    const content = await getSiteContent()
    const reservationUrl = content?.header?.reservationUrl ?? '#'
    return <EventDetailClient reservationUrl={reservationUrl} />
}
