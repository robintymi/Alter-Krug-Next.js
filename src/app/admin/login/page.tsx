'use client'

import { useFormState } from 'react-dom'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Building2 } from 'lucide-react'

// Define the initial state type
const initialState = {
  error: '',
}

export default function LoginPage() {
  // @ts-ignore - useFormState types can be tricky with server actions compatible structure
  const [state, formAction] = useFormState(login, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Building2 className="w-8 h-8 text-primary" />
                </div>
            </div>
          <CardTitle className="text-4xl font-serif">Admin Login</CardTitle>
          <CardDescription>
            Bitte melden Sie sich an, um Events zu verwalten.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Benutzername</Label>
                <Input 
                    id="username" 
                    name="username" 
                    type="text" 
                    required 
                    placeholder="Benutzername eingeben"
                    autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    placeholder="Passwort eingeben"
                    autoComplete="current-password"
                />
              </div>
              {state?.error && (
                <p className="text-sm text-red-500 text-center font-medium bg-red-50 p-2 rounded">{state.error}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full font-bold">Anmelden</Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  )
}
