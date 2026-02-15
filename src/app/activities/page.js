'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AutoBanner from '@/components/AutoBanner';
import { supabase } from '@/utils/supabase';
import { useLanguage } from '@/context/LanguageContext';

export default function ActivitiesPage() {
    const { language } = useLanguage();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchActivities();
    }, []);

    async function fetchActivities() {
        setLoading(true);
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .order('date', { ascending: false });

        if (!error && data) {
            setActivities(data);
        }
        setLoading(false);
    }

    // กรองข้อมูลตาม search query
    const filteredActivities = activities.filter(item => {
        const matchesSearch = !searchQuery ||
            (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

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
                        title={language === 'TH' ? 'การประชุม / กีฬา' : 'Meetings / Sports'}
                        subtitle={language === 'TH' ? 'องค์การบริหารส่วนจังหวัดบุรีรัมย์' : 'Buriram Provincial Administrative Organization'}
                    />

                    {/* Search */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
                            <input
                                type="text"
                                placeholder={language === 'TH' ? 'ค้นหากิจกรรม...' : 'Search activities...'}
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
                    </div>

                    {/* Activities Grid */}
                    {filteredActivities.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                            <span style={{ fontSize: '3rem' }}>📅</span>
                            <p style={{ marginTop: '15px', fontSize: '1.1rem' }}>
                                {language === 'TH' ? 'ไม่มีกิจกรรมในขณะนี้' : 'No activities available'}
                            </p>
                        </div>
                    ) : (
                        <div className="activities-grid" style={{ marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                            {filteredActivities.map((activity, i) => (
                                <div
                                    key={activity.id}
                                    className="activity-card"
                                    style={{
                                        position: 'relative',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        aspectRatio: '3/4',
                                        cursor: 'pointer',
                                        backgroundColor: '#f0f0f0'
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
                                        <span style={{ fontSize: '0.78rem', color: '#d4a853' }}>
                                            {activity.date
                                                ? new Date(activity.date).toLocaleDateString(
                                                    language === 'TH' ? 'th-TH' : 'en-US',
                                                    { day: 'numeric', month: 'short', year: 'numeric' }
                                                )
                                                : '-'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Summary */}
                    {filteredActivities.length > 0 && (
                        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                            {language === 'TH'
                                ? `แสดง ${filteredActivities.length} กิจกรรม จากทั้งหมด ${activities.length} กิจกรรม`
                                : `Showing ${filteredActivities.length} of ${activities.length} activities`}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
