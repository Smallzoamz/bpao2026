'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { newsArticles, siteConfig } from '@/data/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import ImageLightbox from '@/components/ImageLightbox';

export default function NewsClient({ newsItem, newsId }) {
    const router = useRouter();
    const [news, setNews] = useState(newsItem);
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const [viewCount, setViewCount] = useState(0);
    const [shareCount, setShareCount] = useState(0);
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareUrl(window.location.href);
        }
    }, []);

    // Track views and shares via localStorage
    useEffect(() => {
        if (!news) return;
        const viewKey = `news_views_${news.id}`;
        const shareKey = `news_shares_${news.id}`;

        // Increment view count
        const currentViews = parseInt(localStorage.getItem(viewKey) || '0', 10) + 1;
        localStorage.setItem(viewKey, currentViews.toString());
        setViewCount(currentViews);

        // Load share count
        const currentShares = parseInt(localStorage.getItem(shareKey) || '0', 10);
        setShareCount(currentShares);
    }, [news]);

    if (!news) {
        return (
            <div className="loading-state">
                <Header />
                <div className="shimmer-placeholder" style={{ height: '100vh' }}></div>
                <Footer />
            </div>
        );
    }

    return (
        <main className="page-wrapper">
            <Header />

            <section className="news-detail-hero">
                <div className="container">
                    <div className="news-meta-header">
                        <span className="news-category-badge">{news.category}</span>
                        <span className="news-date-top">📅 {news.date}</span>
                    </div>
                    <h1 className="news-title-large">{news.title}</h1>
                </div>
            </section>

            <section className="news-content-section">
                <div className="container">
                    <div className="news-layout-grid">
                        <div className="news-body-content">
                            <div className="main-featured-image">
                                <SafeImage
                                    src={news.image}
                                    alt={news.title}
                                    className="featured-img-large"
                                />
                            </div>

                            <div className="article-text">
                                {news.content.split('\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>

                            <div className="news-stats-bar">
                                <div className="news-stat">
                                    <svg className="news-stat-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    <span className="news-stat-value">ดูแล้ว {viewCount.toLocaleString()} ครั้ง</span>
                                </div>
                                <div className="news-stat-divider">|</div>
                                <div className="news-stat">
                                    <svg className="news-stat-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                                    <span className="news-stat-value">แชร์แล้ว {shareCount.toLocaleString()} ครั้ง</span>
                                </div>
                            </div>

                            {news.gallery && news.gallery.length > 0 && (
                                <div className="news-gallery-section">
                                    <h3>รูปภาพกิจกรรม</h3>
                                    <div className="gallery-grid">
                                        {news.gallery.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="gallery-item gallery-item-clickable"
                                                onClick={() => setLightboxIndex(idx)}
                                            >
                                                <SafeImage
                                                    src={img}
                                                    alt={`${news.title} ${idx + 1}`}
                                                />
                                                <div className="gallery-item-overlay">
                                                    <span>🔍</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {lightboxIndex >= 0 && news.gallery && (
                                <ImageLightbox
                                    images={news.gallery}
                                    initialIndex={lightboxIndex}
                                    onClose={() => setLightboxIndex(-1)}
                                />
                            )}

                            <div className="news-actions">
                                <button onClick={() => window.history.back()} className="btn-back">
                                    ⬅️ กลับไปหน้าหลัก
                                </button>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-share-fb"
                                    onClick={() => {
                                        const shareKey = `news_shares_${news.id}`;
                                        const newShares = parseInt(localStorage.getItem(shareKey) || '0', 10) + 1;
                                        localStorage.setItem(shareKey, newShares.toString());
                                        setShareCount(newShares);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    แชร์ไปยัง Facebook
                                </a>
                            </div>
                        </div>

                        <aside className="news-sidebar">
                            <div className="sidebar-box">
                                <h4>ข่าวล่าสุดอื่นๆ</h4>
                                <div className="side-news-list">
                                    {newsArticles.filter(n => n.id !== news.id).slice(0, 4).map(other => (
                                        <a href={`/news/${other.id}`} key={other.id} className="side-news-item">
                                            <div className="side-news-thumb">
                                                <SafeImage src={other.image} alt={other.title} />
                                            </div>
                                            <div className="side-news-info">
                                                <div className="side-news-title">{other.title}</div>
                                                <div className="side-news-date">{other.date}</div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="sidebar-box banner-box">
                                <h4>ติดต่อสอบถาม</h4>
                                <p><strong>{siteConfig.name}</strong></p>
                                <p>📞 {siteConfig.phone}</p>
                                <p>✉️ {siteConfig.email}</p>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
