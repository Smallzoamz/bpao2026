'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';

export default function ProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchProject();
    }, [id]);

    async function fetchProject() {
        setLoading(true);
        // 1. Try procurement table
        const { data: procData } = await supabase.from('procurement').select('*').eq('id', id).single();
        if (procData) {
            setProject(procData);
            setLoading(false);
            return;
        }

        // 2. Try documents table
        const { data: docData } = await supabase.from('documents').select('*').eq('id', id).single();
        if (docData) {
            setProject({
                ...docData,
                pdf_url: docData.file_url,
                status: docData.status || 'ประกาศทั่วไป',
                budget: docData.budget || 0,
                progress: docData.progress || 0,
                department: docData.department || 'อบจ.บุรีรัมย์',
                location: docData.location || '-',
                description_th: docData.description_th || '',
                project_id_code: docData.project_id_code || 'DOC-' + docData.id.split('-')[0].toUpperCase()
            });
        }
        setLoading(false);
    }

    if (loading) return (
        <div style={{ marginTop: '140px', padding: '100px 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="shimmer-placeholder" style={{ height: '400px', borderRadius: '30px' }}></div>
            </div>
        </div>
    );

    if (!project) return (
        <div style={{ marginTop: '140px', padding: '100px 0', textAlign: 'center' }}>
            <h2>ไม่พบข้อมูลโครงการ</h2>
            <Link href="/procurement" style={{ color: 'var(--bru-dark-pearl)', fontWeight: '700' }}>← กลับไปหน้าจัดซื้อจัดจ้าง</Link>
        </div>
    );

    return (
        <>
            <Header />
            <main style={{ marginTop: '140px', background: '#f8fafc', paddingBottom: '100px', color: '#1E293B' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>

                    {/* Back Link & Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <Link href="/procurement" style={{
                            textDecoration: 'none',
                            color: '#64748b',
                            fontWeight: '800',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>←</span> กลับไปหน้ารวมโครงการ
                        </Link>
                        <Tag label={project.category || 'จัดซื้อจัดจ้าง'} color="#FFF7ED" textColor="#C2410C" />
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '50px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                        {/* Title Header */}
                        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '30px', marginBottom: '40px' }}>
                            <h1 style={{
                                fontSize: '1.8rem',
                                fontWeight: '800',
                                color: '#1e293b',
                                marginBottom: '15px',
                                lineHeight: '1.4'
                            }}>{project.title_th}</h1>

                            <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
                                เลขที่โครงการ: <span style={{ fontWeight: '700', color: '#1e293b' }}>{project.project_id_code}</span> &nbsp;|&nbsp;
                                ปีงบประมาณ: <span style={{ fontWeight: '700', color: '#1e293b' }}>{project.fiscal_year}</span>
                            </p>
                        </div>

                        {/* Info Grid - 2 Column Layout */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) 1fr', gap: '50px' }}>

                            {/* Left: Scope Budget Summary */}
                            <div style={{
                                background: '#F8FAFC',
                                padding: '35px',
                                borderRadius: '20px',
                                border: '1px solid #E2E8F0',
                                height: 'fit-content'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>📊</span>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: '#334155' }}>ข้อมูลสรุปงบประมาณ</h3>
                                </div>

                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>วงเงินงบประมาณ</p>
                                <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#1e293b', marginBottom: '25px', letterSpacing: '-0.02em' }}>
                                    <span style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '5px', color: '#94a3b8' }}>฿</span>
                                    {project.budget?.toLocaleString()}
                                </div>

                                <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>ความคืบหน้าโครงการ</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>{project.progress}%</p>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${project.progress}%`,
                                        height: '100%',
                                        background: '#3B82F6',
                                        borderRadius: '10px'
                                    }}></div>
                                </div>
                            </div>

                            {/* Right: Department & Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <InfoItem icon="🏢" label="หน่วยงานที่รับผิดชอบ" value={project.department} />
                                <InfoItem icon="📍" label="พื้นที่ดำเนินการ" value={project.location} subLabel="ดูบนแผนที่" />
                                <InfoItem icon="🗓️" label="วันที่ประกาศโครงการ" value={new Date(project.publish_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })} />

                                <div style={{ marginTop: '10px' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>สถานะปัจจุบัน</p>
                                    <Tag label={project.status} color="#E0F2FE" textColor="#0369A1" />
                                </div>
                            </div>
                        </div>

                        {/* Description & Downloads */}
                        <div style={{ marginTop: '50px', borderTop: '1px solid #f1f5f9', paddingTop: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <span style={{ fontSize: '1.2rem' }}>📝</span>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#334155' }}>รายละเอียดและเอกสารแนบ</h3>
                            </div>

                            <p style={{
                                color: '#475569',
                                lineHeight: '1.7',
                                marginBottom: '30px',
                                fontSize: '0.95rem'
                            }}>
                                {project.description_th || `โครงการนี้อยู่ในขั้นตอน ${project.status} ท่านสามารถติดตามความคืบหน้าและดาวน์โหลดเอกสารประกาศได้จากระบบจัดซื้อจัดจ้างภาครัฐ (e-GP)`}
                            </p>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                {project.pdf_url && (
                                    <a href={project.pdf_url} target="_blank" style={{ textDecoration: 'none' }}>
                                        <button style={{
                                            padding: '14px 28px',
                                            borderRadius: '12px',
                                            border: '1px solid #EAB308',
                                            background: 'white',
                                            color: '#EAB308',
                                            fontWeight: '700',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: '0.2s'
                                        }} className="btn-outline-gold">
                                            ดาวน์โหลดเอกสารประกาศ (PDF)
                                        </button>
                                    </a>
                                )}
                                <Link href="/procurement" style={{ textDecoration: 'none' }}>
                                    <button style={{
                                        padding: '14px 28px',
                                        borderRadius: '12px',
                                        border: '1px solid #EAB308',
                                        background: 'white',
                                        color: '#EAB308',
                                        fontWeight: '700',
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        transition: '0.2s'
                                    }} className="btn-outline-gold">
                                        ← กลับไปหน้ารวมโครงการ
                                    </button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function InfoItem({ icon, label, value, subLabel }) {
    return (
        <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                color: '#64748B'
            }}>{icon}</div>
            <div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '1rem', fontWeight: '800', color: '#1E293B' }}>{value || '-'}</p>
                {subLabel && <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{subLabel}</p>}
            </div>
        </div>
    );
}

function Tag({ label, color, textColor }) {
    return (
        <span style={{
            padding: '6px 16px',
            borderRadius: '100px',
            background: color,
            color: textColor,
            fontSize: '0.8rem',
            fontWeight: '800',
            display: 'inline-block'
        }}>
            {label}
        </span>
    );
}
