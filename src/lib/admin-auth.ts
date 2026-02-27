function getApiBase(): string {
    if (typeof window !== 'undefined') {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
        return window.location.origin + basePath + '/api'
    }
    return process.env.NEXT_PUBLIC_API_URL || '/api'
}

export async function adminLogin(email: string, password: string) {
    try {
        const API = getApiBase()
        const res = await fetch(`${API}/auth.php?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (data.error) return { error: data.error }

        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_expires', data.expiresAt)
        return { success: true }
    } catch {
        return { error: 'Verbindungsfehler. Bitte versuchen Sie es erneut.' }
    }
}

export async function adminLogout() {
    const API = getApiBase()
    const token = localStorage.getItem('admin_token')
    if (token) {
        await fetch(`${API}/auth.php?action=logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => {})
    }
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_expires')
}

export async function getSession() {
    const token = localStorage.getItem('admin_token')
    const expires = localStorage.getItem('admin_expires')
    if (!token || !expires || new Date(expires) < new Date()) {
        return null
    }
    try {
        const API = getApiBase()
        const res = await fetch(`${API}/auth.php?action=check`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await res.json()
        return data.valid ? { token } : null
    } catch {
        return null
    }
}

export function getAuthToken(): string | null {
    return localStorage.getItem('admin_token')
}
