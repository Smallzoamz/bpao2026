-- ==========================================
-- 1. Create News Table
-- ==========================================
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_th TEXT NOT NULL,
    title_en TEXT,
    excerpt_th TEXT,
    excerpt_en TEXT,
    content_th TEXT,
    content_en TEXT,
    image_url TEXT,
    category TEXT,
    publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. Create Activities Table
-- ==========================================
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. Enable RLS and Set Policies
-- ==========================================
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read
CREATE POLICY "Allow public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Allow public read activities" ON activities FOR SELECT USING (true);

-- ==========================================
-- 4. Seed Initial Data
-- ==========================================
INSERT INTO news (title_th, excerpt_th, content_th, image_url, category, publish_date)
VALUES 
('การแข่งขันกีฬานักเรียน นักศึกษาแห่งชาติ ครั้งที่ 45 “ฅนบุรีรัมย์เกมส์”', 'พลเอก เฉลิมชัย สิทธิสาท องคมนตรี เป็นผู้แทนพระองค์เปิดการแข่งขันกีฬานักเรียน นักศึกษาแห่งชาติ ครั้งที่ 45 ณ จังหวัดบุรีรัมย์ อย่างเป็นทางการ', 'วันที่ 5 กุมภาพันธ์ 2569 เวลา 18.05 น. ...', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000', 'กีฬา', '2026-02-05 18:05:00+07'),
('มอบใบประกาศผู้ผ่านการฝึกอบรมโครงการพัฒนาศักยภาพผู้สูงอายุและผู้พิการ', 'รองนายก อบจ.บุรีรัมย์ เป็นประธานมอบใบประกาศแก่ผู้ผ่านการอบรมในโครงการพัฒนาคุณภาพชีวิตและส่งเสริมอาชีพเพื่อความยั่งยืน', 'วันที่ 22 มกราคม 2569 เวลา 11.30 น. ...', 'https://images.unsplash.com/photo-1581578731522-a204001923e3?q=80&w=1000', 'พัฒนาสังคม', '2026-01-22 11:30:00+07')
ON CONFLICT DO NOTHING;

INSERT INTO activities (title, date, image_url)
VALUES 
('การแข่งขันกีฬานักเรียนแห่งชาติ ครั้งที่ 45 “ฅนบุรีรัมย์เกมส์”', '5 กุมภาพันธ์ 2569', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000'),
('มอบใบประกาศผู้ผ่านการฝึกอบรมโครงการพัฒนาศักยภาพผู้สูงอายุและผู้พิการ', '22 มกราคม 2569', 'https://images.unsplash.com/photo-1581578731522-a204001923e3?q=80&w=1000')
ON CONFLICT DO NOTHING;
