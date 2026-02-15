-- Add procurement fields to documents table for unified management
ALTER TABLE documents ADD COLUMN IF NOT EXISTS project_id_code TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ประกาศทั่วไป';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS budget NUMERIC DEFAULT 0;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'อบจ.บุรีรัมย์';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS description_th TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Update existing documents status
UPDATE documents SET status = 'ประกาศทั่วไป' WHERE status IS NULL;
