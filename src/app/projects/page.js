'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { procurementProjects, siteConfig } from '@/data/content';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORY_ICONS = {
    'โครงสร้างพื้นฐาน': '🏗️',
    'การศึกษา': '📚',
    'สาธารณสุข': '🏥',
    'การท่องเที่ยว': '⛱️',
    'บริหารทั่วไป': '📂',
};

export default function ProjectsDashboard() {
    const router = useRouter();
    const [activeFiscal, setActiveFiscal] = useState('2569');

    // Stats calculation
    const totalBudget = procurementProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalProjects = procurementProjects.length;
    const avgProgress = Math.round(procurementProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects);

    return (
        <main className="page-wrapper">
            <Header />

            <div className="dashboard-wrapper">
                <div className="container">
                    <header className="dashboard-hero">
                        <h1 className="dashboard-title">ระบบติดตามโครงการ {siteConfig.shortName}</h1>
                        <p className="dashboard-subtitle">ข้อมูลการดำเนินการและงบประมาณ ประจำปีงบประมาณ พ.ศ. {activeFiscal}</p>
                    </header>

                    {/* Stats Summary */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-label">งบประมาณรวมทั้งสิ้น</span>
                            <span className="stat-value">฿ {(totalBudget / 1000000).toFixed(1)} ล้าน</span>
                            <span className="stat-icon">💰</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">จำนวนโครงการทั้งหมด</span>
                            <span className="stat-value">{totalProjects} โครงการ</span>
                            <span className="stat-icon">📋</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">ความคืบหน้าภาพรวม</span>
                            <span className="stat-value">{avgProgress}%</span>
                            <span className="stat-icon">📈</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">สถานะการเบิกจ่าย</span>
                            <span className="stat-value">65%</span>
                            <span className="stat-icon">💸</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="dashboard-controls">
                        <h2 className="section-title-small">รายการโครงการ ({totalProjects})</h2>
                        <div className="filter-group">
                            {/* Search/Filter placeholders */}
                        </div>
                    </div>

                    {/* Project List */}
                    <div className="project-grid">
                        {procurementProjects.map((project) => (
                            <a href={`/projects/${project.id}`} key={project.id} className="project-full-card">
                                <div className="project-cat-icon">
                                    {CATEGORY_ICONS[project.category] || '📦'}
                                </div>

                                <div className="project-main-info">
                                    <h3>{project.title}</h3>
                                    <div className="project-meta-tags">
                                        <div className="project-meta-tag">
                                            <span>👤</span> {project.department}
                                        </div>
                                        <div className="project-meta-tag">
                                            <span>📍</span> {project.location}
                                        </div>
                                        <div className="project-meta-tag">
                                            <span>📅</span> {project.publishDate}
                                        </div>
                                    </div>
                                </div>

                                <div className="project-budget-info">
                                    <span className="project-price">฿ {project.budget.toLocaleString()}</span>
                                    <div className="project-progress-container">
                                        <div className="progress-label-box">
                                            <span className="p-label">ความคืบหน้า</span>
                                            <span className="p-percent">{project.progress}%</span>
                                        </div>
                                        <div className="project-progress-track">
                                            <div
                                                className="project-progress-fill"
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <button onClick={() => router.push('/')} className="btn-outline-gold">
                            ← กลับไปหน้าหลัก
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
