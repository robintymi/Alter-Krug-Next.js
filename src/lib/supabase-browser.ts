import { createClient } from '@supabase/supabase-js'

// Browser-Client: verwendet den öffentlichen anon key
// Sicher für Client-Side – RLS schützt die Daten
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
