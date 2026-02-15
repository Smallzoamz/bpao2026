'use client';

import { useLanguage } from '@/context/LanguageContext';

const AutoBanner = ({ title, subtitle, bgUrl }) => {
    const { language } = useLanguage();

    // Default background if none provided
    const backgroundUrl = bgUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop';

    return (
        <div className="section-header" style={{
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '80px 20px',
            borderRadius: 'var(--radius-lg)',
            color: 'white',
            marginBottom: '40px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'relative', zIndex: 2 }}>

                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    marginBottom: subtitle ? '10px' : '0'
                }}>
                    {title}
                </h2>
                {subtitle && (
                    <p style={{
                        opacity: 0.9,
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '10px auto 0',
                        fontWeight: '300'
                    }}>
                        {subtitle}
                    </p>
                )}
                <div className="gold-line" style={{ margin: '25px auto 0', width: '80px', height: '4px' }}></div>
            </div>
        </div>
    );
};

export default AutoBanner;
