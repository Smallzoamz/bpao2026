import Link from 'next/link';
import { newsArticles } from '@/data/content';

import SafeImage from './SafeImage';

export default function NewsSection() {
    return (
        <section className="section news" id="news">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">ข่าวสารและประกาศ</h2>
                    <p className="section-subtitle">
                        ติดตามข่าวประชาสัมพันธ์ กิจกรรม และประกาศจาก อบจ.บุรีรัมย์
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
                                <div className="news-category-badge-floating">{news.category}</div>
                            </div>
                            <div className="news-card-content">
                                <div className="news-date-row">
                                    <span className="icon-calendar">📅</span> {news.date}
                                </div>
                                <h3 className="news-card-title">{news.title}</h3>
                                <p className="news-card-excerpt">{news.excerpt}</p>
                                <span className="read-more-link">อ่านเพิ่มเติม →</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="section-footer-center">
                    <Link href="#" className="btn-secondary-dark">ดูข่าวทั้งหมด</Link>
                </div>
            </div>
        </section>
    );
}
