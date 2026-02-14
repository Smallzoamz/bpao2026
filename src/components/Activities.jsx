import { activities } from '@/data/content';

const activityImages = [
    'https://images.unsplash.com/photo-1461896836934-bd45ba8fccc7?w=500&h=700&fit=crop',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&h=700&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=700&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=700&fit=crop',
];

export default function Activities() {
    return (
        <section className="activities">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">กิจกรรม</h2>
                    <p className="section-subtitle">
                        กิจกรรมล่าสุดขององค์การบริหารส่วนจังหวัดบุรีรัมย์
                    </p>
                    <div className="gold-line"></div>
                </div>
                <div className="activities-grid">
                    {activities.map((activity, i) => (
                        <div key={i} className="activity-card animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
                            <img
                                src={activityImages[i]}
                                alt={activity.title}
                                loading="lazy"
                            />
                            <div className="activity-overlay">
                                <h3>{activity.title}</h3>
                                <span>{activity.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
