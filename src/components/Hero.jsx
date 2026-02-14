export default function Hero() {
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
                    องค์การบริหารส่วนจังหวัด
                    <br />
                    <span className="gold">บุรีรัมย์</span>
                </h2>
                <p className="hero-description">
                    บริการประชาชนอย่างมีประสิทธิภาพ พัฒนาคุณภาพชีวิต
                    สร้างความเจริญก้าวหน้าให้จังหวัดบุรีรัมย์อย่างยั่งยืน
                </p>
                <div className="hero-buttons">
                    <a href="#services" className="btn-primary">
                        🏛️ บริการประชาชน
                    </a>
                    <a href="#news" className="btn-secondary">
                        📰 ข่าวสารล่าสุด
                    </a>
                </div>
            </div>
        </section>
    );
}

