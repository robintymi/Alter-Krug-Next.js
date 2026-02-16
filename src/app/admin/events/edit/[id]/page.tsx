import { EventForm } from "@/components/admin/EventForm"
import { getEvents } from "@/app/actions/admin-events"
import { notFound } from "next/navigation"

interface EditEventPageProps {
    params: {
        id: string // This is actually the index in our simple array-based system
    }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
    const events = await getEvents()
    const index = parseInt(params.id)

    if (isNaN(index) || index < 0 || index >= events.length) {
        notFound()
    }

    const event = events[index]

    return (
        <div className="max-w-2xl mx-auto py-8">
            <EventForm mode="edit" initialData={event} index={index} />
        </div>
    )
}
