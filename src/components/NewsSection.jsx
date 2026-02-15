'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { newsArticles } from '@/data/content';

import SafeImage from './SafeImage';

export default function NewsSection() {
    const { t } = useLanguage();

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
                    {newsArticles.slice(0, 6).map((news, i) => (
                        <Link
                            href={`/news/${news.id}`}
                            key={news.id}
                            className="news-card"
                            style={{ animationDelay: `${i * 0.1}s`, textDecoration: 'none' }}
                        >
                            <div className="news-card-image">
                                <SafeImage
                                    src={news.image}
                                    alt={news.title}
                                    className="news-img-fixed"
                                />
                                <div className="news-category-badge-floating">{getTranslatedCategory(news.category)}</div>
                            </div>
                            <div className="news-card-content">
                                <div className="news-date-row">
                                    <span className="icon-calendar">📅</span> {news.date}
                                </div>
                                <h3 className="news-card-title">{news.title}</h3>
                                <p className="news-card-excerpt">{news.excerpt}</p>
                                <span className="read-more-link">{t.read_more} →</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="section-footer-center">
                    <Link href="#" className="btn-secondary-dark">{t.view_all}</Link>
                </div>
            </div>
        </section>
    );
}
