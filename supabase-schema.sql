-- =============================================================
-- Alter Krug Web – Supabase Schema
-- Dieses SQL im Supabase Dashboard unter "SQL Editor" ausführen
-- =============================================================

-- 1. Site Content (Key-Value Store für Seiteninhalt)
CREATE TABLE IF NOT EXISTS site_content (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jeder kann lesen" ON site_content
    FOR SELECT USING (true);

CREATE POLICY "Authentifizierte können schreiben" ON site_content
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 2. Events (eigene Tabelle wegen Buchungs-Bezug)
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT DEFAULT '',
    price TEXT DEFAULT '',
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    gallery_image TEXT DEFAULT '',
    recurring BOOLEAN DEFAULT false,
    max_seats INTEGER,
    price_in_cents INTEGER,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jeder kann Events lesen" ON events
    FOR SELECT USING (true);

CREATE POLICY "Authentifizierte können Events verwalten" ON events
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 3. Bookings (existiert bereits – nur erstellen falls noch nicht vorhanden)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL,
    event_title TEXT NOT NULL,
    event_date TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    seats INTEGER NOT NULL,
    total_price_cents INTEGER NOT NULL,
    stripe_session_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Bookings: nur authentifizierte User (Admin) können alles lesen/schreiben
-- Öffentlich: nur INSERT (neue Buchung erstellen) via Edge Function mit service_role
CREATE POLICY "Admin kann Buchungen lesen" ON bookings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin kann Buchungen verwalten" ON bookings
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Service Role kann alles (für Edge Functions)
CREATE POLICY "Service Role Vollzugriff" ON bookings
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
