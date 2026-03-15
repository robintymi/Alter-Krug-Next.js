'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { uploadImage } from '@/lib/admin-api'

interface ImageUploadProps {
    /** Aktueller Bildpfad (z.B. /img/events/beispiel.jpg) */
    value: string
    /** Callback wenn sich der Bildpfad ändert */
    onChange: (path: string) => void
    /** Optionaler Unterordner für den Upload (z.B. "events", "speisekarte") */
    folder?: string
    /** Label über dem Upload-Bereich */
    label?: string
    /** Kompakte Darstellung (kleiner) */
    compact?: boolean
    /** CSS-Klasse für den äußeren Container */
    className?: string
}

export function ImageUpload({
    value,
    onChange,
    folder,
    label,
    compact = false,
    className = '',
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [error, setError] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Nur Bilddateien erlaubt.')
            return
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('Datei zu groß (max. 10 MB).')
            return
        }

        setUploading(true)
        setError('')

        try {
            const result = await uploadImage(file, folder)
            onChange(result.path)
        } catch (err) {
            setError((err as Error).message || 'Upload fehlgeschlagen.')
        } finally {
            setUploading(false)
        }
    }, [folder, onChange])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }, [handleFile])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }, [])

    const handleDragLeave = useCallback(() => {
        setDragOver(false)
    }, [])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
        // Input zurücksetzen damit gleiche Datei erneut gewählt werden kann
        e.target.value = ''
    }, [handleFile])

    const handleRemove = useCallback(() => {
        onChange('')
    }, [onChange])

    const handleClick = useCallback(() => {
        inputRef.current?.click()
    }, [])

    // API-URL für Bildvorschau (Bilder liegen auf dem Server)
    const getImageUrl = (path: string) => {
        if (!path) return ''
        // Wenn der Pfad schon eine vollständige URL ist
        if (path.startsWith('http')) return path
        // Relativer Pfad — auf dem Server unter der Site-URL
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
        if (siteUrl) return siteUrl + path
        return path
    }

    const imageUrl = getImageUrl(value)

    if (compact) {
        return (
            <div className={`space-y-1.5 ${className}`}>
                {label && (
                    <label className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                        {label}
                    </label>
                )}
                <div className="flex items-center gap-2">
                    {value ? (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imageUrl}
                                alt="Vorschau"
                                className="h-full w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white shadow-sm hover:bg-red-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ) : null}
                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={uploading}
                        className="flex items-center gap-1.5 rounded-md border border-dashed border-gray-300 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50"
                    >
                        {uploading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Upload className="h-3.5 w-3.5" />
                        )}
                        {value ? 'Ändern' : 'Hochladen'}
                    </button>
                    {value && (
                        <span className="truncate text-xs text-muted-foreground max-w-[150px]" title={value}>
                            {value.split('/').pop()}
                        </span>
                    )}
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleInputChange}
                />
            </div>
        )
    }

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                    {label}
                </label>
            )}

            {value ? (
                /* Vorschau mit Bild */
                <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <div className="relative aspect-video w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt="Vorschau"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex items-center justify-between border-t bg-white px-3 py-2">
                        <span className="truncate text-xs text-muted-foreground" title={value}>
                            {value}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={handleClick}
                                disabled={uploading}
                                className="rounded-md px-2 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-50"
                            >
                                {uploading ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    'Ändern'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="rounded-md px-2 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                            >
                                Entfernen
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Drop-Zone */
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={handleClick}
                    className={`
                        flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6
                        transition-colors
                        ${dragOver
                            ? 'border-amber-400 bg-amber-50'
                            : 'border-gray-300 bg-gray-50 hover:border-amber-300 hover:bg-amber-50/50'
                        }
                        ${uploading ? 'pointer-events-none opacity-60' : ''}
                    `}
                >
                    {uploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                            <ImageIcon className="h-6 w-6 text-amber-600" />
                        </div>
                    )}
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">
                            {uploading ? 'Wird hochgeladen...' : 'Bild hierher ziehen'}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            oder klicken zum Auswählen (JPEG, PNG, WebP — max. 10 MB)
                        </p>
                    </div>
                </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
            />
        </div>
    )
}
