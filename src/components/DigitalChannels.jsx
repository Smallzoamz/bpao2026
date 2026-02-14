import { documents } from '@/data/content';

export default function DigitalChannels() {
    return (
        <section className="channels">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">ช่องทางบริการ</h2>
                    <p className="section-subtitle">
                        เข้าถึงข้อมูลและบริการต่างๆ ขององค์การบริหารส่วนจังหวัดบุรีรัมย์
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
