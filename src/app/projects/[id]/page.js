'use client';

import { useParams, useRouter } from 'next/navigation';
import { procurementProjects, siteConfig } from '@/data/content';
import { showAlert } from '@/components/AlertModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';

export default function ProjectDetail() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState(null);

    useEffect(() => {
        if (!params.id) return;
        const item = procurementProjects.find(p => p.id === params.id);
        if (item) {
            setProject(item);
        } else {
            router.push('/projects');
        }
    }, [params.id, router]);

    if (!project) return null;

    return (
        <main className="page-wrapper">
            <Header />

            <div className="dashboard-wrapper">
                <div className="container">
                    <nav style={{ marginBottom: '30px' }}>
                        <a href="/projects" style={{ color: 'var(--buriram-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            ← กลับไปหน้ารวมโครงการ
                        </a>
                    </nav>

                    <div className="stat-card" style={{ marginBottom: '40px', padding: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <span className="news-category-badge" style={{ marginBottom: '12px' }}>{project.category}</span>
                                <h1 className="dashboard-title" style={{ textAlign: 'left', fontSize: '2.4rem' }}>{project.title}</h1>
                                <p style={{ color: 'var(--slate-500)', fontSize: '1.1rem' }}>
                                    เลขที่โครงการ: {project.id} | ปีงบประมาณ: {project.fiscalYear}
                                </p>
                            </div>
                            <div className="status-badge" style={{ padding: '10px 20px', fontSize: '1rem' }}>
                                {project.status}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
                            <div>
                                <h4 style={{ marginBottom: '20px', color: 'var(--buriram-navy)' }}>📊 ข้อมูลสรุปงบประมาณ</h4>
                                <div className="stat-card" style={{ background: '#f8faff', border: 'none', marginBottom: '20px' }}>
                                    <span className="stat-label">วงเงินงบประมาณ</span>
                                    <span className="stat-value" style={{ color: 'var(--buriram-blue)' }}>฿ {project.budget.toLocaleString()}</span>
                                </div>

                                <div className="project-progress-container">
                                    <div className="progress-label-box" style={{ marginBottom: '12px' }}>
                                        <span className="p-label" style={{ fontSize: '1rem' }}>ความคืบหน้าโครงการ</span>
                                        <span className="p-percent" style={{ fontSize: '1.2rem' }}>{project.progress}%</span>
                                    </div>
                                    <div className="project-progress-track" style={{ height: '16px' }}>
                                        <div
                                            className="project-progress-fill"
                                            style={{ width: `${project.progress}%`, background: 'linear-gradient(90deg, var(--buriram-blue), var(--buriram-sapphire))' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ marginBottom: '20px', color: 'var(--buriram-navy)' }}>🏢 หน่วยงานที่รับผิดชอบ</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '1.5rem' }}>🏢</span>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{project.department}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>{siteConfig.shortName}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '1.5rem' }}>📍</span>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>พื้นที่ดำเนินการ</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {project.location}
                                                <button
                                                    className="btn-text-gold"
                                                    style={{ fontSize: '0.8rem', padding: '2px 8px', border: '1px solid var(--buriram-gold)', borderRadius: '4px' }}
                                                    onClick={() => showAlert({
                                                        title: 'ฟีเจอร์นี้กำลังมา!',
                                                        message: 'ขณะนี้ฟีเจอร์แผนที่กำลังอยู่ระหว่างการพัฒนา กรุณารอติดตามในเวอร์ชันถัดไปครับ',
                                                        type: 'warning'
                                                    })}
                                                >
                                                    📍 ดูบนแผนที่
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '1.5rem' }}>📅</span>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>วันที่ประกาศโครงการ</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>{project.publishDate}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h4 style={{ marginBottom: '20px' }}>📑 รายละเอียดและเอกสารแนบ</h4>
                        <p style={{ color: 'var(--slate-600)' }}>โครงการนี้อยู่ในขั้นตอน {project.status} ท่านสามารถติดตามความคืบหน้าและดาวน์โหลดเอกสารประกาศได้จากระบบจัดซื้อจัดจ้างภาครัฐ (e-GP)</p>
                        <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                            <a href="#" className="btn-outline-gold">ดาวน์โหลดเอกสารประกาศ (PDF)</a>
                            <button onClick={() => router.push('/projects')} className="btn-outline-gold" style={{ background: 'transparent' }}>
                                ← กลับไปรวมโครงการ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
