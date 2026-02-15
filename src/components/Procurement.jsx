'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { procurementProjects } from '@/data/content';

// Mockup budget data — per project
const projectBudgets = [
    {
        total: 18500000,
        items: [
            { name: 'ค่าวัสดุก่อสร้าง', amount: 9200000, color: '#4F8CFF' },
            { name: 'ค่าแรงงาน', amount: 5800000, color: '#E8A94D' },
            { name: 'ค่าควบคุมงาน', amount: 1850000, color: '#5DD9A8' },
            { name: 'ค่าดำเนินการ', amount: 1650000, color: '#A78BFA' },
        ]
    },
    {
        total: 22300000,
        items: [
            { name: 'ค่าวัสดุก่อสร้าง', amount: 11500000, color: '#4F8CFF' },
            { name: 'ค่าแรงงาน', amount: 6700000, color: '#E8A94D' },
            { name: 'ค่าควบคุมงาน', amount: 2230000, color: '#5DD9A8' },
            { name: 'ค่าดำเนินการ', amount: 1870000, color: '#A78BFA' },
        ]
    },
    {
        total: 15800000,
        items: [
            { name: 'ค่าวัสดุก่อสร้าง', amount: 7900000, color: '#4F8CFF' },
            { name: 'ค่าแรงงาน', amount: 4750000, color: '#E8A94D' },
            { name: 'ค่าควบคุมงาน', amount: 1580000, color: '#5DD9A8' },
            { name: 'ค่าดำเนินการ', amount: 1570000, color: '#A78BFA' },
        ]
    },
    {
        total: 19700000,
        items: [
            { name: 'ค่าวัสดุก่อสร้าง', amount: 10200000, color: '#4F8CFF' },
            { name: 'ค่าแรงงาน', amount: 5900000, color: '#E8A94D' },
            { name: 'ค่าควบคุมงาน', amount: 1970000, color: '#5DD9A8' },
            { name: 'ค่าดำเนินการ', amount: 1630000, color: '#A78BFA' },
        ]
    },
    {
        total: 16400000,
        items: [
            { name: 'ค่าวัสดุก่อสร้าง', amount: 8200000, color: '#4F8CFF' },
            { name: 'ค่าแรงงาน', amount: 4950000, color: '#E8A94D' },
            { name: 'ค่าควบคุมงาน', amount: 1640000, color: '#5DD9A8' },
            { name: 'ค่าดำเนินการ', amount: 1610000, color: '#A78BFA' },
        ]
    },
];

// Default yearly budget summary
const yearlyBudget = {
    total: 2847650000,
    items: [
        { name: 'โครงสร้างพื้นฐาน', amount: 1245800000, color: '#4F8CFF' },
        { name: 'การศึกษา', amount: 612300000, color: '#E8A94D' },
        { name: 'สาธารณสุข', amount: 438500000, color: '#5DD9A8' },
        { name: 'สวัสดิการสังคม', amount: 325100000, color: '#FF7A8A' },
        { name: 'บริหารทั่วไป', amount: 225950000, color: '#A78BFA' },
    ]
};

// Animated counter hook
function useAnimatedNumber(target, duration = 1200) {
    const [display, setDisplay] = useState(0);
    const rafRef = useRef(null);
    const startRef = useRef(null);
    const fromRef = useRef(0);

    useEffect(() => {
        fromRef.current = display;
        startRef.current = null;

        const animate = (timestamp) => {
            if (!startRef.current) startRef.current = timestamp;
            const elapsed = timestamp - startRef.current;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.round(fromRef.current + (target - fromRef.current) * eased);
            setDisplay(current);
            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, duration]);

    return display;
}

function AnimatedAmount({ value, prefix = '฿ ' }) {
    const animated = useAnimatedNumber(value);
    return <>{prefix}{animated.toLocaleString()}</>;
}

export default function Procurement() {
    const { t, language } = useLanguage();
    const [selectedIdx, setSelectedIdx] = useState(-1); // -1 = show yearly

    const activeBudget = selectedIdx >= 0 ? projectBudgets[selectedIdx] : yearlyBudget;
    const maxAmount = Math.max(...activeBudget.items.map(i => i.amount));

    const handleProjectClick = useCallback((idx) => {
        setSelectedIdx(prev => prev === idx ? -1 : idx);
    }, []);

    return (
        <section className="procurement">
            <div className="container">
                <div className="procurement-content">
                    <div className="procurement-text animate-on-scroll">
                        <h3>{t.procurement_title}</h3>
                        <p>
                            {t.procurement_subtitle}
                        </p>
                        <div className="procurement-list">
                            {procurementProjects.map((project, i) => (
                                <div
                                    key={i}
                                    className={`procurement-list-item ${selectedIdx === i ? 'procurement-item-active' : ''}`}
                                    onClick={() => handleProjectClick(i)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="status-badge">{language === 'TH' ? 'เชิญชวน' : 'Announced'}</span>
                                    {project.title}
                                </div>
                            ))}
                        </div>
                        <a href="/projects" className="btn-outline-gold" style={{ marginTop: '24px', display: 'inline-block' }}>
                            📂 {language === 'TH' ? 'ดูรายงานโครงการทั้งหมด' : 'View All Projects'}
                        </a>
                    </div>
                    <div className="procurement-visual animate-on-scroll animate-delay-2">
                        <div className="budget-card">
                            <div className="budget-header">
                                <div className="budget-header-icon">
                                    {selectedIdx >= 0 ? '🔍' : '📊'}
                                </div>
                                <div>
                                    <h4>{selectedIdx >= 0 ? (language === 'TH' ? 'งบประมาณโครงการ' : 'Project Budget') : (language === 'TH' ? 'รายละเอียดงบประมาณ' : 'Budget Details')}</h4>
                                    <span className="budget-fiscal">
                                        {selectedIdx >= 0
                                            ? procurementProjects[selectedIdx].title
                                            : (language === 'TH' ? 'ประจำปีงบประมาณ พ.ศ. 2568' : 'Fiscal Year 2025')
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="budget-total">
                                <span className="budget-total-label">
                                    {selectedIdx >= 0 ? (language === 'TH' ? 'วงเงินงบประมาณ' : 'Approved Budget') : (language === 'TH' ? 'งบประมาณรวมทั้งสิ้น' : 'Total Annual Budget')}
                                </span>
                                <span className="budget-total-value">
                                    <AnimatedAmount value={activeBudget.total} />
                                </span>
                            </div>

                            <div className="budget-breakdown">
                                {activeBudget.items.map((item, idx) => (
                                    <div className="budget-item" key={idx}>
                                        <div className="budget-item-head">
                                            <span className="budget-dot" style={{ background: item.color }}></span>
                                            <span className="budget-item-name">{item.name}</span>
                                            <span className="budget-item-amount">
                                                <AnimatedAmount value={item.amount} />
                                            </span>
                                        </div>
                                        <div className="budget-bar">
                                            <div
                                                className="budget-bar-fill"
                                                style={{
                                                    width: `${(item.amount / maxAmount) * 100}%`,
                                                    background: item.color,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="budget-footer">
                                {selectedIdx >= 0 ? (
                                    <button className="budget-link" onClick={() => setSelectedIdx(-1)}>
                                        ← {language === 'TH' ? 'กลับดูงบประมาณรวมทั้งปี' : 'Back to Annual Budget'}
                                    </button>
                                ) : (
                                    <a href="#" className="budget-link">📄 {language === 'TH' ? 'ดูรายละเอียดทั้งหมด' : 'View Full Details'} →</a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
