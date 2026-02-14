'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    newsArticles,
    activities,
    tourismSpots,
    procurementProjects,
    quickServices,
    aboutInfo,
    documents,
    departments,
} from '@/data/content';

/**
 * SearchOverlay — Full-screen search overlay with live filtering
 * Searches through all content in content.js
 */

// Category icons for result grouping
const CATEGORY_META = {
    news: { label: 'ข่าวสาร', icon: '📰', color: '#29409D' },
    activities: { label: 'กิจกรรม', icon: '🎪', color: '#E8A94D' },
    tourism: { label: 'ท่องเที่ยว', icon: '🏛️', color: '#1A8F5C' },
    procurement: { label: 'จัดซื้อจัดจ้าง', icon: '📢', color: '#D4380D' },
    services: { label: 'บริการ', icon: '💡', color: '#7C3AED' },
    departments: { label: 'ส่วนราชการ', icon: '🏢', color: '#0369A1' },
    documents: { label: 'เอกสาร', icon: '📄', color: '#6B7280' },
    about: { label: 'เกี่ยวกับ อบจ.', icon: '📜', color: '#92400E' },
};

// Build a flat searchable index from all content
function buildSearchIndex() {
    const index = [];

    newsArticles.forEach((item) => {
        index.push({
            category: 'news',
            title: item.title,
            excerpt: item.excerpt,
            date: item.date,
            href: `/news/${item.id}`,
        });
    });

    activities.forEach((item) => {
        index.push({
            category: 'activities',
            title: item.title,
            excerpt: item.date,
            href: '/#news',
        });
    });

    tourismSpots.forEach((item) => {
        index.push({
            category: 'tourism',
            title: item.title,
            excerpt: item.description,
            href: '/#tourism',
        });
    });

    procurementProjects.forEach((item) => {
        index.push({
            category: 'procurement',
            title: item.title,
            excerpt: item.status,
            href: '/#procurement',
        });
    });

    quickServices.forEach((item) => {
        index.push({
            category: 'services',
            title: item.title,
            excerpt: item.description,
            href: '/#services',
        });
    });

    departments.forEach((item) => {
        index.push({
            category: 'departments',
            title: item.title,
            excerpt: '',
            href: '#departments',
        });
    });

    documents.forEach((item) => {
        index.push({
            category: 'documents',
            title: item.title,
            excerpt: '',
            href: '#announcements',
        });
    });

    aboutInfo.forEach((item) => {
        index.push({
            category: 'about',
            title: item.title,
            excerpt: '',
            href: '#structure',
        });
    });

    return index;
}

const searchIndex = buildSearchIndex();

function searchContent(query) {
    if (!query || query.trim().length < 1) return [];

    const q = query.trim().toLowerCase();
    const results = searchIndex.filter((item) => {
        return (
            item.title.toLowerCase().includes(q) ||
            (item.excerpt && item.excerpt.toLowerCase().includes(q))
        );
    });

    return results.slice(0, 12); // Limit to 12 results
}

// Group results by category
function groupResults(results) {
    const groups = {};
    results.forEach((r) => {
        if (!groups[r.category]) groups[r.category] = [];
        groups[r.category].push(r);
    });
    return groups;
}

export default function SearchOverlay({ isOpen, onClose, initialQuery = '' }) {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
        if (!isOpen) {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        setResults(searchContent(query));
    }, [query]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const groupedResults = groupResults(results);
    const hasResults = results.length > 0;
    const hasQuery = query.trim().length > 0;

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-overlay-inner" onClick={(e) => e.stopPropagation()}>
                {/* Search Input */}
                <div className="search-overlay-header">
                    <div className="search-overlay-input-wrap">
                        <span className="search-overlay-icon">🔍</span>
                        <input
                            ref={inputRef}
                            type="text"
                            className="search-overlay-input"
                            placeholder="ค้นหาข่าวสาร, กิจกรรม, ท่องเที่ยว, จัดซื้อจัดจ้าง..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoComplete="off"
                        />
                        {query && (
                            <button
                                className="search-overlay-clear"
                                onClick={() => setQuery('')}
                            >✕</button>
                        )}
                    </div>
                    <button className="search-overlay-close" onClick={onClose}>
                        ปิด
                    </button>
                </div>

                {/* Results */}
                <div className="search-overlay-results">
                    {!hasQuery && (
                        <div className="search-overlay-hint">
                            <span className="hint-icon">💡</span>
                            <p>พิมพ์คำค้นหาเพื่อค้นหาข้อมูลทั้งหมดของ อบจ.บุรีรัมย์</p>
                            <div className="search-suggestions">
                                {['กีฬา', 'ปราสาท', 'ถนน', 'เลือกตั้ง', 'ผู้สูงอายุ'].map((s) => (
                                    <button
                                        key={s}
                                        className="search-suggestion-chip"
                                        onClick={() => setQuery(s)}
                                    >{s}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasQuery && !hasResults && (
                        <div className="search-overlay-empty">
                            <span className="empty-icon">🔎</span>
                            <p>ไม่พบผลลัพธ์สำหรับ &quot;{query}&quot;</p>
                            <span className="empty-sub">ลองใช้คำค้นหาอื่น</span>
                        </div>
                    )}

                    {hasQuery && hasResults && (
                        <div className="search-results-list">
                            {Object.entries(groupedResults).map(([cat, items]) => {
                                const meta = CATEGORY_META[cat];
                                return (
                                    <div key={cat} className="search-result-group">
                                        <div className="search-group-header">
                                            <span className="search-group-icon">{meta.icon}</span>
                                            <span className="search-group-label" style={{ color: meta.color }}>{meta.label}</span>
                                            <span className="search-group-count">{items.length}</span>
                                        </div>
                                        {items.map((item, idx) => (
                                            <Link
                                                key={idx}
                                                href={item.href}
                                                className="search-result-item"
                                                onClick={onClose}
                                            >
                                                <div className="search-result-content">
                                                    <span className="search-result-title">{highlightMatch(item.title, query)}</span>
                                                    {item.excerpt && (
                                                        <span className="search-result-excerpt">{highlightMatch(item.excerpt, query)}</span>
                                                    )}
                                                </div>
                                                <span className="search-result-arrow">→</span>
                                            </Link>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="search-overlay-footer">
                    <span>กด <kbd>ESC</kbd> เพื่อปิด</span>
                    {hasResults && <span>{results.length} ผลลัพธ์</span>}
                </div>
            </div>
        </div>
    );
}

/** Highlight matching text */
function highlightMatch(text, query) {
    if (!query || !text) return text;
    const q = query.trim().toLowerCase();
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;

    return (
        <>
            {text.slice(0, idx)}
            <mark className="search-highlight">{text.slice(idx, idx + q.length)}</mark>
            {text.slice(idx + q.length)}
        </>
    );
}
