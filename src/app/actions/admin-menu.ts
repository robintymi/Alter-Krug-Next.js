'use server'

import fs from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { MenuCategory, MenuItem, MenuSectionLayout } from '@/data/types'

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'site-content.json')

export interface EditableCardPage {
    title: string
    intro?: string
    categories: MenuCategory[]
}

interface MenuPagePayload {
    menuPage: EditableCardPage
    drinksPage: EditableCardPage
}

function asRecord(value: unknown): Record<string, unknown> | null {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return null
    }
    return value as Record<string, unknown>
}

function toStringValue(value: unknown, fallback = ''): string {
    return typeof value === 'string' ? value : fallback
}

function normalizeLayoutDirection(value: unknown): MenuSectionLayout {
    if (value === 'items-left' || value === 'image-left') {
        return value
    }
    return 'auto'
}

function normalizeItem(value: unknown): MenuItem {
    const record = asRecord(value)
    if (!record) {
        return { name: '', price: '', description: '', image: '' }
    }

    return {
        name: toStringValue(record.name),
        price: toStringValue(record.price),
        description: toStringValue(record.description),
        image: toStringValue(record.image),
    }
}

function normalizeCategory(value: unknown): MenuCategory {
    const record = asRecord(value)
    if (!record) {
        return {
            name: 'Neue Sektion',
            image: '',
            layoutDirection: 'auto',
            items: [],
        }
    }

    const items = Array.isArray(record.items) ? record.items.map(normalizeItem) : []
    const layout = record.layout === 'list' || record.layout === 'alternating' ? record.layout : undefined

    return {
        name: toStringValue(record.name, 'Neue Sektion'),
        image: toStringValue(record.image),
        layout,
        layoutDirection: normalizeLayoutDirection(record.layoutDirection),
        items,
    }
}

function normalizePage(value: unknown, fallbackTitle: string, includeIntro: boolean): EditableCardPage {
    const record = asRecord(value)
    if (!record) {
        return {
            title: fallbackTitle,
            intro: includeIntro ? '' : undefined,
            categories: [],
        }
    }

    const categories = Array.isArray(record.categories) ? record.categories.map(normalizeCategory) : []
    const page: EditableCardPage = {
        title: toStringValue(record.title, fallbackTitle),
        categories,
    }

    if (includeIntro) {
        page.intro = toStringValue(record.intro)
    }

    return page
}

async function readSiteContentFile(): Promise<Record<string, unknown>> {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
    const parsed = JSON.parse(fileContent)
    const record = asRecord(parsed)

    if (!record) {
        throw new Error('Invalid site-content structure.')
    }

    return record
}

export async function getMenuAndDrinksPages(): Promise<MenuPagePayload> {
    try {
        const data = await readSiteContentFile()
        return {
            menuPage: normalizePage(data.menu_page, 'Speisekarte', true),
            drinksPage: normalizePage(data.drinks_page, 'Getränkekarte', false),
        }
    } catch (error) {
        console.error('Error reading menu and drinks pages:', error)
        return {
            menuPage: { title: 'Speisekarte', intro: '', categories: [] },
            drinksPage: { title: 'Getränkekarte', categories: [] },
        }
    }
}

export async function saveMenuAndDrinksPages(payload: MenuPagePayload) {
    try {
        const data = await readSiteContentFile()
        const nextMenuPage = normalizePage(payload.menuPage, 'Speisekarte', true)
        const nextDrinksPage = normalizePage(payload.drinksPage, 'Getränkekarte', false)

        data.menu_page = nextMenuPage
        data.drinks_page = nextDrinksPage

        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')

        revalidatePath('/admin')
        revalidatePath('/admin/karten')
        revalidatePath('/speisekarte')
        revalidatePath('/getraenke')

        return { success: true }
    } catch (error) {
        console.error('Error saving menu and drinks pages:', error)
        return { success: false, error: 'Karten konnten nicht gespeichert werden.' }
    }
}
