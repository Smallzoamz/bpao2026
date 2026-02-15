'use client';
import { useLanguage } from '@/context/LanguageContext';
import { newsArticles, procurementProjects } from '@/data/content';

/**
 * AnnouncementBar — Scrolling marquee above Hero section
 * Uses real data from news articles and procurement projects
 */
export default function AnnouncementBar() {
    const { t, language } = useLanguage();
    // Build announcement items from real data
    const items = [
        ...newsArticles.slice(0, 4).map((n) => `📰 ${n.title}`),
        ...procurementProjects.slice(0, 2).map((p) => `📢 ${p.title}`),
    ];

    // Duplicate for seamless loop
    const marqueeContent = [...items, ...items];

    return (
        <div className="announcement-bar">
            <div className="announcement-label">
                <span className="announcement-label-icon">📣</span>
                <span>{language === 'TH' ? 'ประกาศ' : 'News'}</span>
            </div>
            <div className="announcement-track">
                <div className="announcement-scroll">
                    {marqueeContent.map((text, i) => (
                        <span key={i} className="announcement-item">
                            {text}
                            <span className="announcement-divider">|</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
