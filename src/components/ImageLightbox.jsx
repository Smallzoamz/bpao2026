'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * ImageLightbox — Full-screen image viewer with prev/next navigation
 * @param {string[]} images - Array of image URLs
 * @param {number} initialIndex - Starting image index
 * @param {Function} onClose - Callback to close the lightbox
 */
export default function ImageLightbox({ images, initialIndex = 0, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const goNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
            else if (e.key === 'ArrowRight') goNext();
            else if (e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, goNext, goPrev]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <div className="lightbox-backdrop" onClick={onClose}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <button className="lightbox-close" onClick={onClose} aria-label="ปิด">✕</button>

                <button className="lightbox-nav lightbox-prev" onClick={goPrev} aria-label="รูปก่อนหน้า">
                    ‹
                </button>

                <div className="lightbox-image-wrapper">
                    <img
                        src={images[currentIndex]}
                        alt={`รูปภาพ ${currentIndex + 1} จาก ${images.length}`}
                    />
                </div>

                <button className="lightbox-nav lightbox-next" onClick={goNext} aria-label="รูปถัดไป">
                    ›
                </button>

                <div className="lightbox-counter">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
}
