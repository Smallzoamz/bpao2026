'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();
    return (
        <section className="hero">
            <div className="hero-bg-pattern"></div>
            <div className="hero-bg-image"></div>
            <div className="hero-particles">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="particle"></div>
                ))}
            </div>
            <div className="hero-content">
                <h2 className="hero-title">
                    {t.nav_structure.split(' ')[0]}
                    <br />
                    <span className="gold">บุรีรัมย์</span>
                </h2>
                <p className="hero-description">
                    {t.hero_subtitle}
                </p>
                <div className="hero-buttons">
                    <a href="#services" className="btn-primary">
                        🏛️ {t.nav_assistance}
                    </a>
                    <a href="#news" className="btn-secondary">
                        📰 {t.nav_announcements}
                    </a>
                </div>
            </div>
        </section>
    );
}

