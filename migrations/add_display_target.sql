-- Add display_target column to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS display_target TEXT DEFAULT 'all';

-- Optional: Update existing records to 'all' if they are null
UPDATE documents SET display_target = 'all' WHERE display_target IS NULL;
