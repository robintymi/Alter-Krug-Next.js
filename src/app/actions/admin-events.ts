'use server'

import fs from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { Event } from '@/data/types'

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'site-content.json')

interface SiteContentWithEvents {
    events_page?: {
        events?: Event[]
    }
}

function toSiteContentWithEvents(value: unknown): SiteContentWithEvents {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return {}
    }

    return value as SiteContentWithEvents
}

export async function getEvents(): Promise<Event[]> {
    try {
        const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
        const data = toSiteContentWithEvents(JSON.parse(fileContent))
        return Array.isArray(data.events_page?.events) ? data.events_page.events : []
    } catch (error) {
        console.error('Error reading events:', error)
        return []
    }
}

export async function saveEvents(events: Event[]) {
    try {
        const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
        const parsed = JSON.parse(fileContent)
        const root =
            typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
                ? (parsed as Record<string, unknown>)
                : {}
        const data = toSiteContentWithEvents(root)

        if (!data.events_page) {
            data.events_page = {}
        }

        data.events_page.events = events

        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(root, null, 2), 'utf-8')
        revalidatePath('/admin')
        revalidatePath('/admin/events')
        revalidatePath('/events')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error saving events:', error)
        return { error: 'Failed to save events' }
    }
}

export async function debugEvents() {
    try {
        const fileExists = await fs
            .access(DATA_FILE_PATH)
            .then(() => true)
            .catch(() => false)

        let contentSnippet = ''
        if (fileExists) {
            const content = await fs.readFile(DATA_FILE_PATH, 'utf-8')
            contentSnippet = content.substring(0, 200) + '...'
        }

        return {
            path: DATA_FILE_PATH,
            exists: fileExists,
            cwd: process.cwd(),
            snippet: contentSnippet,
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return { error: message, path: DATA_FILE_PATH, cwd: process.cwd() }
    }
}

export async function addEvent(formData: FormData) {
    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const price = formData.get('price') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as string

    if (!title || !date) return { error: 'Titel und Datum sind erforderlich' }

    const newEvent: Event = {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        date,
        time,
        price,
        description,
        image: image || '',
    }

    const events = await getEvents()
    events.push(newEvent)

    await saveEvents(events)
    return { success: true }
}

export async function updateEvent(index: number, formData: FormData) {
    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const price = formData.get('price') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as string

    if (!title || !date) return { error: 'Titel und Datum sind erforderlich' }

    const events = await getEvents()

    if (index < 0 || index >= events.length) {
        return { error: 'Event not found' }
    }

    events[index] = {
        ...events[index],
        title,
        date,
        time,
        price,
        description,
        image: image || events[index].image,
    }

    await saveEvents(events)
    return { success: true }
}

export async function deleteEvent(index: number) {
    const events = await getEvents()
    if (index < 0 || index >= events.length) {
        return { error: 'Event not found' }
    }

    events.splice(index, 1)
    await saveEvents(events)
    return { success: true }
}
