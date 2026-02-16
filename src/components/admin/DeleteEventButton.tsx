'use client'

import { Button } from "@/components/ui/button"
import { deleteEvent } from "@/app/actions/admin-events"
import { Trash2 } from "lucide-react"

interface DeleteEventButtonProps {
    index: number
}

export function DeleteEventButton({ index }: DeleteEventButtonProps) {
    return (
        <form
            action={async () => {
                if (confirm('Möchten Sie dieses Event wirklich löschen?')) {
                     await deleteEvent(index)
                }
            }}
            className="inline-block"
        >
            <Button variant="destructive" size="sm" type="submit">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Löschen</span>
            </Button>
        </form>
    )
}
