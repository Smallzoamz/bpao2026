'use client';

import Link from 'next/link';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/utils/supabase';

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
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [budgetStats, setBudgetStats] = useState([]);
    const [totalBudget, setTotalBudget] = useState(0);
    const [currentYear, setCurrentYear] = useState('2568'); // Default fallback

    const getColorForCategory = (index) => {
        const colors = ['#3B82F6', '#EAB308', '#22C55E', '#EC4899', '#8B5CF6', '#64748B'];
        return colors[index % colors.length];
    };

    useEffect(() => {
        const fetchProcurementStats = async () => {
            try {
                // 1. Get current year from DB or use default
                // For now, let's look for the latest year with data
                const { data: years } = await supabase
                    .from('procurement')
                    .select('fiscal_year')
                    .order('fiscal_year', { descending: true })
                    .limit(1);

                const activeYear = years?.[0]?.fiscal_year || '2568';
                setCurrentYear(activeYear);

                // 2. Fetch all projects for this year
                const { data: projects } = await supabase
                    .from('procurement')
                    .select('budget, category')
                    .eq('fiscal_year', activeYear);

                const { data: docs } = await supabase
                    .from('documents')
                    .select('budget, category')
                    .eq('fiscal_year', activeYear)
                    .or('display_target.eq.procurement,category.eq.ประกาศจัดซื้อจัดจ้าง');

                const allData = [...(projects || []), ...(docs || [])];

                // 3. Calculate Totals and Breakdown
                const total = allData.reduce((sum, item) => sum + (item.budget || 0), 0);
                setTotalBudget(total);

                // Group by Category
                const categoryMap = {};
                allData.forEach(item => {
                    const cat = item.category || 'อื่นๆ';
                    if (!categoryMap[cat]) categoryMap[cat] = 0;
                    categoryMap[cat] += (item.budget || 0);
                });

                // Convert to array and sort by value
                const stats = Object.keys(categoryMap)
                    .map((cat, index) => ({
                        id: index,
                        label: cat,
                        value: categoryMap[cat],
                        color: getColorForCategory(index)
                    }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5); // Top 5 categories

                setBudgetStats(stats);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
            setLoading(false);
        };

        fetchProcurementStats();
    }, []);

    return (
        <section style={{ padding: '80px 0', background: 'white' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

                    {/* Text Content */}
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '20px' }}>
                            การจัดซื้อจัดจ้าง
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.8', marginBottom: '30px' }}>
                            ความโปร่งใส ตรวจสอบได้ เพื่ออนุมัติงบประมาณอย่างคุ้มค่า
                            <br />
                            องค์การบริหารส่วนจังหวัดบุรีรัมย์มุ่งมั่นในการบริหารงานด้วยความซื่อสัตย์สุจริต
                        </p>

                        <div style={{ marginBottom: '40px' }}>
                            {/* Latest announcement dummy or Real ? For now keep static or simple */}
                            <p style={{ color: '#94a3b8' }}>ไม่มีประกาศจัดซื้อในขณะนี้</p>
                        </div>

                        <Link href="/procurement" style={{ textDecoration: 'none' }}>
                            <button style={{
                                padding: '15px 30px',
                                borderRadius: '12px',
                                border: '2px solid #EAB308',
                                background: 'white',
                                color: '#EAB308',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: '0.2s'
                            }}
                                onMouseOver={(e) => { e.target.style.background = '#EAB308'; e.target.style.color = 'white'; }}
                                onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.color = '#EAB308'; }}
                            >
                                📂 ดูรายงานโครงการทั้งหมด
                            </button>
                        </Link>
                    </div>

                    {/* Stats Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '40px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                        border: '1px solid #E2E8F0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                color: 'white',
                                boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.4)'
                            }}>
                                📊
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>
                                    รายละเอียดงบประมาณ
                                </h3>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                                    ประจำปีงบประมาณ พ.ศ. {currentYear}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            background: '#F8FAFC',
                            borderRadius: '16px',
                            padding: '25px',
                            marginBottom: '30px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ color: '#64748b', fontWeight: '600' }}>งบประมาณรวมทั้งสิ้น</span>
                            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b' }}>
                                ฿ {totalBudget.toLocaleString()}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {budgetStats.map((stat) => (
                                <div key={stat.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: stat.color }}></div>
                                            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#475569' }}>{stat.label}</span>
                                        </div>
                                        <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>
                                            ฿ {stat.value.toLocaleString()}
                                        </span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${(stat.value / totalBudget) * 100}%`,
                                            height: '100%',
                                            background: stat.color,
                                            borderRadius: '10px'
                                        }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <Link href="/procurement" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                                📄 ดูรายละเอียดทั้งหมด →
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
