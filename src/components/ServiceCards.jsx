'use client';
import { useLanguage } from '@/context/LanguageContext';
import { quickServices } from '@/data/content';

export default function ServiceCards() {
    const { t } = useLanguage();

    const translatedServices = [
        {
            ...quickServices[0],
            title: t.quick_services.assistance_title,
            description: t.quick_services.assistance_desc
        },
        {
            ...quickServices[1],
            title: t.quick_services.e_service_title,
            description: t.quick_services.e_service_desc
        },
        {
            ...quickServices[2],
            title: t.quick_services.announcements_title,
            description: t.quick_services.announcements_desc
        }
    ];
    return (
        <section id="services" className="services">
            <div className="services-grid">
                {translatedServices.map((service, i) => (
                    <div key={i} className="service-card animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
                        <div className="service-icon" style={{ background: `${service.color}15` }}>
                            {service.icon}
                        </div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
