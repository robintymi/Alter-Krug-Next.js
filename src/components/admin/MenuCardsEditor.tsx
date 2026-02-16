'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react'
import { saveMenuAndDrinksPages, EditableCardPage } from '@/app/actions/admin-menu'
import { MenuCategory, MenuItem, MenuSectionLayout } from '@/data/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type PageKey = 'menu' | 'drinks'

interface MenuCardsEditorProps {
    initialMenuPage: EditableCardPage
    initialDrinksPage: EditableCardPage
}

interface EditorState {
    menu: EditableCardPage
    drinks: EditableCardPage
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

function normalizePageForEditor(page: EditableCardPage, showIntro: boolean): EditableCardPage {
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

    const updatePage = (pageKey: PageKey, updater: (page: EditableCardPage) => EditableCardPage) => {
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
                if (index !== categoryIndex) {
                    return category
                }

                if (field === 'layoutDirection') {
                    return {
                        ...category,
                        layoutDirection: value as MenuSectionLayout,
                    }
                }

                return {
                    ...category,
                    [field]: value,
                }
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
                if (currentCategoryIndex !== categoryIndex) {
                    return category
                }

                return {
                    ...category,
                    items: category.items.map((item, currentItemIndex) =>
                        currentItemIndex === itemIndex
                            ? {
                                  ...item,
                                  [field]: value,
                              }
                            : item
                    ),
                }
            }),
        }))
    }

    const addItem = (pageKey: PageKey, categoryIndex: number) => {
        updatePage(pageKey, (page) => ({
            ...page,
            categories: page.categories.map((category, index) =>
                index === categoryIndex
                    ? {
                          ...category,
                          items: [...category.items, createEmptyItem()],
                      }
                    : category
            ),
        }))
    }

    const removeItem = (pageKey: PageKey, categoryIndex: number, itemIndex: number) => {
        updatePage(pageKey, (page) => ({
            ...page,
            categories: page.categories.map((category, index) => {
                if (index !== categoryIndex) {
                    return category
                }

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
                if (index !== categoryIndex) {
                    return category
                }

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

        const result = await saveMenuAndDrinksPages({
            menuPage: pages.menu,
            drinksPage: pages.drinks,
        })

        setSaving(false)

        if (result.success) {
            setMessage('Karten erfolgreich gespeichert.')
            setTimeout(() => setMessage(''), 3000)
            return
        }

        setError(result.error || 'Beim Speichern ist ein Fehler aufgetreten.')
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Speise- und Getränkekarten</h1>
                    <p className="text-sm text-muted-foreground">
                        Sektionen und Einträge bearbeiten, Reihenfolge ändern und Layout pro Sektion festlegen.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Speichert...' : 'Alles speichern'}
                </Button>
            </div>

            {message && <p className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">{message}</p>}
            {error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

            {(['menu', 'drinks'] as PageKey[]).map((pageKey) => {
                const page = pages[pageKey]
                const pageConfig = PAGE_CONFIG[pageKey]

                return (
                    <section key={pageKey} className="space-y-5 rounded-xl border bg-white p-5 shadow-sm">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>{pageConfig.title} Titel</Label>
                                <Input value={page.title} onChange={(event) => setPageField(pageKey, 'title', event.target.value)} />
                            </div>

                            {pageConfig.showIntro && (
                                <div className="space-y-2">
                                    <Label>Einleitung</Label>
                                    <Textarea
                                        rows={2}
                                        value={page.intro ?? ''}
                                        onChange={(event) => setPageField(pageKey, 'intro', event.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {page.categories.map((category, categoryIndex) => (
                                <article key={`${pageKey}-${categoryIndex}`} className="space-y-4 rounded-lg border bg-gray-50 p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h3 className="font-semibold">{`Sektion ${categoryIndex + 1}`}</h3>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => moveCategory(pageKey, categoryIndex, -1)}
                                                disabled={categoryIndex === 0}
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => moveCategory(pageKey, categoryIndex, 1)}
                                                disabled={categoryIndex === page.categories.length - 1}
                                            >
                                                <ArrowDown className="h-4 w-4" />
                                            </Button>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => removeCategory(pageKey, categoryIndex)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Sektion löschen
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Sektionsname</Label>
                                            <Input
                                                value={category.name}
                                                onChange={(event) => setCategoryField(pageKey, categoryIndex, 'name', event.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Layout</Label>
                                            <select
                                                value={category.layoutDirection ?? 'auto'}
                                                onChange={(event) => setCategoryField(pageKey, categoryIndex, 'layoutDirection', event.target.value)}
                                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                            >
                                                <option value="auto">Automatisch abwechselnd</option>
                                                <option value="items-left">Links Einträge, rechts Bild</option>
                                                <option value="image-left">Links Bild, rechts Einträge</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Sektionsbild (Pfad)</Label>
                                        <Input
                                            placeholder="/img/getraenke/Heißgetränke.jpeg"
                                            value={category.image ?? ''}
                                            onChange={(event) => setCategoryField(pageKey, categoryIndex, 'image', event.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-muted-foreground">Einträge</h4>
                                        <Button type="button" variant="outline" size="sm" onClick={() => addItem(pageKey, categoryIndex)}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Eintrag hinzufügen
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {category.items.map((item, itemIndex) => (
                                            <div key={`${pageKey}-${categoryIndex}-${itemIndex}`} className="space-y-3 rounded-md border bg-white p-3">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <p className="text-sm font-medium">{`Eintrag ${itemIndex + 1}`}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => moveItem(pageKey, categoryIndex, itemIndex, -1)}
                                                            disabled={itemIndex === 0}
                                                        >
                                                            <ArrowUp className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => moveItem(pageKey, categoryIndex, itemIndex, 1)}
                                                            disabled={itemIndex === category.items.length - 1}
                                                        >
                                                            <ArrowDown className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeItem(pageKey, categoryIndex, itemIndex)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Entfernen
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="grid gap-3 md:grid-cols-3">
                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label>Name</Label>
                                                        <Input
                                                            value={item.name}
                                                            onChange={(event) =>
                                                                setItemField(pageKey, categoryIndex, itemIndex, 'name', event.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Preis</Label>
                                                        <Input
                                                            value={item.price}
                                                            onChange={(event) =>
                                                                setItemField(pageKey, categoryIndex, itemIndex, 'price', event.target.value)
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Beschreibung (optional)</Label>
                                                    <Textarea
                                                        rows={2}
                                                        value={item.description ?? ''}
                                                        onChange={(event) =>
                                                            setItemField(pageKey, categoryIndex, itemIndex, 'description', event.target.value)
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Bildpfad am Eintrag (optional)</Label>
                                                    <Input
                                                        value={item.image ?? ''}
                                                        onChange={(event) =>
                                                            setItemField(pageKey, categoryIndex, itemIndex, 'image', event.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            ))}
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
