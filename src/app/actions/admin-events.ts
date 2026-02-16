'use server'

import fs from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'site-content.json')

export async function getEvents() {
    try {
        console.log('Reading events from:', DATA_FILE_PATH);
        const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
        const data = JSON.parse(fileContent)
        const events = data.events_page?.events || []
        console.log(`Found ${events.length} events.`);
        return events
    } catch (error) {
        console.error('Error reading events:', error)
        return []
    }
}

export async function saveEvents(events: any[]) {
    try {
        const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
        const data = JSON.parse(fileContent)

        // Update only events
        data.events_page.events = events

        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
        revalidatePath('/admin')
        revalidatePath('/events')
        revalidatePath('/') // In case they are shown on homepage
        return { success: true }
    } catch (error) {
        console.error('Error saving events:', error)
        return { error: 'Failed to save events' }
    }
}

export async function debugEvents() {
    try {
        const fileExists = await fs.access(DATA_FILE_PATH).then(() => true).catch(() => false);
        let contentSnippet = '';
        if (fileExists) {
            const content = await fs.readFile(DATA_FILE_PATH, 'utf-8');
            contentSnippet = content.substring(0, 200) + '...';
        }
        return {
            path: DATA_FILE_PATH,
            exists: fileExists,
            cwd: process.cwd(),
            snippet: contentSnippet
        };
    } catch (e: any) {
        return { error: e.message, path: DATA_FILE_PATH, cwd: process.cwd() };
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

    const newEvent = {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        date,
        time,
        price,
        description,
        image: image || ''
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
        image: image || events[index].image // Keep old image if not updated/provided
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
