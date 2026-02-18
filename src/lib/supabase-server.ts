import { createClient } from '@supabase/supabase-js'

// Server/Build-Time Client: verwendet den service_role key
// Nur für Build-Zeit (generateStaticParams, getSiteContent bei next build)
// Wird NICHT an den Browser ausgeliefert
export const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)
