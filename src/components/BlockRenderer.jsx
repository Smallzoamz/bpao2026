'use client';

import SafeImage from './SafeImage';
import OrgChart from './OrgChart';
import { useLanguage } from '@/context/LanguageContext';

const BannerBlock = ({ content }) => {
    const { language } = useLanguage();
    return (
        <div className="section-header" style={{
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${content.bg_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '60px 20px',
            borderRadius: 'var(--radius-lg)',
            color: 'white',
            marginBottom: '40px',
            textAlign: 'center' // Centering content for better logo look
        }}>
            {content.logo_url && (
                <img
                    src={content.logo_url}
                    alt="Logo"
                    style={{
                        maxHeight: '80px',
                        marginBottom: '20px',
                        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                    }}
                />
            )}
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>{language === 'TH' ? content.title_th : content.title_en}</h2>
            {content.subtitle_th && (
                <p style={{ opacity: 0.9, marginTop: '10px' }}>{language === 'TH' ? content.subtitle_th : content.subtitle_en}</p>
            )}
            <div className="gold-line" style={{ margin: '20px auto 0' }}></div>
        </div>
    );
};

const RichTextBlock = ({ content }) => {
    const { language } = useLanguage();
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto 40px', lineHeight: '1.8', fontSize: '1.1rem' }}>
            <div dangerouslySetInnerHTML={{ __html: language === 'TH' ? content.html_th : content.html_en }} />
        </div>
    );
};

const PersonGridBlock = ({ content, personnel = [] }) => {
    const { language } = useLanguage();

    // ตรวจสอบว่ามีข้อมูล hierarchy หรือไม่
    const hasHierarchy = personnel.some(p => p.parent_id);

    // ถ้ามี hierarchy ให้ใช้ OrgChart component
    if (hasHierarchy) {
        return <OrgChart personnel={personnel} content={content} />;
    }

    // ถ้าไม่มี hierarchy ให้แสดงแบบ grid เดิม
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            {personnel.map((person) => (
                <div key={person.id} className="service-card" style={{ textAlign: 'center' }}>
                    <div style={{ width: '150px', height: '180px', margin: '0 auto 20px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <SafeImage src={person.photo_url} alt={person.name_th} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h4 style={{ fontWeight: '700' }}>{language === 'TH' ? person.name_th : person.name_en}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{language === 'TH' ? person.position_th : person.position_en}</p>
                    {person.phone && <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>📞 {person.phone}</p>}
                </div>
            ))}
        </div>
    );
};

const DocListBlock = ({ content, docs = [] }) => {
    const { language } = useLanguage();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
            {docs.map((doc) => {
                const isProcurement = doc.status && doc.status !== 'ประกาศทั่วไป';
                const fileUrl = doc.file_url || doc.pdf_url;

                return (
                    <a key={doc.id} href={fileUrl} target="_blank" rel="noopener noreferrer" className="procurement-list-item" style={{
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                {isProcurement && <span style={{ fontSize: '0.7rem', background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '100px', fontWeight: '800' }}>{doc.status}</span>}
                                <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}>{language === 'TH' ? doc.title_th : doc.title_en}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                                <span>🗓️ {doc.publish_date ? new Date(doc.publish_date).toLocaleDateString('th-TH') : doc.fiscal_year}</span>
                                {doc.budget > 0 && <span style={{ color: '#059669', fontWeight: '700' }}>💰 ฿ {doc.budget.toLocaleString()}</span>}
                                {doc.category && <span style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>📁 {doc.category}</span>}
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
                            <span className="hide-on-mobile">ดาวน์โหลด</span>
                        </div>
                    </a>
                );
            })}
        </div>
    );
};

// News Grid Block
const NewsGridBlock = ({ content, news = [] }) => {
    const { language } = useLanguage();

    // Fallback if no news provided
    if (!news || news.length === 0) {
        return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>{language === 'TH' ? 'ไม่มีข้อมูลข่าวสาร' : 'No news available'}</div>;
    }

    return (
        <div className="news-grid" style={{ marginBottom: '40px' }}>
            {news.map((item) => (
                <a key={item.id} href={`/news/${item.id}`} className="news-card" style={{ textDecoration: 'none' }}>
                    <div className="news-image">
                        <SafeImage src={item.image_url} alt={language === 'TH' ? item.title_th : item.title_en} />
                        {item.category && <div className="news-category">{item.category}</div>}
                    </div>
                    <div className="news-body">
                        <div className="news-date">
                            <span>📅</span> {new Date(item.publish_date).toLocaleDateString(language === 'TH' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <h3 className="news-title">{language === 'TH' ? item.title_th : (item.title_en || item.title_th)}</h3>
                        <p className="news-excerpt">{language === 'TH' ? item.excerpt_th : (item.excerpt_en || item.excerpt_th)}</p>
                        <span className="news-read-more">{language === 'TH' ? 'อ่านเพิ่มเติม' : 'Read More'} →</span>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default function BlockRenderer({ block, extraData = {} }) {
    switch (block.block_type) {
        case 'banner': return <BannerBlock content={block.content} />;
        case 'rich_text': return <RichTextBlock content={block.content} />;
        case 'person_grid': return <PersonGridBlock content={block.content} personnel={extraData.personnel} />;
        case 'org_chart': return <OrgChart personnel={extraData.personnel} content={block.content} />;
        case 'doc_list': return <DocListBlock content={block.content} docs={extraData.docs} />;
        case 'news_grid': return <NewsGridBlock content={block.content} news={extraData.news} />;
        default: return <div style={{ padding: '20px', background: '#f5f5f5' }}>Unknown Block Type: {block.block_type}</div>;
    }
}
