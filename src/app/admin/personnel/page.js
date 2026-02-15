'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminPersonnel() {
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [filterDept, setFilterDept] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name_th: '', name_en: '', position_th: '', position_en: '', phone: '', photo_url: '', department: 'ฝ่ายบริหาร', sort_order: 10
    });

    useEffect(() => {
        fetchPersonnel();
    }, []);

    async function fetchPersonnel() {
        setLoading(true);
        const { data } = await supabase.from('personnel').select('*').order('sort_order', { ascending: true });
        setPersonnel(data || []);
        setLoading(false);
    }

    const openAdd = () => {
        setIsEditing(false);
        setFormData({ name_th: '', name_en: '', position_th: '', position_en: '', phone: '', photo_url: '', department: 'ฝ่ายบริหาร', sort_order: 10 });
        setShowModal(true);
    };

    const openEdit = (person) => {
        setIsEditing(true);
        setCurrentId(person.id);
        setFormData({
            name_th: person.name_th || '',
            name_en: person.name_en || '',
            position_th: person.position_th || '',
            position_en: person.position_en || '',
            phone: person.phone || '',
            photo_url: person.photo_url || '',
            department: person.department || 'ฝ่ายบริหาร',
            sort_order: person.sort_order || 10
        });
        setShowModal(true);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (isEditing) {
            const { error } = await supabase.from('personnel').update(formData).eq('id', currentId);
            if (!error) {
                setShowModal(false);
                fetchPersonnel();
            }
        } else {
            const { error } = await supabase.from('personnel').insert([formData]);
            if (!error) {
                setShowModal(false);
                fetchPersonnel();
            }
        }
    }

    async function handleDelete(id) {
        if (confirm('ยืนยันการลบข้อมูลบุคลากร? ข้อมูลนี้จะหายไปจากหน้าเว็บทันที')) {
            await supabase.from('personnel').delete().eq('id', id);
            fetchPersonnel();
        }
    }

    const filteredPersonnel = personnel.filter(p => {
        const matchesDept = filterDept === 'All' || p.department === filterDept;
        const matchesSearch = p.name_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.position_th.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesSearch;
    });

    if (loading && !personnel.length) return <div className="shimmer-placeholder" style={{ height: '300px' }}></div>;

    return (
        <div className="admin-content-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', marginBottom: '8px' }}>รายการ: ทำเนียบผู้บริหารและบุคลากร</p>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b' }}>จัดการข้อมูลบุคลากร</h2>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="ค้นหาตามชื่อหรือตำแหน่ง..."
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
                        value={filterDept}
                        onChange={e => setFilterDept(e.target.value)}
                        style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.9rem' }}
                    >
                        <option value="All">ทุกส่วนราชการ</option>
                        <option>ฝ่ายบริหาร</option>
                        <option>สำนักปลัดฯ</option>
                        <option>กองคลัง</option>
                        <option>สำนักช่าง</option>
                    </select>
                    <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 24px', borderRadius: '10px', fontWeight: '700' }}>
                        + เพิ่มบุคลากรใหม่
                    </button>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>รูปภาพ</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>ชื่อ-นามสกุล / ตำแหน่ง</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>ส่วนราชการ</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>การติดต่อ</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textAlign: 'right' }}>การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPersonnel.map((person) => (
                            <tr key={person.id} style={{ borderBottom: '1px solid #f1f5f9', transition: '0.2s' }} className="table-row-hover">
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ width: '50px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#f1f5f9' }}>
                                        <img src={person.photo_url || '/placeholder.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{person.name_th}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{person.position_th}</div>
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        background: '#e0f2fe',
                                        color: '#0369a1',
                                        fontSize: '0.75rem',
                                        fontWeight: '700'
                                    }}>{person.department}</span>
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ fontSize: '0.85rem' }}>📞 {person.phone || '-'}</div>
                                </td>
                                <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <button onClick={() => openEdit(person)} style={{ color: '#3b82f6', fontWeight: '700', fontSize: '0.85rem' }}>แก้ไข</button>
                                        <button onClick={() => handleDelete(person.id)} style={{ color: '#ef4444', fontWeight: '700', fontSize: '0.85rem' }}>ลบข้อมูล</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredPersonnel.length === 0 && (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                        <span style={{ fontSize: '2rem' }}>🔍</span>
                        <p style={{ marginTop: '10px' }}>ไม่พบข้อมูลที่คุณค้นหาครับ</p>
                    </div>
                )}
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
                            <div style={{ padding: '30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '900' }}>{isEditing ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่'}</h3>
                            </div>

                            <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>ชื่อ-นามสกุล (ภาษาไทย)</label>
                                    <input style={inputStyle} value={formData.name_th} onChange={e => setFormData({ ...formData, name_th: e.target.value })} required placeholder="เช่น นายสมเกียรติ พัฒนา" />
                                </div>
                                <div>
                                    <label style={labelStyle}>ชื่อ-นามสกุล (ภาษาอังกฤษ)</label>
                                    <input style={inputStyle} value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} placeholder="e.g. Mr. Somkiat Pattana" />
                                </div>
                                <div>
                                    <label style={labelStyle}>ตำแหน่ง (ภาษาไทย)</label>
                                    <input style={inputStyle} value={formData.position_th} onChange={e => setFormData({ ...formData, position_th: e.target.value })} required placeholder="เช่น นายก อบจ.บุรีรัมย์" />
                                </div>
                                <div>
                                    <label style={labelStyle}>ตำแหน่ง (ภาษาอังกฤษ)</label>
                                    <input style={inputStyle} value={formData.position_en} onChange={e => setFormData({ ...formData, position_en: e.target.value })} placeholder="e.g. President of PAO" />
                                </div>
                                <div>
                                    <label style={labelStyle}>เบอร์โทรศัพท์</label>
                                    <input style={inputStyle} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="044-xxxxxx" />
                                </div>
                                <div>
                                    <label style={labelStyle}>ส่วนราชการ</label>
                                    <select style={inputStyle} value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                        <option>ฝ่ายบริหาร</option>
                                        <option>สำนักปลัดฯ</option>
                                        <option>กองคลัง</option>
                                        <option>สำนักช่าง</option>
                                        <option>กองสาธารณสุข</option>
                                    </select>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={labelStyle}>URL รูปภาพ และ ตัวอย่างรูป</label>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <input style={{ ...inputStyle, flex: 1 }} value={formData.photo_url} onChange={e => setFormData({ ...formData, photo_url: e.target.value })} placeholder="https://..." />
                                        <div style={{ width: '60px', height: '60px', background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
                                            <img src={formData.photo_url || '/placeholder.png'} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>ลำดับการแสดงผล (เลขต่ำแสดงก่อน)</label>
                                    <input type="number" style={inputStyle} value={formData.sort_order} onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) })} />
                                </div>
                            </div>

                            <div style={{ padding: '20px 30px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', fontWeight: '700', color: '#64748b' }}>ยกเลิก</button>
                                <button type="submit" className="btn-primary" style={{ padding: '10px 30px', borderRadius: '12px', fontWeight: '700' }}>{isEditing ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}</button>
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
