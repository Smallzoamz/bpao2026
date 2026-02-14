import { siteConfig, departments } from '@/data/content';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>{siteConfig.name}</h3>
                        <div className="en-name">{siteConfig.nameEn}</div>
                        <p>{siteConfig.address}</p>
                        <div className="footer-contact-item">
                            📞 โทรศัพท์: {siteConfig.phone}
                        </div>
                        <div className="footer-contact-item">
                            📠 โทรสาร: {siteConfig.fax}
                        </div>
                        <div className="footer-contact-item">
                            ✉️ {siteConfig.email}
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>หน่วยงาน</h4>
                        {departments.slice(0, 6).map((dept, i) => (
                            <a key={i} href="#" className="footer-link">
                                {dept.title}
                            </a>
                        ))}
                    </div>

                    <div className="footer-section">
                        <h4>ลิงก์ที่เกี่ยวข้อง</h4>
                        <a href="#" className="footer-link">ประวัติ อบจ.บุรีรัมย์</a>
                        <a href="#" className="footer-link">ข้อมูลผู้บริหาร</a>
                        <a href="#" className="footer-link">วิสัยทัศน์และพันธกิจ</a>
                        <a href="#" className="footer-link">แผนพัฒนาท้องถิ่น</a>
                        <a href="#" className="footer-link">ข้อบัญญัติ อบจ.</a>
                        <a href="#" className="footer-link">ติดต่อเรา</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>© 2569 {siteConfig.name} สงวนลิขสิทธิ์</span>
                    <div className="footer-social">
                        <a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Email">✉️</a>
                        <a href="#" aria-label="Phone">📞</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
