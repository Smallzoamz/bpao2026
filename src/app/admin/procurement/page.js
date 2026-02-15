'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminProcurement() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        project_id_code: '',
        title_th: '',
        title_en: '',
        fiscal_year: '2569',
        category: 'โครงสร้างพื้นฐาน',
        status: 'ประกาศเชิญชวน',
        budget: 0,
        progress: 0,
        department: '',
        location: '',
        publish_date: new Date().toISOString().split('T')[0],
        description_th: '',
        pdf_url: ''
    });

    const categories = ['โครงสร้างพื้นฐาน', 'การศึกษา', 'สาธารณสุข', 'การเกษตร', 'การท่องเที่ยว', 'สังคมสงเคราะห์', 'อื่นๆ'];
    const statuses = ['ประกาศเชิญชวน', 'อยู่ระหว่างประมูล', 'ได้ผู้รับจ้างแล้ว', 'กำลังก่อสร้าง', 'เสร็จสมบูรณ์', 'ยกเลิก'];

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        setLoading(true);
        try {
            // Fetch from dedicated procurement table
            const { data, error } = await supabase
                .from('procurement')
                .select('*')
                .order('publish_date', { descending: true });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching procurement:', error);
            alert('ไม่สามารถดึงข้อมูลโครงการได้: ' + (error.message || 'Unknown error'));
        }
        setLoading(false);
    }

    const openAdd = () => {
        setCurrentProject(null);
        setFormData({
            project_id_code: '',
            title_th: '',
            title_en: '',
            fiscal_year: '2569',
            category: 'โครงสร้างพื้นฐาน',
            status: 'ประกาศเชิญชวน',
            budget: 0,
            progress: 0,
            department: 'สำนักช่าง',
            location: '',
            publish_date: new Date().toISOString().split('T')[0],
            description_th: '',
            pdf_url: ''
        });
        setShowModal(true);
    };

    const openEdit = (project) => {
        setCurrentProject(project);
        setFormData({ ...project });
        setShowModal(true);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (currentProject) {
                const { error } = await supabase
                    .from('procurement')
                    .update(formData)
                    .eq('id', currentProject.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('procurement')
                    .insert([formData]);
                if (error) throw error;
            }
            setShowModal(false);
            fetchProjects();
            alert('บันทึกสำเร็จลงในฐานข้อมูลโครงการ (Procurement) แล้ว!');
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id) {
        if (confirm('ยืนยันการลบโครงการนี้ออกจากฐานข้อมูลโครงการ?')) {
            const { error } = await supabase.from('procurement').delete().eq('id', id);
            if (error) alert(error.message);
            else fetchProjects();
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `procurement/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('cms')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('cms')
                .getPublicUrl(fileName);

            setFormData(prev => ({ ...prev, pdf_url: publicUrl }));
            alert('อัปโหลดไฟล์เรียบร้อยแล้ว');
        } catch (error) {
            alert('Upload error: ' + error.message);
        }
    };

    if (loading) return <div className="shimmer-placeholder" style={{ height: '400px' }}></div>;

    const filteredProjects = projects.filter(p =>
        p.title_th?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.project_id_code?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-content-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', marginBottom: '8px' }}>รายการ: โครงการจัดซื้อจัดจ้าง (ฐานข้อมูลหลัก)</p>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b' }}>จัดการโครงการจัดซื้อจัดจ้าง</h2>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อโครงการหรือรหัส..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ padding: '10px 15px', paddingLeft: '35px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '300px' }}
                        />
                        <span style={{ position: 'absolute', left: '12px', top: '10px', opacity: 0.4 }}>🔍</span>
                    </div>
                    <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--bru-dark-pearl)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>+</span> ลงประกาศใหม่
                    </button>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>ชื่อโครงการ</th>
                            <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>หมวดหมู่</th>
                            <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>ปีงบประมาณ</th>
                            <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>วันที่เผยแพร่</th>
                            <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textAlign: 'right' }}>การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProjects.map((project) => (
                            <tr key={project.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ fontWeight: '800', color: '#1e293b', maxWidth: '400px' }}>{project.title_th}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>รหัส: {project.project_id_code} | สถานะ: {project.status}</div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '4px 10px', borderRadius: '10px', color: '#64748b' }}>{project.category}</span>
                                </td>
                                <td style={{ padding: '20px', fontWeight: '700', color: '#334155' }}>พ.ศ. {project.fiscal_year}</td>
                                <td style={{ padding: '20px', fontSize: '0.85rem', color: '#64748b' }}>{new Date(project.publish_date).toLocaleDateString('th-TH')}</td>
                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                        <button onClick={() => openEdit(project)} style={{ color: '#3b82f6', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>แก้ไข</button>
                                        <button onClick={() => handleDelete(project.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>ลบ</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '800px', borderRadius: '24px', padding: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '25px' }}>{currentProject ? 'แก้ไขข้อมูลโครงการ' : 'ลงประกาศใหม่'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>ชื่อโครงการ/กิจกรรม (ภาษาไทย)</label>
                                <input required style={inputStyle} value={formData.title_th} onChange={e => setFormData({ ...formData, title_th: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>ชื่อโครงการ/กิจกรรม (ภาษาอังกฤษ)</label>
                                <input style={inputStyle} value={formData.title_en} onChange={e => setFormData({ ...formData, title_en: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>รหัสโครงการ/เลขที่อ้างอิง</label>
                                <input required style={inputStyle} value={formData.project_id_code} onChange={e => setFormData({ ...formData, project_id_code: e.target.value })} placeholder="เช่น P001" />
                            </div>
                            <div>
                                <label style={labelStyle}>ปีงบประมาณ</label>
                                <input required style={inputStyle} value={formData.fiscal_year} onChange={e => setFormData({ ...formData, fiscal_year: e.target.value })} placeholder="เช่น 2569" />
                            </div>
                            <div>
                                <label style={labelStyle}>หมวดหมู่</label>
                                <select style={inputStyle} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>สถานะ</label>
                                <select style={inputStyle} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>งบประมาณรวม (บาท)</label>
                                <input type="number" style={inputStyle} value={formData.budget} onChange={e => setFormData({ ...formData, budget: parseFloat(e.target.value) })} />
                            </div>
                            <div>
                                <label style={labelStyle}>ความคืบหน้า (%)</label>
                                <input type="number" min="0" max="100" style={inputStyle} value={formData.progress} onChange={e => setFormData({ ...formData, progress: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label style={labelStyle}>หน่วยงานที่รับผิดชอบ</label>
                                <input style={inputStyle} value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>วันที่ประกาศ/เริ่มโครงการ</label>
                                <input type="date" style={inputStyle} value={formData.publish_date} onChange={e => setFormData({ ...formData, publish_date: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>ไฟล์เอกสารประกาศ (PDF)</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input type="file" accept=".pdf" onChange={handleFileUpload} style={{ fontSize: '0.85rem' }} />
                                    {formData.pdf_url && <a href={formData.pdf_url} target="_blank" style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '700' }}>👁️ ดูไฟล์เดิม</a>}
                                </div>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>รายละเอียดเพิ่มเติม</label>
                                <textarea rows="3" style={inputStyle} value={formData.description_th} onChange={e => setFormData({ ...formData, description_th: e.target.value })} />
                            </div>

                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 25px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: '700' }}>ยกเลิก</button>
                                <button type="submit" disabled={isSubmitting} style={{ padding: '12px 35px', borderRadius: '12px', border: 'none', background: 'var(--bru-dark-pearl)', color: 'white', fontWeight: '800', cursor: 'pointer' }}>
                                    {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' };
