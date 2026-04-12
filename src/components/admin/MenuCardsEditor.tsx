'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, GripVertical, Plus, Save, Settings2, Trash2 } from 'lucide-react'
import { saveMenuPages, MenuPageData } from '@/lib/admin-api'
import { MenuCategory, MenuItem, MenuSectionLayout } from '@/data/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/admin/ImageUpload'

type PageKey = 'menu' | 'drinks'

interface MenuCardsEditorProps {
    initialMenuPage: MenuPageData
    initialDrinksPage: MenuPageData
}

interface EditorState {
    menu: MenuPageData
    drinks: MenuPageData
}

const PAGE_CONFIG: Record<PageKey, { title: string; showIntro: boolean }> = {
    menu: { title: 'Speisekarte', showIntro: true },
    drinks: { title: 'Getränkekarte', showIntro: false },
}

function createEmptyItem(): MenuItem {
    return {
        name: '',
        price: '',
        description: '',
        image: '',
    }
}

function createEmptyCategory(label: string): MenuCategory {
    return {
        name: `${label} Sektion`,
        image: '',
        layoutDirection: 'auto',
        items: [createEmptyItem()],
    }
}

function moveEntry<T>(entries: T[], fromIndex: number, delta: number): T[] {
    const toIndex = fromIndex + delta

    if (toIndex < 0 || toIndex >= entries.length) {
        return entries
    }

    const next = [...entries]
    const [movedEntry] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, movedEntry)
    return next
}

function normalizePageForEditor(page: MenuPageData, showIntro: boolean): MenuPageData {
    return {
        title: page.title ?? '',
        intro: showIntro ? page.intro ?? '' : undefined,
        categories: (page.categories ?? []).map((category) => ({
            name: category.name ?? '',
            image: category.image ?? '',
            layout: category.layout,
            layoutDirection: (category.layoutDirection ?? 'auto') as MenuSectionLayout,
            items: (category.items ?? []).map((item) => ({
                name: item.name ?? '',
                price: item.price ?? '',
                description: item.description ?? '',
                image: item.image ?? '',
            })),
        })),
    }
}

export function MenuCardsEditor({ initialMenuPage, initialDrinksPage }: MenuCardsEditorProps) {
    const [pages, setPages] = useState<EditorState>({
        menu: normalizePageForEditor(initialMenuPage, true),
        drinks: normalizePageForEditor(initialDrinksPage, false),
    })
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    // Accordion state: which items are expanded for editing
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
    // Which category settings panels are open
    const [expandedCategorySettings, setExpandedCategorySettings] = useState<Record<string, boolean>>({})

    const itemKey = (pageKey: PageKey, catIdx: number, itemIdx: number) =>
        `${pageKey}-${catIdx}-${itemIdx}`
    const catKey = (pageKey: PageKey, catIdx: number) => `${pageKey}-${catIdx}`

    const toggleItem = (key: string) =>
        setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))

    const toggleCategorySettings = (key: string) =>
        setExpandedCategorySettings((prev) => ({ ...prev, [key]: !prev[key] }))

    const updatePage = (pageKey: PageKey, updater: (page: MenuPageData) => MenuPageData) => {
        setPages((previous) => ({
            ...previous,
            [pageKey]: updater(previous[pageKey]),
        }))
    }

    const setPageField = (pageKey: PageKey, field: 'title' | 'intro', value: string) => {
        updatePage(pageKey, (page) => ({
            ...page,
            [field]: value,
        }))
    }

    const setCategoryField = (
        pageKey: PageKey,
        categoryIndex: number,
        field: 'name' | 'image' | 'layoutDirection',
        value: string
    ) => {
        updatePage(pageKey, (page) => ({
            ...page,
            categories: page.categories.map((category, index) => {
                if (index !== categoryIndex) return category

                if (field === 'layoutDirection') {
                    return { ...category, layoutDirection: value as MenuSectionLayout }
                }

                return { ...category, [field]: value }
            }),
        }))
    }

    const addCategory = (pageKey: PageKey) => {
        updatePage(pageKey, (page) => ({
            ...page,
            categories: [...page.categories, createEmptyCategory(PAGE_CONFIG[pageKey].title)],
        }))
    }

    const removeCategory = (pageKey: PageKey, categoryIndex: number) => {
        updatePage(pageKey, (page) => ({
            ...page,
            categories: page.categories.filter((_, index) => index !== categoryIndex),
        }))
    }

    const moveCategory = (pageKey: PageKey, categoryIndex: number, delta: number) => {
        updatePage(pageKey, (page) => ({
            ...page,
            categories: moveEntry(page.categories, categoryIndex, delta),
        }))
    }

    const setItemField = (
        pageKey: PageKey,
        categoryIndex: number,
        itemIndex: number,
        field: 'name' | 'price' | 'description' | 'image',
        value: string
    ) => {
        updatePage(pageKey, (page) => ({
            ...page,
            categories: page.categories.map((category, currentCategoryIndex) => {
                if (currentCategoryIndex !== categoryIndex) return category

                return {
                    ...category,
                    items: category.items.map((item, currentItemIndex) =>
                        currentItemIndex === itemIndex ? { ...item, [field]: value } : item
                    ),
                }
            }),
        }))
    }

    const addItem = (pageKey: PageKey, categoryIndex: number) => {
        const newItemIndex =
            (pages[pageKey].categories[categoryIndex]?.items.length ?? 0)
        updatePage(pageKey, (page) => ({
            ...page,
            categories: page.categories.map((category, index) =>
                index === categoryIndex
                    ? { ...category, items: [...category.items, createEmptyItem()] }
                    : category
            ),
        }))
        // Auto-expand the new item
        setTimeout(() => {
            setExpandedItems((prev) => ({
                ...prev,
                [itemKey(pageKey, categoryIndex, newItemIndex)]: true,
            }))
        }, 0)
    }

    const removeItem = (pageKey: PageKey, categoryIndex: number, itemIndex: number) => {
        updatePage(pageKey, (page) => ({
            ...page,
            categories: page.categories.map((category, index) => {
                if (index !== categoryIndex) return category

                return {
                    ...category,
                    items: category.items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex),
                }
            }),
        }))
    }

    const moveItem = (pageKey: PageKey, categoryIndex: number, itemIndex: number, delta: number) => {
        updatePage(pageKey, (page) => ({
            ...page,
            categories: page.categories.map((category, index) => {
                if (index !== categoryIndex) return category

                return {
                    ...category,
                    items: moveEntry(category.items, itemIndex, delta),
                }
            }),
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage('')
        setError('')

        try {
            await saveMenuPages(pages.menu, pages.drinks)
            setMessage('Karten erfolgreich gespeichert.')
            setTimeout(() => setMessage(''), 3000)
        } catch (err) {
            setError((err as Error).message || 'Beim Speichern ist ein Fehler aufgetreten.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Header bar */}
            <div className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Speise- und Getränkekarten</h1>
                    <p className="text-sm text-muted-foreground">
                        Auf einen Eintrag klicken zum Bearbeiten. Sektionen und Einträge per Pfeile sortieren.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Speichert...' : 'Alles speichern'}
                </Button>
            </div>

            {message && (
                <p className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
                    {message}
                </p>
            )}
            {error && (
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}

            {(['menu', 'drinks'] as PageKey[]).map((pageKey) => {
                const page = pages[pageKey]
                const pageConfig = PAGE_CONFIG[pageKey]

                return (
                    <section key={pageKey} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                        {/* Page title / intro */}
                        <div className="grid gap-4 border-b pb-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                                    {pageConfig.title} — Seitentitel
                                </Label>
                                <Input
                                    value={page.title}
                                    onChange={(e) => setPageField(pageKey, 'title', e.target.value)}
                                />
                            </div>

                            {pageConfig.showIntro && (
                                <div className="space-y-1.5">
                                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                                        Einleitung
                                    </Label>
                                    <Textarea
                                        rows={2}
                                        value={page.intro ?? ''}
                                        onChange={(e) => setPageField(pageKey, 'intro', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Categories as accordion sections */}
                        <div className="space-y-3">
                            {page.categories.map((category, categoryIndex) => {
                                const ck = catKey(pageKey, categoryIndex)
                                const settingsOpen = expandedCategorySettings[ck] ?? false

                                return (
                                    <article key={ck} className="overflow-hidden rounded-lg border border-gray-200">
                                        {/* Section header */}
                                        <div className="flex items-center gap-2 bg-amber-50 px-4 py-3">
                                            <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            <span className="flex-1 font-semibold text-sm">
                                                {category.name || `Sektion ${categoryIndex + 1}`}
                                            </span>
                                            <span className="text-xs text-muted-foreground mr-1">
                                                {category.items.length} Einträge
                                            </span>
                                            <button
                                                type="button"
                                                title="Einstellungen"
                                                onClick={() => toggleCategorySettings(ck)}
                                                className={`rounded p-1 transition-colors hover:bg-amber-200 ${settingsOpen ? 'bg-amber-200 text-amber-900' : 'text-muted-foreground'}`}
                                            >
                                                <Settings2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Nach oben"
                                                onClick={() => moveCategory(pageKey, categoryIndex, -1)}
                                                disabled={categoryIndex === 0}
                                                className="rounded p-1 text-muted-foreground transition-colors hover:bg-amber-200 disabled:opacity-30"
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Nach unten"
                                                onClick={() => moveCategory(pageKey, categoryIndex, 1)}
                                                disabled={categoryIndex === page.categories.length - 1}
                                                className="rounded p-1 text-muted-foreground transition-colors hover:bg-amber-200 disabled:opacity-30"
                                            >
                                                <ArrowDown className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Sektion löschen"
                                                onClick={() => removeCategory(pageKey, categoryIndex)}
                                                className="rounded p-1 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Sektionsbild — immer sichtbar, kompakt */}
                                        <div className="border-b bg-amber-50/30 px-4 py-2.5">
                                            <ImageUpload
                                                label="Sektionsbild"
                                                value={category.image ?? ''}
                                                onChange={(path) =>
                                                    setCategoryField(pageKey, categoryIndex, 'image', path)
                                                }
                                                folder={pageKey === 'menu' ? 'speisekarte' : 'getraenke'}
                                                compact
                                            />
                                        </div>

                                        {/* Weitere Einstellungen (collapsible) */}
                                        {settingsOpen && (
                                            <div className="grid gap-4 border-b bg-amber-50/40 px-4 py-4 md:grid-cols-2">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                                                        Sektionsname
                                                    </Label>
                                                    <Input
                                                        value={category.name}
                                                        onChange={(e) =>
                                                            setCategoryField(pageKey, categoryIndex, 'name', e.target.value)
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                                                        Layout
                                                    </Label>
                                                    <select
                                                        value={category.layoutDirection ?? 'auto'}
                                                        onChange={(e) =>
                                                            setCategoryField(pageKey, categoryIndex, 'layoutDirection', e.target.value)
                                                        }
                                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                                    >
                                                        <option value="auto">Automatisch abwechselnd</option>
                                                        <option value="items-left">Links Einträge, rechts Bild</option>
                                                        <option value="image-left">Links Bild, rechts Einträge</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* Items list */}
                                        <div className="divide-y">
                                            {category.items.map((item, itemIndex) => {
                                                const ik = itemKey(pageKey, categoryIndex, itemIndex)
                                                const isOpen = expandedItems[ik] ?? false

                                                return (
                                                    <div key={ik}>
                                                        {/* Compact row */}
                                                        <div
                                                            className={`flex cursor-pointer items-center gap-2 px-4 py-2.5 transition-colors hover:bg-gray-50 ${isOpen ? 'bg-blue-50' : ''}`}
                                                            onClick={() => toggleItem(ik)}
                                                        >
                                                            {isOpen ? (
                                                                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                                                            ) : (
                                                                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                                            )}
                                                            <span className={`flex-1 text-sm ${!item.name ? 'italic text-muted-foreground' : ''}`}>
                                                                {item.name || 'Neuer Eintrag'}
                                                            </span>
                                                            {item.description && (
                                                                <span className="hidden max-w-[200px] truncate text-xs text-muted-foreground sm:block">
                                                                    {item.description}
                                                                </span>
                                                            )}
                                                            <span className="ml-auto shrink-0 text-sm font-medium text-gray-700">
                                                                {item.price || '—'}
                                                            </span>
                                                            {/* Row actions — stop propagation so click doesn't toggle */}
                                                            <button
                                                                type="button"
                                                                title="Nach oben"
                                                                onClick={(e) => { e.stopPropagation(); moveItem(pageKey, categoryIndex, itemIndex, -1) }}
                                                                disabled={itemIndex === 0}
                                                                className="rounded p-1 text-gray-400 hover:bg-gray-200 disabled:opacity-30"
                                                            >
                                                                <ArrowUp className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                title="Nach unten"
                                                                onClick={(e) => { e.stopPropagation(); moveItem(pageKey, categoryIndex, itemIndex, 1) }}
                                                                disabled={itemIndex === category.items.length - 1}
                                                                className="rounded p-1 text-gray-400 hover:bg-gray-200 disabled:opacity-30"
                                                            >
                                                                <ArrowDown className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                title="Eintrag löschen"
                                                                onClick={(e) => { e.stopPropagation(); removeItem(pageKey, categoryIndex, itemIndex) }}
                                                                className="rounded p-1 text-red-400 hover:bg-red-100 hover:text-red-600"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>

                                                        {/* Expanded edit form */}
                                                        {isOpen && (
                                                            <div className="space-y-3 border-t bg-blue-50/40 px-4 py-4">
                                                                <div className="grid gap-3 md:grid-cols-3">
                                                                    <div className="space-y-1.5 md:col-span-2">
                                                                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                            Name
                                                                        </Label>
                                                                        <Input
                                                                            value={item.name}
                                                                            autoFocus
                                                                            onChange={(e) =>
                                                                                setItemField(pageKey, categoryIndex, itemIndex, 'name', e.target.value)
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1.5">
                                                                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                            Preis
                                                                        </Label>
                                                                        <Input
                                                                            value={item.price}
                                                                            onChange={(e) =>
                                                                                setItemField(pageKey, categoryIndex, itemIndex, 'price', e.target.value)
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                        Beschreibung (optional)
                                                                    </Label>
                                                                    <Textarea
                                                                        rows={2}
                                                                        value={item.description ?? ''}
                                                                        onChange={(e) =>
                                                                            setItemField(pageKey, categoryIndex, itemIndex, 'description', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <ImageUpload
                                                                    label="Bild (optional)"
                                                                    value={item.image ?? ''}
                                                                    onChange={(path) =>
                                                                        setItemField(pageKey, categoryIndex, itemIndex, 'image', path)
                                                                    }
                                                                    folder={pageKey === 'menu' ? 'speisekarte' : 'getraenke'}
                                                                    compact
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Add item button */}
                                        <div className="border-t bg-gray-50 px-4 py-2">
                                            <button
                                                type="button"
                                                onClick={() => addItem(pageKey, categoryIndex)}
                                                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                                Eintrag hinzufügen
                                            </button>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>

                        <Button type="button" variant="secondary" onClick={() => addCategory(pageKey)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Neue Sektion hinzufügen
                        </Button>
                    </section>
                )
            })}
        </div>
    )
}
