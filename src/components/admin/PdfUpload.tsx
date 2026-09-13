'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileText, Loader2 } from 'lucide-react'
import { uploadPdf } from '@/lib/admin-api'

interface PdfUploadProps {
    /** Aktueller PDF-Pfad (z.B. /uploads/pdfs/flyer.pdf) */
    value: string
    /** Callback wenn sich der Pfad ändert */
    onChange: (path: string) => void
    /** Optionaler Unterordner für den Upload (z.B. "events") */
    folder?: string
    /** Label über dem Upload-Bereich */
    label?: string
    /** CSS-Klasse für den äußeren Container */
    className?: string
}

export function PdfUpload({ value, onChange, folder, label, className = '' }: PdfUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFile = useCallback(async (file: File) => {
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            setError('Nur PDF-Dateien erlaubt.')
            return
        }
        if (file.size > 20 * 1024 * 1024) {
            setError('Datei zu groß (max. 20 MB).')
            return
        }

        setUploading(true)
        setError('')

        try {
            const result = await uploadPdf(file, folder)
            onChange(result.path)
        } catch (err) {
            setError((err as Error).message || 'Upload fehlgeschlagen.')
        } finally {
            setUploading(false)
        }
    }, [folder, onChange])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
        e.target.value = ''
    }, [handleFile])

    const handleRemove = useCallback(() => {
        onChange('')
    }, [onChange])

    const handleClick = useCallback(() => {
        inputRef.current?.click()
    }, [])

    const getFileUrl = (path: string) => {
        if (!path) return ''
        if (path.startsWith('http')) return path
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
        if (siteUrl) return siteUrl + path
        return path
    }

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                    {label}
                </label>
            )}

            {value ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <a
                        href={getFileUrl(value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-w-0 items-center gap-2 text-sm text-primary hover:underline"
                    >
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="truncate" title={value}>{value.split('/').pop()}</span>
                    </a>
                    <div className="flex shrink-0 items-center gap-1">
                        <button
                            type="button"
                            onClick={handleClick}
                            disabled={uploading}
                            className="rounded-md px-2 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-50"
                        >
                            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Ändern'}
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="rounded-md px-2 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={handleClick}
                    className={`
                        flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4
                        transition-colors border-gray-300 bg-gray-50 hover:border-amber-300 hover:bg-amber-50/50
                        ${uploading ? 'pointer-events-none opacity-60' : ''}
                    `}
                >
                    {uploading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                    ) : (
                        <Upload className="h-5 w-5 text-amber-600" />
                    )}
                    <span className="text-sm text-gray-700">
                        {uploading ? 'Wird hochgeladen...' : 'PDF hochladen (z.B. Flyer, Speisekarte) — max. 20 MB'}
                    </span>
                </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleInputChange}
            />
        </div>
    )
}
