import { EventForm } from "@/components/admin/EventForm"

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <EventForm mode="create" />
    </div>
  )
}
