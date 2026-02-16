import Link from 'next/link'
import { AlertTriangle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getEvents, debugEvents } from '@/app/actions/admin-events'
import { DeleteEventButton } from '@/components/admin/DeleteEventButton'
import { Event } from '@/data/types'

export default async function AdminEventsPage() {
    const events = await getEvents()
    const debugInfo = events.length === 0 ? await debugEvents() : null

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Veranstaltungen</h1>
                    <p className="text-muted-foreground">Verwalten Sie hier Ihre Events und Termine.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/events/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Neues Event
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6">
                {events.length === 0 ? (
                    <div className="space-y-4 rounded-lg border bg-gray-50 p-12 text-center text-muted-foreground">
                        <p>Keine Veranstaltungen gefunden. Erstellen Sie die erste.</p>

                        <div className="max-w-full overflow-auto rounded border bg-gray-100 p-4 text-left font-mono text-xs">
                            <p className="mb-2 font-bold text-red-500">
                                <AlertTriangle className="mr-1 inline h-4 w-4" />
                                Debug Info:
                            </p>
                            <p>Current Working Directory: {debugInfo?.cwd}</p>
                            <p>Data File Path: {debugInfo?.path}</p>
                            <p>File Exists: {debugInfo?.exists ? 'Yes' : 'No'}</p>
                            {debugInfo?.error && <p className="text-red-600">Error: {debugInfo.error}</p>}
                            {debugInfo?.snippet && (
                                <div className="mt-2 text-gray-600">
                                    <strong>Content Preview:</strong>
                                    <pre className="whitespace-pre-wrap break-all">{debugInfo.snippet}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="divide-y rounded-md border bg-white shadow-sm">
                        {events.map((event: Event, index: number) => (
                            <div
                                key={index}
                                className="flex flex-col justify-between gap-4 p-6 transition-colors hover:bg-gray-50 md:flex-row md:items-center"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold">{event.title}</h3>
                                        {event.id && <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">#{event.id}</span>}
                                    </div>
                                    <div className="flex flex-col text-sm text-gray-500 sm:flex-row sm:gap-4">
                                        <span>{event.date}</span>
                                        <span className="hidden sm:inline">|</span>
                                        <span>{event.time}</span>
                                        <span className="hidden sm:inline">|</span>
                                        <span>{event.price}</span>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-3">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/events/edit/${index}`}>Bearbeiten</Link>
                                    </Button>
                                    <DeleteEventButton index={index} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
