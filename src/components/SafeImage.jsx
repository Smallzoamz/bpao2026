'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Global cache to prevent re-requesting failed URLs in the same session
const failedUrls = new Set();

/**
 * SafeImage Component
 * Handles image loading with a strict fail-safe to prevent server spamming.
 * Uses a Global Cache to ensure each URL is tried only once.
 * Includes cache-aware mounting and timeout fail-safe.
 */
export default function SafeImage({ src, alt, className, fallback = 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1000' }) {
    const [imgSrc, setImgSrc] = useState(() => {
        // If the src is already known to fail, use fallback immediately
        if (failedUrls.has(src)) return fallback;
        return src;
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const [status, setStatus] = useState(() => {
        if (failedUrls.has(src)) return 'error';
        return 'loading';
    });

    const imgRef = useRef(null);
    const timeoutRef = useRef(null);

    // Check if image is already complete (cached) after mount
    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth > 0 && status === 'loading') {
            setIsLoaded(true);
            setStatus('success');
        }

        // Timeout fail-safe: hide shimmer after 5 seconds no matter what
        timeoutRef.current = setTimeout(() => {
            setIsLoaded((prev) => {
                if (!prev) {
                    // Force show whatever we have
                    return true;
                }
                return prev;
            });
        }, 5000);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [imgSrc, status]);

    // Handle src prop changes
    useEffect(() => {
        if (failedUrls.has(src)) {
            setImgSrc(fallback);
            setStatus('error');
        } else {
            setImgSrc(src);
            setStatus('loading');
            setIsLoaded(false);
        }
    }, [src, fallback]);

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
        setStatus('success');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    const handleError = useCallback(() => {
        if (status === 'loading') {
            console.warn(`[SafeImage] Failed to load: ${imgSrc}. Switching to fallback.`);
            failedUrls.add(imgSrc);
            setImgSrc(fallback);
            setStatus('error');
        } else if (status === 'error') {
            // Even the fallback failed — stop everything
            console.error(`[SafeImage] Critical: Fallback also failed.`);
            setStatus('blocked');
        }
    }, [status, imgSrc, fallback]);

    return (
        <div
            className={`safe-image-container ${className || ''}`}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: status === 'blocked' ? '#fdecea' : '#f0f0f0'
            }}
        >
            {status !== 'blocked' ? (
                <img
                    ref={imgRef}
                    src={imgSrc}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                        zIndex: 1,
                        display: 'block'
                    }}
                />
            ) : (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    color: '#d32f2f',
                    textAlign: 'center',
                    padding: '10px',
                    backgroundColor: '#fff1f0'
                }}>
                    <span style={{ fontSize: '1.2rem', marginBottom: '4px' }}>⚠️</span>
                    <span>Image Offline</span>
                </div>
            )}

            {/* Shimmer Placeholder — disappears when loaded or timed out */}
            {!isLoaded && status !== 'blocked' && (
                <div className="shimmer-placeholder" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 2
                }}></div>
            )}
        </div>
    );
}
