'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Show banner with a slight delay
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-consent-wrapper">
            <div className="cookie-consent-card">
                <div className="cookie-consent-content">
                    <div className="cookie-consent-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                            <path d="M8.5 8.5v.01" />
                            <path d="M16 15.5v.01" />
                            <path d="M12 12v.01" />
                            <path d="M11 17v.01" />
                            <path d="M7 14v.01" />
                        </svg>
                    </div>
                    <div className="cookie-consent-text">
                        <h3>การใช้คุกกี้ (Cookie Consent)</h3>
                        <p>
                            เราใช้คุกกี้เพื่อมอบประสบการณ์การใช้งานที่ดีที่สุดบนเว็บไซต์ของเรา สำหรับข้อมูลเพิ่มเติมโปรดอ่าน
                            <span className="cookie-policy-link"> นโยบายความเป็นส่วนตัว</span> ของเรา
                        </p>
                        <p className="cookie-en-msg">
                            We use cookies to improve your experience. By using our site, you agree to our use of cookies.
                        </p>
                    </div>
                </div>
                <div className="cookie-consent-actions">
                    <button className="cookie-btn-decline" onClick={handleDecline}>
                        ปฏิเสธ / Decline
                    </button>
                    <button className="cookie-btn-accept" onClick={handleAccept}>
                        ยอมรับทั้งหมด / Accept All
                    </button>
                </div>
            </div>
        </div>
    );
}
