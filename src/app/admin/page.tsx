import { Button } from "@/components/ui/button"
import { getEvents, debugEvents } from "@/app/actions/admin-events"
import Link from "next/link"
import { Plus, Calendar, MapPin, Clock, AlertTriangle } from "lucide-react"
import { DeleteEventButton } from "@/components/admin/DeleteEventButton"

export default async function AdminDashboard() {
  const events = await getEvents();
  const debugInfo = events.length === 0 ? await debugEvents() : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Veranstaltungen</h1>
            <p className="text-muted-foreground">Verwalten Sie hier Ihre Events und Termine.</p>
         </div>
         <Button asChild>
            <Link href="/admin/events/new">
                <Plus className="mr-2 h-4 w-4" /> Neues Event
            </Link>
         </Button>
      </div>

      <div className="grid gap-6">
         {events.length === 0 ? (
             <div className="p-12 border rounded-lg bg-gray-50 text-center text-muted-foreground space-y-4">
                 <p>Keine Veranstaltungen gefunden. Erstellen Sie die erste!</p>
                 
                 {/* DEBUG INFO */}
                 <div className="text-left text-xs font-mono bg-gray-100 p-4 rounded border overflow-auto max-w-full">
                    <p className="font-bold text-red-500 mb-2"><AlertTriangle className="inline w-4 h-4 mr-1"/> Debug Info:</p>
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
             <div className="bg-white rounded-md border shadow-sm divide-y">
                 {events.map((event: any, index: number) => (
                     <div key={index} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                         <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg">{event.title}</h3>
                                {event.id && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">#{event.id}</span>}
                             </div>
                             <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-500">
                                 <span>{event.date}</span>
                                 <span className="hidden sm:inline">•</span>
                                 <span>{event.time}</span>
                                 <span className="hidden sm:inline">•</span>
                                 <span>{event.price}</span>
                             </div>
                         </div>
                         <div className="flex items-center gap-3 shrink-0">
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
