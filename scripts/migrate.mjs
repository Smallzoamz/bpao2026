import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://npukemkokwtpjqtbxcli.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdWtlbWtva3d0cGpxdGJ4Y2xpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ5OTE4OSwiZXhwIjoyMDg0MDc1MTg5fQ.NXKuBm3fZF9Oe0J9wwjyznZjj-QJ-dsBHwm-3OBiH6c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('🚀 Starting migration...');

    // 1. Create News Table (using RPC or assuming DB already allows table creation via SQL if possible, 
    // but typically we'd use execute_sql if we had permissions. Since we don't, 
    // we'll try to insert and hope the tables exist or use this script to insert data into existing tables if Boss created them.
    // Wait, if I don't have SQL access, I can't create tables via JS directly without execute_sql or pre-existing tables.

    // Let's try to see if I can run a simple 'select' to check if tables exist.
    const { error: newsError } = await supabase.from('news').select('id').limit(1);

    if (newsError && newsError.code === 'PGRST116' || newsError?.message?.includes('does not exist')) {
        console.log('❌ Tables "news" and "activities" probably do not exist.');
        console.log('Boss, please run the SQL in migrations/create_tables.sql in your Supabase SQL Editor.');
        return;
    }

    // Seeding data
    const newsData = [
        {
            title_th: 'การแข่งขันกีฬานักเรียน นักศึกษาแห่งชาติ ครั้งที่ 45 “ฅนบุรีรัมย์เกมส์”',
            excerpt_th: 'พลเอก เฉลิมชัย สิทธิสาท องคมนตรี เป็นผู้แทนพระองค์เปิดการแข่งขันกีฬานักเรียน นักศึกษาแห่งชาติ ครั้งที่ 45 ณ จังหวัดบุรีรัมย์ อย่างเป็นทางการ',
            content_th: 'วันที่ 5 กุมภาพันธ์ 2569 เวลา 18.05 น. ...',
            image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000',
            category: 'กีฬา',
            publish_date: new Date('2026-02-05').toISOString()
        }
    ];

    const { error: insertError } = await supabase.from('news').upsert(newsData, { onConflict: 'title_th' });
    if (insertError) console.error('Error seeding news:', insertError);
    else console.log('✅ News seeded!');

    const activitiesData = [
        {
            title: 'การแข่งขันกีฬานักเรียนแห่งชาติ ครั้งที่ 45 “ฅนบุรีรัมย์เกมส์”',
            date: '5 กุมภาพันธ์ 2569',
            image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000'
        }
    ];

    const { error: actError } = await supabase.from('activities').upsert(activitiesData, { onConflict: 'title' });
    if (actError) console.error('Error seeding activities:', actError);
    else console.log('✅ Activities seeded!');
}

migrate();
