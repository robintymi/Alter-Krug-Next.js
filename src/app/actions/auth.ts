'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_USER = 'marcoclaudi'
const ADMIN_PASS = 'k@llich€n'
const COOKIE_NAME = 'admin_session'

export async function login(prevState: any, formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        // Set cookie valid for 7 days
        (await cookies()).set(COOKIE_NAME, 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })
        redirect('/admin')
    }

    return { error: 'Ungültige Zugangsdaten' }
}

export async function logout() {
    (await cookies()).delete(COOKIE_NAME)
    redirect('/admin/login')
}
