-- ==========================================
-- Organization Chart Migration
-- เพิ่ม columns สำหรับรองรับผังองค์กร
-- ==========================================

-- เพิ่ม columns ในตาราง personnel
ALTER TABLE personnel ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES personnel(id) ON DELETE SET NULL;
ALTER TABLE personnel ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 0;
ALTER TABLE personnel ADD COLUMN IF NOT EXISTS is_manager BOOLEAN DEFAULT FALSE;

-- สร้าง index สำหรับ query ตาม parent_id
CREATE INDEX IF NOT EXISTS idx_personnel_parent_id ON personnel(parent_id);
CREATE INDEX IF NOT EXISTS idx_personnel_level ON personnel(level);

-- ตั้งค่า default สำหรับข้อมูลเดิม
UPDATE personnel SET level = 0 WHERE level IS NULL;
UPDATE personnel SET is_manager = FALSE WHERE is_manager IS NULL;

-- ==========================================
-- ตัวอย่างข้อมูลสำหรับทดสอบ (Optional)
-- ==========================================
-- โครงสร้างผังองค์กรตัวอย่าง:
-- 
-- นายก อบจ. (Level 0, is_manager = true)
-- ├── รองนายก ฝ่ายบริหาร (Level 1, parent_id = นายก)
-- │   ├── หัวหน้ากลุ่ม (Level 2, parent_id = รองนายก)
-- │   └── บุคลากร (Level 3, parent_id = หัวหน้ากลุ่ม)
-- └── รองนายก ฝ่ายวิชาการ (Level 1, parent_id = นายก)
--     └── หัวหน้ากลุ่ม (Level 2, parent_id = รองนายก)
