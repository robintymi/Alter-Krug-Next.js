import { supabase } from './supabase-browser'

export async function adminLogin(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { success: true }
}

export async function adminLogout() {
    await supabase.auth.signOut()
}

export async function getSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
}

export function onAuthStateChange(callback: (session: unknown) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
        callback(session)
    })
}
