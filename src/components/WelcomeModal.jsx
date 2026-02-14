'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'popup_dismissed_until';

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowChecked, setDontShowChecked] = useState(false);

    useEffect(() => {
        // Check if user dismissed it within the last 24 hours
        try {
            const dismissedUntil = localStorage.getItem(STORAGE_KEY);
            if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
                return; // Still within the 24-hour window
            }
        } catch (e) {
            // localStorage unavailable
        }
        // Small delay to let the page settle before showing modal
        const timer = setTimeout(() => setIsOpen(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = useCallback(() => {
        if (dontShowChecked) {
            try {
                const twentyFourHours = 24 * 60 * 60 * 1000;
                localStorage.setItem(STORAGE_KEY, (Date.now() + twentyFourHours).toString());
            } catch (e) {
                // localStorage unavailable
            }
        }
        setIsOpen(false);
    }, [dontShowChecked]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, handleClose]);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="welcome-modal-backdrop" onClick={handleClose}>
            <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
                <button className="welcome-modal-close" onClick={handleClose} aria-label="ปิด">
                    ✕
                </button>

                <div className="welcome-modal-image">
                    <img
                        src="/popup-banner.png"
                        alt="สถิตในดวงใจไทยนิรันดร์ — สมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ พระบรมราชชนนีพันปีหลวง"
                    />
                </div>

                <div className="welcome-modal-footer">
                    <label className="welcome-modal-checkbox">
                        <input
                            type="checkbox"
                            checked={dontShowChecked}
                            onChange={(e) => setDontShowChecked(e.target.checked)}
                        />
                        <span>ไม่แสดงอีกในวันนี้</span>
                    </label>
                    <button className="welcome-modal-btn" onClick={handleClose}>
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
}
