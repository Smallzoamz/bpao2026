CREATE TABLE IF NOT EXISTS procurement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id_code TEXT NOT NULL,
    title_th TEXT NOT NULL,
    title_en TEXT,
    fiscal_year TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL,
    budget NUMERIC DEFAULT 0,
    progress INTEGER DEFAULT 0,
    department TEXT,
    location TEXT,
    publish_date DATE DEFAULT CURRENT_DATE,
    description_th TEXT,
    description_en TEXT,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE procurement ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'procurement' AND policyname = 'Allow public read procurement') THEN
        CREATE POLICY "Allow public read procurement" ON procurement FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'procurement' AND policyname = 'Admin All Procurement') THEN
        CREATE POLICY "Admin All Procurement" ON procurement 
        FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;
