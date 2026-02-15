'use client';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { documents } from '@/data/content';

export default function DigitalChannels() {
    const { t } = useLanguage();
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState('');

    const handleServiceClick = (title) => {
        setSelectedService(title);
        setShowModal(true);
    };

    return (
        <>
            <section className="channels">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{t.quick_services_title}</h2>
                        <p className="section-subtitle">
                            {t.news_section_subtitle}
                        </p>
                        <div className="gold-line"></div>
                    </div>
                    <div className="channels-grid">
                        {documents.map((doc, i) => (
                            <div
                                key={i}
                                className="channel-card animate-on-scroll"
                                style={{ transitionDelay: `${i * 0.05}s`, cursor: 'pointer' }}
                                onClick={() => handleServiceClick(doc.title)}
                            >
                                <div className="channel-icon">{doc.icon}</div>
                                <span>{doc.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Development Modal */}
            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '20px'
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '40px',
                            maxWidth: '400px',
                            width: '100%',
                            textAlign: 'center',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚧</div>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#1e3a5f',
                            marginBottom: '10px'
                        }}>
                            {selectedService}
                        </h3>
                        <p style={{
                            fontSize: '18px',
                            color: '#666',
                            marginBottom: '24px'
                        }}>
                            อยู่ระหว่างการพัฒนา
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                backgroundColor: '#c9a227',
                                color: '#fff',
                                border: 'none',
                                padding: '12px 32px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
