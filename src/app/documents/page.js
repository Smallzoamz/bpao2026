'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AutoBanner from '@/components/AutoBanner';
import { supabase } from '@/utils/supabase';
import { useLanguage } from '@/context/LanguageContext';

export default function DocumentsPage() {
    const { language } = useLanguage();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    async function fetchDocuments() {
        setLoading(true);
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .order('publish_date', { descending: true });

        if (!error && data) {
            setDocuments(data);
        }
        setLoading(false);
    }

    // กรองข้อมูลตาม category และ search query
    const filteredDocuments = documents.filter(doc => {
        const matchesCategory = filterCategory === 'All' || doc.category === filterCategory;
        const matchesSearch = !searchQuery ||
            (doc.title_th && doc.title_th.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (doc.title_en && doc.title_en.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // ดึง categories ที่มีอยู่
    const categories = ['All', ...new Set(documents.map(d => d.category).filter(Boolean))];

    // แยกประเภทเอกสาร
    const getDocIcon = (category) => {
        if (!category) return '📄';
        if (category.includes('จัดซื้อ') || category.includes('จัดจ้าง')) return '📋';
        if (category.includes('รับสมัคร') || category.includes('บุคลากร')) return '👥';
        if (category.includes('ประกาศ')) return '📢';
        if (category.includes('ระเบียบ') || category.includes('ข้อบังคับ')) return '⚖️';
        return '📄';
    };

    // แยกสถานะ
    const getStatusBadge = (status) => {
        if (!status || status === 'ประกาศทั่วไป') return null;

        const statusColors = {
            'ประกาศรับสมัคร': { bg: '#dbeafe', color: '#1e40af' },
            'เปิดประมูล': { bg: '#fef3c7', color: '#92400e' },
            'ระหว่างการประมูล': { bg: '#fce7f3', color: '#9d174d' },
            'ประกาศผู้ชนะ': { bg: '#d1fae5', color: '#065f46' },
            'ยกเลิก': { bg: '#fee2e2', color: '#991b1b' },
        };

        const style = statusColors[status] || { bg: '#f3f4f6', color: '#374151' };

        return (
            <span style={{
                fontSize: '0.7rem',
                background: style.bg,
                color: style.color,
                padding: '3px 10px',
                borderRadius: '100px',
                fontWeight: '800',
                whiteSpace: 'nowrap'
            }}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="shimmer-placeholder" style={{ width: '50px', height: '50px', borderRadius: '50%' }}></div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <main style={{ marginTop: '140px', minHeight: '60vh' }}>
                <div className="container" style={{ paddingBottom: '80px' }}>
                    <AutoBanner
                        title={language === 'TH' ? 'ประกาศ อบจ.บุรีรัมย์' : 'Announcements'}
                        subtitle={language === 'TH' ? 'องค์การบริหารส่วนจังหวัดบุรีรัมย์' : 'Buriram Provincial Administrative Organization'}
                    />

                    {/* Filter & Search */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
                            <input
                                type="text"
                                placeholder={language === 'TH' ? 'ค้นหาเอกสาร...' : 'Search documents...'}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 20px',
                                    paddingLeft: '45px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '0.95rem'
                                }}
                            />
                            <span style={{ position: 'absolute', left: '15px', top: '12px', opacity: 0.5 }}>🔍</span>
                        </div>
                        <select
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                            style={{
                                padding: '12px 20px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                background: 'white',
                                fontSize: '0.95rem',
                                minWidth: '180px'
                            }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'All' ? (language === 'TH' ? 'ทุกประเภท' : 'All Categories') : cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Documents List */}
                    {filteredDocuments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                            <span style={{ fontSize: '3rem' }}>📭</span>
                            <p style={{ marginTop: '15px', fontSize: '1.1rem' }}>
                                {language === 'TH' ? 'ไม่มีเอกสารในขณะนี้' : 'No documents available'}
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {filteredDocuments.map((doc) => {
                                const fileUrl = doc.file_url || doc.pdf_url;
                                const title = language === 'TH' ? doc.title_th : (doc.title_en || doc.title_th);

                                return (
                                    <a
                                        key={doc.id}
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="procurement-list-item"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '20px 25px',
                                            background: 'white',
                                            borderRadius: '16px',
                                            border: '1px solid #f1f5f9',
                                            boxShadow: 'var(--shadow-sm)',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            transition: '0.2s',
                                            cursor: 'pointer'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.borderColor = '#3b82f6';
                                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.borderColor = '#f1f5f9';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '1.5rem' }}>{getDocIcon(doc.category)}</span>
                                                {getStatusBadge(doc.status)}
                                                <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}>
                                                    {title}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                                <span>🗓️ {doc.publish_date ? new Date(doc.publish_date).toLocaleDateString('th-TH') : doc.fiscal_year || '-'}</span>
                                                {doc.category && (
                                                    <span style={{ background: '#f8fafc', padding: '2px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                                        📁 {doc.category}
                                                    </span>
                                                )}
                                                {doc.department && (
                                                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 10px', borderRadius: '6px' }}>
                                                        🏛️ {doc.department}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{
                                            background: '#FEF9C3',
                                            color: '#854D0E',
                                            padding: '10px 20px',
                                            borderRadius: '10px',
                                            fontWeight: '700',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            border: '1px solid #FEF08A',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <span>⬇️</span>
                                            <span className="hide-on-mobile">{language === 'TH' ? 'ดาวน์โหลด' : 'Download'}</span>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    )}

                    {/* Summary */}
                    {filteredDocuments.length > 0 && (
                        <div style={{ marginTop: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                            {language === 'TH'
                                ? `แสดง ${filteredDocuments.length} รายการ จากทั้งหมด ${documents.length} รายการ`
                                : `Showing ${filteredDocuments.length} of ${documents.length} documents`}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
