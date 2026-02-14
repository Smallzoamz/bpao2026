import { quickServices } from '@/data/content';

export default function ServiceCards() {
    return (
        <section id="services" className="services">
            <div className="services-grid">
                {quickServices.map((service, i) => (
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
