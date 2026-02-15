'use client';
import { useLanguage } from '@/context/LanguageContext';
import { siteConfig, departments } from '@/data/content';

export default function Footer() {
    const { t, language } = useLanguage();
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>{language === 'TH' ? siteConfig.name : siteConfig.nameEn}</h3>
                        <div className="en-name">{language === 'TH' ? siteConfig.nameEn : 'Buriram Provincial Administrative Organization'}</div>
                        <p>{language === 'TH' ? siteConfig.address : 'Buriram Town Hall, Jira Road, Nai Mueang, Mueang Buriram, Buriram 31000'}</p>
                        <div className="footer-contact-item">
                            📞 {language === 'TH' ? 'โทรศัพท์' : 'Tel'}: {siteConfig.phone}
                        </div>
                        <div className="footer-contact-item">
                            📠 {language === 'TH' ? 'โทรสาร' : 'Fax'}: {siteConfig.fax}
                        </div>
                        <div className="footer-contact-item">
                            ✉️ {siteConfig.email}
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>{t.nav_departments}</h4>
                        {departments.slice(0, 6).map((dept, i) => (
                            <a key={i} href="#" className="footer-link">
                                {dept.title}
                            </a>
                        ))}
                    </div>

                    <div className="footer-section">
                        <h4>{language === 'TH' ? 'ลิงก์ที่เกี่ยวข้อง' : 'Quick Links'}</h4>
                        <a href="#" className="footer-link">{language === 'TH' ? 'ประวัติ อบจ.บุรีรัมย์' : 'History of Buriram PAO'}</a>
                        <a href="#" className="footer-link">{language === 'TH' ? 'ข้อมูลผู้บริหาร' : 'Executive Information'}</a>
                        <a href="#" className="footer-link">{t.nav_vision}</a>
                        <a href="#" className="footer-link">{language === 'TH' ? 'แผนพัฒนาท้องถิ่น' : 'Local Development Plan'}</a>
                        <a href="#" className="footer-link">{language === 'TH' ? 'ข้อบัญญัติ อบจ.' : 'PAO Ordinances'}</a>
                        <a href="#" className="footer-link">{t.contact_title}</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© 2569 {language === 'TH' ? siteConfig.name : siteConfig.nameEn} {language === 'TH' ? 'สงวนลิขสิทธิ์' : 'All Rights Reserved'}</span>
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
        </footer>
    );
}
