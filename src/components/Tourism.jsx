import { tourismSpots } from '@/data/content';

const tourismImages = [
    'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
];

export default function Tourism() {
    return (
        <section className="tourism">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">ท่องเที่ยวบุรีรัมย์</h2>
                    <p className="section-subtitle">
                        สัมผัสเสน่ห์ดินแดนปราสาทหิน อารยธรรมขอม และเมืองกีฬาระดับโลก
                    </p>
                    <div className="gold-line"></div>
                </div>
                <div className="tourism-grid">
                    {tourismSpots.map((spot, i) => (
                        <div key={i} className="tourism-card animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
                            <div className="tourism-card-image">
                                <img
                                    src={tourismImages[i]}
                                    alt={spot.title}
                                    loading="lazy"
                                />
                            </div>
                            <div className="tourism-card-body">
                                <h3>{spot.title}</h3>
                                <p>{spot.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <a href="http://localhost:5174" className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>
                        เที่ยวบุรีรัมย์กัน
                    </a>
                </div>
            </div>
        </section>
    );
}
