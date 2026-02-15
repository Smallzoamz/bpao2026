'use client';
import { useLanguage } from '@/context/LanguageContext';
import { documents } from '@/data/content';

export default function DigitalChannels() {
    const { t } = useLanguage();
    return (
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
                        <div key={i} className="channel-card animate-on-scroll" style={{ transitionDelay: `${i * 0.05}s` }}>
                            <div className="channel-icon">{doc.icon}</div>
                            <span>{doc.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
