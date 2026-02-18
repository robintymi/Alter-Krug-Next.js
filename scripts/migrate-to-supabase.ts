/**
 * Einmaliges Migrations-Skript: site-content.json → Supabase
 *
 * Ausführen mit: npx tsx scripts/migrate-to-supabase.ts
 *
 * Voraussetzung: .env.local muss NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY enthalten
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs/promises'
import path from 'path'
import { config } from 'dotenv'

// .env.local laden
config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Fehler: NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen in .env.local stehen')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrate() {
    console.log('📖 Lese site-content.json...')
    const jsonPath = path.join(process.cwd(), 'src/data/site-content.json')
    const raw = await fs.readFile(jsonPath, 'utf-8')
    const content = JSON.parse(raw)

    // Events separat extrahieren
    const events = content.events_page?.events ?? []

    // events_page ohne die events-Array speichern (die kommen in die eigene Tabelle)
    const eventsPageWithoutEvents = {
        title: content.events_page?.title,
        intro: content.events_page?.intro,
        gallery: content.events_page?.gallery,
    }

    // hotel_page enthält rooms – die speichern wir auch in site_content
    // (rooms_page ist im Type definiert, im JSON aber in hotel_page eingebettet)

    // Alle Content-Sections für die site_content Tabelle
    const sections: Record<string, unknown> = {
        header: content.header,
        hero: content.hero,
        home_hotel: content.home_hotel,
        home_restaurant: content.home_restaurant,
        home_events: content.home_events,
        home_gallery: content.home_gallery,
        home_promo: content.home_promo,
        home_contact: content.home_contact,
        hotel_page: content.hotel_page,
        rooms_page: {
            title: 'Unsere Zimmer',
            subtitle: '',
            intro: content.hotel_page?.mission || '',
            buttonText: content.hotel_page?.buttonText || 'Jetzt buchen',
            buttonLink: content.hotel_page?.buttonLink || '',
            rooms: content.hotel_page?.rooms || [],
            bottomBooking: content.hotel_page?.bottomBooking,
        },
        restaurant_page: content.restaurant_page,
        wellness_page: content.wellness_page,
        menu_page: content.menu_page,
        drinks_page: content.drinks_page,
        buffet_page: content.buffet_page,
        events_page: eventsPageWithoutEvents,
        job_page: content.job_page,
        contact_page: content.contact_page,
        directions_page: content.directions_page,
        footer: content.footer,
    }

    // 1. Site Content einfügen
    console.log('📤 Füge site_content Einträge ein...')
    for (const [key, data] of Object.entries(sections)) {
        const { error } = await supabase
            .from('site_content')
            .upsert({ key, data, updated_at: new Date().toISOString() })

        if (error) {
            console.error(`  ❌ ${key}: ${error.message}`)
        } else {
            console.log(`  ✅ ${key}`)
        }
    }

    // 2. Events einfügen
    console.log('\n📤 Füge Events ein...')
    for (let i = 0; i < events.length; i++) {
        const ev = events[i]
        const { error } = await supabase
            .from('events')
            .upsert({
                id: ev.id,
                title: ev.title,
                date: ev.date,
                time: ev.time || '',
                price: ev.price || '',
                description: ev.description || '',
                image: ev.image || '',
                gallery_image: ev.galleryImage || '',
                recurring: ev.recurring || false,
                max_seats: ev.maxSeats || null,
                price_in_cents: ev.priceInCents || null,
                sort_order: i,
            })

        if (error) {
            console.error(`  ❌ ${ev.id}: ${error.message}`)
        } else {
            console.log(`  ✅ ${ev.id} — ${ev.title}`)
        }
    }

    console.log('\n🎉 Migration abgeschlossen!')
    console.log('ℹ️  Du kannst jetzt im Supabase Dashboard prüfen, ob die Daten korrekt sind.')
}

migrate().catch(console.error)
