'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminActivities() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        image_url: ''
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchActivities();
    }, []);

    async function fetchActivities() {
        setLoading(true);
        const { data } = await supabase.from('activities').select('*').order('created_at', { descending: true });
        setActivities(data || []);
        setLoading(false);
    }

    const handleFileUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;

            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `activities/${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('cms')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('cms')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error) {
            alert('Error uploading activity image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const openAdd = () => {
        setIsEditing(false);
        setFormData({ title: '', date: '', image_url: '' });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({
            title: item.title || '',
            date: item.date || '',
            image_url: item.image_url || ''
        });
        setShowModal(true);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            let error;
            if (isEditing) {
                const { error: updateError } = await supabase.from('activities').update(formData).eq('id', currentId);
                error = updateError;
            } else {
                const { error: insertError } = await supabase.from('activities').insert([formData]);
                error = insertError;
            }

            if (error) throw error;

            alert('บันทึกกิจกรรมสำเร็จ!');
            setShowModal(false);
            fetchActivities();
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (confirm('ยืนยันการลบกิจกรรมนี้?')) {
            await supabase.from('activities').delete().eq('id', id);
            fetchActivities();
        }
    }

    if (loading) return <div className="shimmer-placeholder" style={{ height: '300px' }}></div>;

    return (
        <div className="admin-content-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
                <div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', marginBottom: '8px' }}>จัดการระบบ</p>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b' }}>จัดการกิจกรรม (Activities)</h2>
                </div>
                <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--primary-dark)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                    + เพิ่มกิจกรรมใหม่
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {activities.map((item) => (
                    <div key={item.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '180px', background: '#f8fafc', overflow: 'hidden' }}>
                            <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '20px', flex: 1 }}>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>📅 {item.date}</div>
                            <h4 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '15px', lineHeight: '1.4' }}>{item.title}</h4>
                            <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                                <button onClick={() => openEdit(item)} style={{ color: '#3b82f6', fontWeight: '700', border: 'none', background: 'none', cursor: 'pointer' }}>แก้ไข</button>
                                <button onClick={() => handleDelete(item.id)} style={{ color: '#ef4444', fontWeight: '700', border: 'none', background: 'none', cursor: 'pointer' }}>ลบ</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '20px', padding: '30px' }}>
                        <h3 style={{ marginBottom: '20px', fontWeight: '900' }}>{isEditing ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>ชื่อกิจกรรม</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>วันที่จัดกิจกรรม (เช่น 22 ม.ค. 2569)</label>
                                <input type="text" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>รูปภาพประกอบ</label>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px' }}>
                                    {formData.image_url && (
                                        <div style={{ width: '100px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                            <img src={formData.image_url} alt="Activity" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ fontSize: '0.8rem' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 25px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '700', cursor: 'pointer' }}>ยกเลิก</button>
                                <button type="submit" disabled={uploading} className="btn-primary" style={{ padding: '12px 25px', borderRadius: '12px', border: 'none', background: uploading ? '#94a3b8' : 'var(--primary-dark)', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
                                    {uploading ? 'กำลังอัปโหลด...' : 'บันทึกข้อมูล'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
