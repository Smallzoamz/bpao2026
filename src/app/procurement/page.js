'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';

export default function ProcurementPublic() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeYear, setActiveYear] = useState('2569');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('ทั้งหมด');
    const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }));
        fetchProjects();
    }, []);

    async function fetchProjects() {
        setLoading(true);
        try {
            const { data: legacyData } = await supabase
                .from('procurement')
                .select('*')
                .order('publish_date', { descending: true });

            const { data: docData } = await supabase
                .from('documents')
                .select('*')
                .or('display_target.eq.procurement,category.eq.ประกาศจัดซื้อจัดจ้าง')
                .order('publish_date', { descending: true });

            const combined = [
                ...(legacyData || []),
                ...(docData || []).map(d => ({
                    id: d.id,
                    title_th: d.title_th,
                    title_en: d.title_en,
                    fiscal_year: d.fiscal_year,
                    category: d.category,
                    publish_date: d.publish_date,
                    pdf_url: d.file_url,
                    status: d.status || 'ประกาศทั่วไป',
                    budget: d.budget || 0,
                    progress: d.progress || 0,
                    department: d.department || 'อบจ.บุรีรัมย์',
                    location: d.location || '-'
                }))
            ];

            setProjects(combined);
        } catch (error) {
            console.error('Fetch error:', error);
        }
        setLoading(false);
    }

    const filteredProjects = projects.filter(p => {
        const matchesYear = p.fiscal_year === activeYear;
        const matchesSearch = p.title_th?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = filterCategory === 'ทั้งหมด' || p.category === filterCategory;
        const matchesStatus = filterStatus === 'ทั้งหมด' || p.status === filterStatus;
        return matchesYear && matchesSearch && matchesCat && matchesStatus;
    });

    const totalBudget = filteredProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const avgBudget = filteredProjects.length > 0 ? totalBudget / filteredProjects.length : 0;

    const categories = ['ทั้งหมด', ...new Set(projects.map(p => p.category).filter(Boolean))];
    const statuses = ['ทั้งหมด', ...new Set(projects.map(p => p.status).filter(Boolean))];

    return (
        <>
            <Header />
            <main style={{ marginTop: '140px', background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px', color: '#1E293B' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>

                    {/* Header Section */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                            <div style={{ width: '4px', height: '32px', background: '#3b82f6', borderRadius: '4px' }}></div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>
                                รายการโครงการงบประมาณ {activeYear}
                            </h1>
                        </div>
                        <p style={{ color: '#64748B', fontSize: '0.95rem', marginLeft: '19px' }}>
                            แสดงรายการโครงการงบประมาณประจำปี {activeYear} ขององค์การบริหารส่วนจังหวัดบุรีรัมย์
                            <br />
                            <span style={{ fontSize: '0.85rem' }}>ข้อมูล ณ วันที่ {currentDate}</span>
                        </p>
                    </div>

                    {/* Summary Cards Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                        <SummaryCard
                            label="จำนวนโครงการ"
                            value={filteredProjects.length.toLocaleString()}
                            unit="รายการทั้งหมด"
                            icon="📄"
                        />
                        <SummaryCard
                            label="งบประมาณรวม"
                            value={totalBudget.toLocaleString()}
                            unit="บาท"
                            icon="💰"
                        />
                        <SummaryCard
                            label="งบประมาณเฉลี่ย"
                            value={Math.round(avgBudget).toLocaleString()}
                            unit="บาทต่อโครงการ"
                            icon="📊"
                        />
                    </div>

                    {/* Filter Block */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        border: '1px solid #E2E8F0',
                        marginBottom: '40px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                            <span style={{ fontSize: '1.2rem' }}>▽</span>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>ตัวกรองข้อมูล</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Row 1: Search */}
                            <div>
                                <label style={labelStyle}>ค้นหา</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        style={inputStyle}
                                        placeholder="ค้นหาโครงการ..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <span style={{ position: 'absolute', left: '15px', top: '12px', opacity: 0.3 }}>🔍</span>
                                </div>
                            </div>

                            {/* Row 2: Filters Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>หมวดงบประมาณหลัก</label>
                                    <select style={inputStyle} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>ปีงบประมาณ</label>
                                    <select style={inputStyle} value={activeYear} onChange={(e) => setActiveYear(e.target.value)}>
                                        {['2569', '2568', '2567', '2566'].map(y => <option key={y} value={y}>พ.ศ. {y}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>สถานะโครงการ</label>
                                    <select style={inputStyle} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                        {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Row 3: Actions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button
                                    onClick={() => { setSearchQuery(''); setFilterCategory('ทั้งหมด'); setFilterStatus('ทั้งหมด'); setActiveYear('2569'); }}
                                    style={{
                                        padding: '10px 25px',
                                        borderRadius: '8px',
                                        border: '1px solid #E2E8F0',
                                        background: 'white',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        color: '#64748B',
                                        fontSize: '0.9rem',
                                        transition: '0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.borderColor = '#94A3B8'}
                                    onMouseOut={(e) => e.target.style.borderColor = '#E2E8F0'}
                                >
                                    รีเซ็ตตัวกรอง
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Table Header */}
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>
                            รายการโครงการ ({filteredProjects.length} รายการ)
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '0.85rem' }}>แสดงรายการโครงการที่กรองแล้ว</p>
                    </div>

                    {/* Project List */}
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {filteredProjects.map((project) => (
                            <Link key={project.id} href={`/procurement/${project.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '25px 35px',
                                    border: '1px solid #E2E8F0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: '0.2s',
                                    cursor: 'pointer'
                                }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = '#3b82f6';
                                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = '#E2E8F0';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                    className="procurement-card-row">
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1E293B', marginBottom: '15px' }}>
                                            {project.title_th}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <Tag label={project.category} color="#F1F5F9" textColor="#475569" />
                                            <Tag label={project.status} color="#E0F2FE" textColor="#0369A1" />
                                            <Tag label={project.department} color="#F0FDF4" textColor="#166534" />
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', minWidth: '180px' }}>
                                        <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '700', marginBottom: '5px', textTransform: 'uppercase' }}>
                                            งบประมาณ
                                        </p>
                                        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#3B82F6' }}>
                                            {project.budget?.toLocaleString()}
                                            <span style={{ fontSize: '0.8rem', marginLeft: '5px', color: '#64748B' }}>บาท</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredProjects.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '16px', border: '1px dashed #E2E8F0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📦</div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#64748B' }}>ไม่พบข้อมูลโครงการที่ค้นหา</h3>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

function SummaryCard({ label, value, unit, icon }) {
    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '25px',
            border: '1px solid #E2E8F0',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '1.2rem', opacity: 0.3 }}>
                {icon}
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748B', marginBottom: '15px' }}>{label}</p>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px' }}>{value}</div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '600' }}>{unit}</p>
        </div>
    );
}

function Tag({ label, color, textColor }) {
    return (
        <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            background: color,
            color: textColor,
            fontSize: '0.7rem',
            fontWeight: '800'
        }}>
            {label}
        </span>
    );
}

const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748B', marginBottom: '8px' };
const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    paddingLeft: '40px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    fontSize: '0.9rem',
    outline: 'none',
    background: '#F8FAF9',
    transition: '0.2s'
};
