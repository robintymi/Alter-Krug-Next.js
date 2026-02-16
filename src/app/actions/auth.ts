'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_USER = 'marcoclaudi'
const ADMIN_PASS = 'k@llich\u20ACn'
const COOKIE_NAME = 'admin_session'

interface LoginState {
    error: string
}

export async function login(_prevState: LoginState, formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const cookieStore = await cookies()
        cookieStore.set(COOKIE_NAME, 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })
        redirect('/admin')
    }

    return { error: 'Ungueltige Zugangsdaten' }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
    redirect('/admin/login')
}
