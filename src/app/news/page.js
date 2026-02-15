'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AutoBanner from '@/components/AutoBanner';
import SafeImage from '@/components/SafeImage';
import { supabase } from '@/utils/supabase';
import { useLanguage } from '@/context/LanguageContext';

export default function NewsPage() {
    const { language } = useLanguage();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchNews();
    }, []);

    async function fetchNews() {
        setLoading(true);
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('publish_date', { descending: true });

        if (!error && data) {
            setNews(data);
        }
        setLoading(false);
    }

    // กรองข้อมูลตาม category และ search query
    const filteredNews = news.filter(item => {
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        const matchesSearch = !searchQuery ||
            (item.title_th && item.title_th.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.title_en && item.title_en.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // ดึง categories ที่มีอยู่
    const categories = ['All', ...new Set(news.map(n => n.category).filter(Boolean))];

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
                        title={language === 'TH' ? 'ข่าวประชาสัมพันธ์' : 'News & Announcements'}
                        subtitle={language === 'TH' ? 'องค์การบริหารส่วนจังหวัดบุรีรัมย์' : 'Buriram Provincial Administrative Organization'}
                    />

                    {/* Filter & Search */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
                            <input
                                type="text"
                                placeholder={language === 'TH' ? 'ค้นหาข่าว...' : 'Search news...'}
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
                                    {cat === 'All' ? (language === 'TH' ? 'ทุกหมวดหมู่' : 'All Categories') : cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* News Grid */}
                    {filteredNews.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                            <span style={{ fontSize: '3rem' }}>📰</span>
                            <p style={{ marginTop: '15px', fontSize: '1.1rem' }}>
                                {language === 'TH' ? 'ไม่มีข่าวในขณะนี้' : 'No news available'}
                            </p>
                        </div>
                    ) : (
                        <div className="news-grid" style={{ marginBottom: '40px' }}>
                            {filteredNews.map((item) => {
                                const title = language === 'TH' ? item.title_th : (item.title_en || item.title_th);
                                const excerpt = language === 'TH' ? item.excerpt_th : (item.excerpt_en || item.excerpt_th);

                                return (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.id}`}
                                        className="news-card"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div className="news-image">
                                            <SafeImage
                                                src={item.image_url}
                                                alt={title}
                                            />
                                            {item.category && (
                                                <div className="news-category">{item.category}</div>
                                            )}
                                        </div>
                                        <div className="news-body">
                                            <div className="news-date">
                                                <span>📅</span> {item.publish_date ? new Date(item.publish_date).toLocaleDateString(language === 'TH' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                            </div>
                                            <h3 className="news-title">{title}</h3>
                                            <p className="news-excerpt">{excerpt}</p>
                                            <span className="news-read-more">
                                                {language === 'TH' ? 'อ่านเพิ่มเติม' : 'Read More'} →
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Summary */}
                    {filteredNews.length > 0 && (
                        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                            {language === 'TH'
                                ? `แสดง ${filteredNews.length} ข่าว จากทั้งหมด ${news.length} ข่าว`
                                : `Showing ${filteredNews.length} of ${news.length} news`}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
