'use client';

import { useState, useEffect } from 'react';
import { navigation, siteConfig } from '@/data/content';
import SearchOverlay from './SearchOverlay';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [overlayOpen, setOverlayOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [mobileOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        setOverlayOpen(true);
        setSearchOpen(false);
    };

    const openSearchOverlay = () => {
        setOverlayOpen(true);
        setSearchOpen(false);
        setMobileOpen(false);
    };

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            {/* Top Bar: Logo, Search, Actions */}
            <div className="header-top">
                <div className="container header-top-inner">
                    <a href="/" className="header-logo">
                        <img
                            src="/logo.png"
                            alt="อบจ.บุรีรัมย์"
                            className="logo-img"
                        />
                        <div className="logo-text">
                            <h1>{siteConfig.shortName}</h1>
                            <span>{siteConfig.nameEn}</span>
                        </div>
                    </a>

                    <div className="header-actions">
                        <button
                            className="search-toggle"
                            onClick={openSearchOverlay}
                            aria-label="เปิดค้นหา"
                        >
                            🔍
                        </button>

                        <a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer" className="fb-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>

                        <button
                            className="mobile-toggle"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Bar: Main Menu */}
            <nav className="header-nav">
                <div className="container header-nav-inner">
                    <div className="nav-desktop">
                        {navigation.map((item, i) => (
                            <div key={i} className={`nav-item ${i === 0 ? 'nav-item-active' : ''}`}>
                                <a href={item.href}>{item.title}</a>
                                {item.children && (
                                    <div className="nav-dropdown">
                                        {item.children.map((child, j) => (
                                            <a key={j} href={child.href} className="nav-dropdown-item">
                                                {child.title}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${mobileOpen ? 'active' : ''}`}>
                <button className="mobile-search-btn" onClick={openSearchOverlay}>
                    🔍 ค้นหาข้อมูล...
                </button>
                {navigation.map((item, i) => (
                    <div key={i}>
                        <a
                            href={item.href}
                            className="mobile-nav-item"
                            onClick={() => setMobileOpen(false)}
                        >
                            {item.title}
                        </a>
                        {item.children && (
                            <div className="mobile-nav-children">
                                {item.children.map((child, j) => (
                                    <a
                                        key={j}
                                        href={child.href}
                                        className="mobile-nav-child"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {child.title}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <SearchOverlay
                isOpen={overlayOpen}
                onClose={() => setOverlayOpen(false)}
            />
        </header>
    );
}
