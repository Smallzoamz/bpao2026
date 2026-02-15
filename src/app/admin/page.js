'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';

export default function AdminOverview() {
    const [stats, setStats] = useState({ pages: 0, personnel: 0, docs: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // 1. Fetch Counts
            const { count: pages } = await supabase.from('pages').select('*', { count: 'exact', head: true });
            const { count: personnel } = await supabase.from('personnel').select('*', { count: 'exact', head: true });
            const { count: docs } = await supabase.from('documents').select('*', { count: 'exact', head: true });

            setStats({ pages: pages || 0, personnel: personnel || 0, docs: docs || 0 });

            // 2. Fetch Recent Personnel changes
            const { data: recentP } = await supabase.from('personnel').select('name_th, created_at').order('created_at', { descending: true }).limit(3);
            // 3. Fetch Recent Documents
            const { data: recentD } = await supabase.from('documents').select('title_th, created_at').order('created_at', { descending: true }).limit(3);

            const mixed = [
                ...(recentP || []).map(p => ({ type: 'personnel', title: p.name_th, date: p.created_at, icon: '👥' })),
                ...(recentD || []).map(d => ({ type: 'document', title: d.title_th, date: d.created_at, icon: '📄' }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

            setRecentActivity(mixed);
            setLoading(false);
        }
        fetchData();
    }, []);

    const metricCards = [
        { title: 'หน้าเว็บทั้งหมด', count: stats.pages, icon: '📄', color: '#3b82f6', subtitle: 'เปิดใช้งานบนเว็บไซต์' },
        { title: 'บุคลากรทั้งหมด', count: stats.personnel, icon: '👥', color: '#10b981', subtitle: 'แยกตามส่วนราชการ' },
        { title: 'เอกสารทั้งหมด', count: stats.docs, icon: '📁', color: '#f59e0b', subtitle: 'ประกาศ/จัดซื้อจัดจ้าง' },
    ];

    if (loading) return <div className="shimmer-placeholder" style={{ height: '400px' }}></div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            {/* Left Column: Metrics & Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {metricCards.map((card) => (
                        <div key={card.title} style={{
                            padding: '25px',
                            background: 'white',
                            borderRadius: '20px',
                            border: '1px solid #e2e8f0',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div style={{
                                    width: '45px', height: '45px', borderRadius: '12px', background: `${card.color}15`,
                                    color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                                }}>{card.icon}</div>
                                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800' }}>สถานะ: ปกติ</span>
                            </div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b' }}>{card.count}</h3>
                            <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155' }}>{card.title}</p>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{card.subtitle}</p>
                        </div>
                    ))}
                </div>

                <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '20px' }}>⚡ ทางลัดเมนูจัดการ</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <Link href="/admin/personnel" style={quickButtonStyle}>
                            <span style={{ fontSize: '1.2rem' }}>➕</span>
                            <div>
                                <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>เพิ่มรายชื่อบุคลากร</p>
                                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>จัดการทำเนียบผู้บริหารและเจ้าหน้าที่</p>
                            </div>
                        </Link>
                        <Link href="/admin/procurement" style={quickButtonStyle}>
                            <span style={{ fontSize: '1.2rem' }}>📄</span>
                            <div>
                                <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>ลงประกาศใหม่</p>
                                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>ประกาศจัดซื้อจัดจ้าง/เอกสารทางราชการ</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Column: Recent Activity */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '20px' }}>🛡️ กิจกรรมล่าสุด</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {recentActivity.map((act, i) => (
                        <div key={i} style={{ display: 'flex', gap: '15px', position: 'relative' }}>
                            {i !== recentActivity.length - 1 && (
                                <div style={{ position: 'absolute', left: '17px', top: '35px', bottom: '-15px', width: '1px', background: '#e2e8f0' }}></div>
                            )}
                            <div style={{
                                width: '35px', height: '35px', borderRadius: '50%', background: '#f1f5f9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', zIndex: 1
                            }}>{act.icon}</div>
                            <div>
                                <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>{act.title}</p>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    {act.type === 'personnel' ? 'เพิ่มบุคลากรใหม่' : 'ลงประกาศใหม่'} • {new Date(act.date).toLocaleDateString('th-TH')}
                                </p>
                            </div>
                        </div>
                    ))}
                    {recentActivity.length === 0 && (
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '20px' }}>ยังไม่มีข้อมูลการเปลี่ยนแปลงล่าสุด</p>
                    )}
                </div>

                <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '16px' }}>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.6' }}>
                        <strong>Dashboard Insight:</strong> ระบบทำงานปกติ ดึงข้อมูลล่าสุดจาก Supabase Cloud เรียบร้อยแล้ว 🦁
                    </p>
                </div>
            </div>
        </div>
    );
}

const quickButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    borderRadius: '16px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    transition: '0.3s',
    textDecoration: 'none',
    color: 'inherit'
};
