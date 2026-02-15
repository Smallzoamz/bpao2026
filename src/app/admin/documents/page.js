'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminDocuments() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        title_th: '', title_en: '', category: 'ประกาศจัดซื้อจัดจ้าง', fiscal_year: '2569', file_url: '#', publish_date: new Date().toISOString().split('T')[0],
        display_target: 'all',
        project_id_code: '', status: 'ประกาศทั่วไป', budget: 0, progress: 0, department: 'อบจ.บุรีรัมย์', location: '', description_th: ''
    });

    useEffect(() => {
        fetchDocs();
    }, []);

    async function fetchDocs() {
        setLoading(true);
        const { data } = await supabase.from('documents').select('*').order('publish_date', { descending: true });
        setDocs(data || []);
        setLoading(false);
    }

    const openAdd = () => {
        setIsEditing(false);
        setFormData({
            title_th: '', title_en: '',
            category: 'ประกาศจัดซื้อจัดจ้าง',
            fiscal_year: '2569',
            file_url: '',
            publish_date: new Date().toISOString().split('T')[0],
            display_target: 'all',
            project_id_code: '', status: 'ประกาศทั่วไป', budget: 0, progress: 0, department: 'อบจ.บุรีรัมย์', location: '', description_th: ''
        });
        setShowModal(true);
    };

    const openEdit = (doc) => {
        setIsEditing(true);
        setCurrentId(doc.id);
        setFormData({
            title_th: doc.title_th || '',
            title_en: doc.title_en || '',
            category: doc.category || 'ประกาศจัดซื้อจัดจ้าง',
            fiscal_year: doc.fiscal_year || '2569',
            file_url: doc.file_url || '#',
            display_target: doc.display_target || 'all',
            publish_date: doc.publish_date ? doc.publish_date.split('T')[0] : new Date().toISOString().split('T')[0],
            project_id_code: doc.project_id_code || '',
            status: doc.status || 'ประกาศทั่วไป',
            budget: doc.budget || 0,
            progress: doc.progress || 0,
            department: doc.department || 'อบจ.บุรีรัมย์',
            location: doc.location || '',
            description_th: doc.description_th || ''
        });
        setShowModal(true);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (isEditing) {
                await supabase.from('documents').update(formData).eq('id', currentId);
            } else {
                await supabase.from('documents').insert([formData]);
            }
            setShowModal(false);
            fetchDocs();
            alert('บันทึกสำเร็จ!');
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    async function handleDelete(id) {
        if (confirm('ยืนยันการลบเอกสาร? ข้อมูลนี้จะหายไปจากหน้าเว็บทันที')) {
            await supabase.from('documents').delete().eq('id', id);
            fetchDocs();
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `documents/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('cms')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('cms')
                .getPublicUrl(fileName);

            setFormData(prev => ({ ...prev, file_url: publicUrl }));
            alert('อัปโหลดไฟล์เรียบร้อยแล้ว');
        } catch (error) {
            alert('Upload error: ' + error.message);
        }
    };

    const filteredDocs = docs.filter(d => {
        const matchesCat = filterCategory === 'All' || d.category === filterCategory;
        const matchesSearch = d.title_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.fiscal_year.includes(searchQuery);
        return matchesCat && matchesSearch;
    });

    if (loading && !docs.length) return <div className="shimmer-placeholder" style={{ height: '300px' }}></div>;

    return (
        <div className="admin-content-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', marginBottom: '8px' }}>รายการ: เอกสารและประกาศจัดซื้อจัดจ้าง</p>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b' }}>คลังเอกสารทางราชการ</h2>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="ค้นตามชื่อหรือปีงบประมาณ..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                padding: '10px 15px',
                                paddingLeft: '35px',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.9rem',
                                width: '240px'
                            }}
                        />
                        <span style={{ position: 'absolute', left: '12px', top: '10px', opacity: 0.4 }}>🔍</span>
                    </div>
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.9rem' }}
                    >
                        <option value="All">ทุกหมวดหมู่</option>
                        <option>ประกาศจัดซื้อจัดจ้าง</option>
                        <option>ข้อบัญญัติงบประมาณ</option>
                        <option>กฎหมายท้องถิ่น</option>
                        <option>แผนพัฒนาท้องถิ่น</option>
                        <option>ข่าวประชาสัมพันธ์</option>
                    </select>
                    <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'var(--bru-dark-pearl)', color: 'white', cursor: 'pointer', fontWeight: '700' }}>
                        + ลงประกาศใหม่
                    </button>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>ชื่อเอกสาร</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>หมวดหมู่ / เป้าหมาย</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>ปีงบประมาณ</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>วันที่เผยแพร่</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textAlign: 'right' }}>การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocs.map((doc) => (
                            <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9', transition: '0.2s' }} className="table-row-hover">
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ fontSize: '1.2rem' }}>📄</div>
                                        <div>
                                            <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.95rem' }}>
                                                {doc.status && doc.status !== 'ประกาศทั่วไป' && <span style={{ fontSize: '0.65rem', background: 'var(--bru-dark-pearl)', color: 'white', padding: '1px 6px', borderRadius: '4px', marginRight: '6px', verticalAlign: 'middle' }}>{doc.status}</span>}
                                                {doc.title_th}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                {doc.project_id_code && <span style={{ marginRight: '8px' }}>Code: {doc.project_id_code}</span>}
                                                {doc.budget > 0 && <span>Budget: ฿{doc.budget.toLocaleString()}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{
                                            padding: '2px 10px',
                                            borderRadius: '10px',
                                            background: '#f1f5f9',
                                            color: '#475569',
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            width: 'fit-content'
                                        }}>{doc.category}</span>
                                        <span style={{
                                            padding: '2px 10px',
                                            borderRadius: '10px',
                                            background: '#e0f2fe',
                                            color: '#0369a1',
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            width: 'fit-content'
                                        }}>🎯 {doc.display_target || 'all'}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{doc.fiscal_year}</div>
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ fontSize: '0.85rem' }}>{new Date(doc.publish_date).toLocaleDateString('th-TH')}</div>
                                </td>
                                <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <a href={doc.file_url} target="_blank" style={{ color: '#10b981', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none' }}>เปิดไฟล์</a>
                                        <button onClick={() => openEdit(doc)} style={{ color: '#3b82f6', background: 'none', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>แก้ไข</button>
                                        <button onClick={() => handleDelete(doc.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>ลบ</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Editor */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '24px', width: '100%', maxWidth: '700px',
                        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        animation: 'modalSlideUp 0.3s ease-out'
                    }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: '30px', borderBottom: '1px solid #f1f5f9' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '900' }}>{isEditing ? 'แก้ไขรายละเอียดเอกสาร' : 'ลงประกาศเอกสารใหม่'}</h3>
                            </div>

                            <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={labelStyle}>หัวข้อเอกสาร (Thai)</label>
                                    <input style={inputStyle} value={formData.title_th} onChange={e => setFormData({ ...formData, title_th: e.target.value })} required placeholder="เช่น ประกาศเชิญชวนเสนอราคาซื้อเครื่องคอมพิวเตอร์..." />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={labelStyle}>หัวข้อเอกสาร (ภาษาอังกฤษ)</label>
                                    <input style={inputStyle} value={formData.title_en} onChange={e => setFormData({ ...formData, title_en: e.target.value })} placeholder="e.g. Invitation to bid for computer supply..." />
                                </div>
                                <div>
                                    <label style={labelStyle}>หมวดหมู่</label>
                                    <select style={inputStyle} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        <option>ประกาศจัดซื้อจัดจ้าง</option>
                                        <option>ข้อบัญญัติงบประมาณ</option>
                                        <option>กฎหมายท้องถิ่น</option>
                                        <option>แผนพัฒนาท้องถิ่น</option>
                                        <option>ข่าวประชาสัมพันธ์</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>ปีงบประมาณ</label>
                                    <input style={inputStyle} value={formData.fiscal_year} onChange={e => setFormData({ ...formData, fiscal_year: e.target.value })} placeholder="เช่น 2568" />
                                </div>
                                <div>
                                    <label style={labelStyle}>วันที่เผยแพร่</label>
                                    <input type="date" style={inputStyle} value={formData.publish_date} onChange={e => setFormData({ ...formData, publish_date: e.target.value })} />
                                </div>
                                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <h4 style={{ gridColumn: 'span 2', fontSize: '0.8rem', fontWeight: '900', color: '#475569' }}>ข้อมูลเฉพาะจัดซื้อจัดจ้าง (เลือกใส่ได้)</h4>
                                    <div>
                                        <label style={labelStyle}>รหัสโครงการ</label>
                                        <input style={inputStyle} value={formData.project_id_code} onChange={e => setFormData({ ...formData, project_id_code: e.target.value })} placeholder="เช่น P-68001" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>สถานะการดำเนินงาน</label>
                                        <select style={inputStyle} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                            <option>ประกาศทั่วไป</option>
                                            <option>ประกาศเชิญชวน</option>
                                            <option>อยู่ระหว่างประมูล</option>
                                            <option>ได้ผู้รับจ้างแล้ว</option>
                                            <option>กำลังก่อสร้าง</option>
                                            <option>เสร็จสมบูรณ์</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>งบประมาณ (บาท)</label>
                                        <input type="number" style={inputStyle} value={formData.budget} onChange={e => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>ความคืบหน้า (%)</label>
                                        <input type="number" min="0" max="100" style={inputStyle} value={formData.progress} onChange={e => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })} />
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={labelStyle}>ไฟล์เอกสาร (PDF)</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input type="file" accept=".pdf" onChange={handleFileUpload} style={{ fontSize: '0.85rem' }} />
                                        {formData.file_url && <a href={formData.file_url} target="_blank" style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '700' }}>👁️ ดูไฟล์เดิม</a>}
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '20px 30px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', fontWeight: '700', color: '#64748b', border: 'none', background: 'none', cursor: 'pointer' }}>ยกเลิก</button>
                                <button type="submit" className="btn-primary" style={{ padding: '12px 30px', borderRadius: '12px', border: 'none', background: 'var(--bru-dark-pearl)', color: 'white', fontWeight: '800', cursor: 'pointer' }}>บันทึกข้อมูลประกาศ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
        .table-row-hover:hover {
          background: #f8fafc;
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}

const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', transition: '0.2s', outline: 'none' };
