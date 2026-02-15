import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/utils/supabase';

import SafeImage from './SafeImage';

export default function NewsSection() {
    const { t } = useLanguage();
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            setLoading(true);
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('publish_date', { descending: true })
                .limit(6);

            if (data) setNewsItems(data);
            setLoading(false);
        }
        fetchNews();
    }, []);

    // Simple mapping for categories - in a real app this would come from the data
    const getTranslatedCategory = (cat) => {
        if (cat === "กีฬา") return t.categories.sports;
        if (cat === "พัฒนาสังคม") return t.categories.social;
        if (cat === "การเลือกตั้ง") return t.categories.election;
        if (cat === "การประชุม") return t.categories.meeting;
        if (cat === "กองทุนฟื้นฟู") return t.categories.fund;
        return cat;
    };
    return (
        <section className="section news" id="news">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{t.news_section_title}</h2>
                    <p className="section-subtitle">
                        {t.news_section_subtitle}
                    </p>
                    <div className="gold-line"></div>
                </div>

                <div className="news-grid">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="shimmer-placeholder" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }}></div>
                        ))
                    ) : newsItems.length > 0 ? (
                        newsItems.map((news, i) => (
                            <Link
                                href={`/news/${news.id}`}
                                key={news.id}
                                className="news-card"
                                style={{ animationDelay: `${i * 0.1}s`, textDecoration: 'none' }}
                            >
                                <div className="news-card-image">
                                    <SafeImage
                                        src={news.image_url}
                                        alt={news.title_th}
                                        className="news-img-fixed"
                                    />
                                    <div className="news-category-badge-floating">{getTranslatedCategory(news.category)}</div>
                                </div>
                                <div className="news-card-content">
                                    <div className="news-date-row">
                                        <span className="icon-calendar">📅</span> {new Date(news.publish_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                    <h3 className="news-card-title">{news.title_th}</h3>
                                    <p className="news-card-excerpt">{news.excerpt_th}</p>
                                    <span className="read-more-link">{t.read_more} →</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            ไม่มีข้อมูลข่าวสารในขณะนี้
                        </div>
                    )}
                </div>

                <div className="section-footer-center">
                    <Link href="#" className="btn-secondary-dark">{t.view_all}</Link>
                </div>
            </div>
        </section>
    );
}
