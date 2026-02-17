import { createClient } from '@supabase/supabase-js'

// Lazy singleton — initialized on first use at runtime, not at build time
let _client: ReturnType<typeof createClient> | null = null

export function getSupabase() {
    if (!_client) {
        _client = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
    }
    return _client
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: ReturnType<typeof createClient> = new Proxy({} as any, {
    get(_target, prop) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (getSupabase() as any)[prop]
    },
})

// Untyped access helper — use when no generated DB schema is available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = supabase as any

export interface Booking {
    id: string
    event_id: string
    event_title: string
    event_date: string
    customer_name: string
    customer_email: string
    customer_phone: string | null
    seats: number
    total_price_cents: number
    stripe_session_id: string | null
    status: 'pending' | 'confirmed' | 'cancelled'
    created_at: string
}
