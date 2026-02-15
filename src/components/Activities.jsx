import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/utils/supabase';

export default function Activities() {
    const { t } = useLanguage();
    const [actItems, setActItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchActivities() {
            setLoading(true);
            const { data } = await supabase.from('activities').select('*').order('created_at', { descending: true }).limit(4);
            if (data) setActItems(data);
            setLoading(false);
        }
        fetchActivities();
    }, []);
    return (
        <section className="activities">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{t.categories.meeting} / {t.categories.sports}</h2>
                    <p className="section-subtitle">
                        {t.news_section_subtitle}
                    </p>
                    <div className="gold-line"></div>
                </div>
                <div className="activities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    {loading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="shimmer-placeholder" style={{ height: '350px', borderRadius: 'var(--radius-md)' }}></div>
                        ))
                    ) : actItems.length > 0 ? (
                        actItems.map((activity, i) => (
                            <div
                                key={activity.id}
                                className="activity-card"
                                style={{
                                    position: 'relative',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    aspectRatio: '3/4',
                                    cursor: 'pointer',
                                    backgroundColor: '#f0f0f0',
                                    transitionDelay: `${i * 0.1}s`
                                }}
                            >
                                <img
                                    src={activity.image_url}
                                    alt={activity.title}
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div className="activity-overlay" style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(180deg, transparent 30%, rgba(6, 25, 40, 0.85) 100%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: '20px'
                                }}>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>{activity.title}</h3>
                                    <span style={{ fontSize: '0.78rem', color: '#d4a853' }}>{activity.date}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            ไม่มีข้อมูลกิจกรรมในขณะนี้
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
