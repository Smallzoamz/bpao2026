'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminNews() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title_th: '',
        title_en: '',
        excerpt_th: '',
        excerpt_en: '',
        content_th: '',
        content_en: '',
        image_url: '',
        category: 'ทั่วไป',
        publish_date: new Date().toISOString().split('T')[0]
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    async function fetchNews() {
        setLoading(true);
        const { data } = await supabase.from('news').select('*').order('publish_date', { descending: true });
        setNews(data || []);
        setLoading(false);
    }

    const handleFileUpload = async (event, field) => {
        try {
            const files = Array.from(event.target.files);
            if (files.length === 0) return;

            setUploading(true);

            const uploadPromises = files.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `news/${fileName}`;

                let { error: uploadError } = await supabase.storage
                    .from('cms')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('cms')
                    .getPublicUrl(filePath);

                return publicUrl;
            });

            const publicUrls = await Promise.all(uploadPromises);

            if (field === 'image_url') {
                setFormData(prev => ({ ...prev, image_url: publicUrls[0] }));
            } else if (field === 'gallery') {
                setFormData(prev => ({
                    ...prev,
                    gallery: [...(Array.isArray(prev.gallery) ? prev.gallery : []), ...publicUrls]
                }));
            }
        } catch (error) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
            // Clear input
            event.target.value = '';
        }
    };

    const removeGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    const openAdd = () => {
        setIsEditing(false);
        setFormData({
            title_th: '',
            title_en: '',
            excerpt_th: '',
            excerpt_en: '',
            content_th: '',
            content_en: '',
            image_url: '',
            gallery: [],
            category: 'ทั่วไป',
            publish_date: new Date().toISOString().split('T')[0]
        });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({
            title_th: item.title_th || '',
            title_en: item.title_en || '',
            excerpt_th: item.excerpt_th || '',
            excerpt_en: item.excerpt_en || '',
            content_th: item.content_th || '',
            content_en: item.content_en || '',
            image_url: item.image_url || '',
            gallery: item.gallery || [],
            category: item.category || 'ทั่วไป',
            publish_date: item.publish_date ? new Date(item.publish_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setShowModal(true);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const payload = { ...formData, publish_date: new Date(formData.publish_date).toISOString() };

            let error;
            if (isEditing) {
                const { error: updateError } = await supabase.from('news').update(payload).eq('id', currentId);
                error = updateError;
            } else {
                const { error: insertError } = await supabase.from('news').insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            alert('บันทึกข้อมูลสำเร็จ!');
            setShowModal(false);
            fetchNews();
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (confirm('ยืนยันการลบข่าวสารนี้?')) {
            await supabase.from('news').delete().eq('id', id);
            fetchNews();
        }
    }

    if (loading) return <div className="shimmer-placeholder" style={{ height: '300px' }}></div>;

    return (
        <div className="admin-content-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
                <div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', marginBottom: '8px' }}>จัดการระบบ</p>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b' }}>จัดการข่าวสาร (News)</h2>
                </div>
                <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--primary-dark)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                    + เพิ่มข่าวสารใหม่
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>วันที่</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>หัวข้อข่าว</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>หมวดหมู่</th>
                            <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textAlign: 'right' }}>การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>
                                    {new Date(item.publish_date).toLocaleDateString('th-TH')}
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{item.title_th}</div>
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px' }}>{item.category}</span>
                                </td>
                                <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                        <button onClick={() => openEdit(item)} style={{ color: '#3b82f6', fontWeight: '700', border: 'none', background: 'none', cursor: 'pointer' }}>แก้ไข</button>
                                        <button onClick={() => handleDelete(item.id)} style={{ color: '#ef4444', fontWeight: '700', border: 'none', background: 'none', cursor: 'pointer' }}>ลบ</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '800px', borderRadius: '20px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: '20px', fontWeight: '900' }}>{isEditing ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>หัวข้อ (ไทย)</label>
                                    <input required type="text" value={formData.title_th} onChange={e => setFormData({ ...formData, title_th: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>หัวข้อ (English)</label>
                                    <input type="text" value={formData.title_en} onChange={e => setFormData({ ...formData, title_en: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>เนื้อหาข่าวแบบย่อ (ไทย)</label>
                                <textarea rows="2" value={formData.excerpt_th} onChange={e => setFormData({ ...formData, excerpt_th: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>เนื้อหาข่าวเต็ม (ไทย)</label>
                                <textarea rows="6" value={formData.content_th} onChange={e => setFormData({ ...formData, content_th: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>รูปภาพหน้าปก</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {formData.image_url && (
                                            <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                                <img src={formData.image_url} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'image_url')} style={{ fontSize: '0.8rem' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>เพิ่มรูปเข้าคลัง (Gallery)</label>
                                    <input type="file" multiple accept="image/*" onChange={e => handleFileUpload(e, 'gallery')} style={{ fontSize: '0.8rem' }} />
                                </div>
                            </div>

                            {formData.gallery && formData.gallery.length > 0 && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>รูปภาพในคลัง ({formData.gallery.length})</label>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {formData.gallery.map((url, idx) => (
                                            <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                                <img src={url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button type="button" onClick={() => removeGalleryImage(idx)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239, 68, 68, 0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>หมวดหมู่</label>
                                    <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>วันที่ประกาศ</label>
                                    <input type="date" value={formData.publish_date} onChange={e => setFormData({ ...formData, publish_date: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
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
