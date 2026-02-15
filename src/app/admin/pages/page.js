'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function AdminPages() {
    const searchParams = useSearchParams();
    const targetSlug = searchParams.get('slug');
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPages();
    }, [targetSlug]);

    async function fetchPages() {
        setLoading(true);
        let query = supabase.from('pages').select('*');
        if (targetSlug) {
            query = query.eq('slug', targetSlug);
        }
        const { data } = await query.order('group_name', { ascending: false }).order('title_th', { ascending: true });
        setPages(data || []);
        setLoading(false);
    }

    const groups = [...new Set(pages.map(p => p.group_name || 'อื่นๆ'))];

    const getLinkHref = (page) => {
        if (page.slug === 'home') return '/';
        if (page.group_name === 'โครงสร้างองค์กร') return `/structure/${page.slug}`;
        if (page.group_name === 'ส่วนราชการในสังกัด') return `/department/${page.slug}`;
        return `/${page.slug}`;
    };

    if (loading) return <div className="shimmer-placeholder" style={{ height: '300px' }}></div>;

    return (
        <div className="admin-content-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', marginBottom: '8px' }}>รายการ: หน้าและเนื้อหา</p>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b' }}>จัดการหน้าเว็บและบล็อกเนื้อหา</h2>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อหน้าหรือ Slug..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ padding: '10px 15px', paddingLeft: '35px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '300px' }}
                        />
                        <span style={{ position: 'absolute', left: '12px', top: '10px', opacity: 0.4 }}>🔍</span>
                    </div>
                </div>
            </div>

            {groups.map(group => (
                <div key={group || 'none'} style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '900', color: '#64748b', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '4px', height: '1.2rem', background: 'var(--primary-dark)', borderRadius: '2px' }}></span>
                        {group}
                    </h3>

                    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', width: '60px' }}>สถานะ</th>
                                    <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>ชื่อหน้า (ไทย / Eng)</th>
                                    <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>Path / Slug</th>
                                    <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textAlign: 'right' }}>การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.filter(p => (p.group_name || 'อื่นๆ') === group).filter(p =>
                                    p.title_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((page) => (
                                    <tr key={page.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '15px 20px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                                        </td>
                                        <td style={{ padding: '15px 20px' }}>
                                            <div style={{ fontWeight: '800', color: '#1e293b' }}>{page.title_th}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{page.title_en || page.slug}</div>
                                        </td>
                                        <td style={{ padding: '15px 20px' }}>
                                            <code style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#64748b' }}>
                                                {getLinkHref(page)}
                                            </code>
                                        </td>
                                        <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                                <Link href={getLinkHref(page)} target="_blank" style={{ color: '#10b981', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none' }}>👁️ ดูหน้าเว็บ</Link>
                                                <Link href={`/admin/pages/editor?id=${page.id}`} style={{ color: '#3b82f6', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none' }}>⚙️ แก้ไขบล็อก</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            <div style={{ marginTop: '30px', padding: '24px', background: '#fffbeb', borderRadius: '20px', border: '1px solid #fef3c7' }}>
                <p style={{ fontSize: '0.9rem', color: '#92400e', lineHeight: '1.6' }}>
                    <strong>💡 เคล็ดลับจาก Sonic:</strong> Boss สามารถดูรายการหน้าเว็บแยกตามหมวดหมู่ได้แล้วครับ ปุ่ม <strong>"ดูหน้าเว็บ"</strong> จะพา Boss ไปยังหน้าที่ถูกต้องทันทีตามระบบ Dynamic Routing ครับ
                </p>
            </div>
        </div>
    );
}
