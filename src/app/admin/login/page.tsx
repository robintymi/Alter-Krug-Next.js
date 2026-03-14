'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin } from '@/lib/admin-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Building2 } from 'lucide-react'

export default function LoginPage() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const form = e.currentTarget
        const formData = new FormData(form)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const result = await adminLogin(email, password)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            router.push('/admin')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-sm shadow-xl">
                <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Building2 className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="font-serif text-4xl">Admin Login</CardTitle>
                    <CardDescription>Bitte melden Sie sich an, um Events sowie Speise- und Getränkekarte zu verwalten.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Benutzername</Label>
                            <Input id="email" name="email" type="text" required placeholder="Benutzername eingeben" autoComplete="username" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Passwort</Label>
                            <Input id="password" name="password" type="password" required placeholder="Passwort eingeben" autoComplete="current-password" />
                        </div>
                        {error && <p className="rounded bg-red-50 p-2 text-center text-sm font-medium text-red-500">{error}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full font-bold" disabled={loading}>
                            {loading ? 'Anmelden...' : 'Anmelden'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
