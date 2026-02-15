'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';

function BlockEditorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pageId = searchParams.get('id');

    const [page, setPage] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentSection, setCurrentSection] = useState(null);
    const [formData, setFormData] = useState({
        block_type: 'banner',
        content: {}
    });

    useEffect(() => {
        if (pageId) {
            fetchPageData();
            fetchSections();
        }
    }, [pageId]);

    async function fetchPageData() {
        const { data } = await supabase.from('pages').select('*').eq('id', pageId).single();
        if (data) setPage(data);
    }

    async function fetchSections() {
        setLoading(true);
        const { data } = await supabase
            .from('sections')
            .select('*')
            .eq('page_id', pageId)
            .order('sort_order', { ascending: true });
        setSections(data || []);
        setLoading(false);
    }

    const openAdd = (type) => {
        setCurrentSection(null);
        let initialContent = {};
        if (type === 'banner') {
            initialContent = { title_th: '', title_en: '', subtitle_th: '', subtitle_en: '', bg_url: '' };
        } else if (type === 'rich_text') {
            initialContent = { html_th: '', html_en: '' };
        }
        setFormData({ block_type: type, content: initialContent });
        setShowModal(true);
    };

    const openEdit = (section) => {
        setCurrentSection(section);
        setFormData({
            block_type: section.block_type,
            content: { ...section.content }
        });
        setShowModal(true);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (currentSection) {
                const { error } = await supabase.from('sections').update({
                    content: formData.content
                }).eq('id', currentSection.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('sections').insert([{
                    page_id: pageId,
                    block_type: formData.block_type,
                    content: formData.content,
                    sort_order: sections.length
                }]);
                if (error) throw error;
            }
            setShowModal(false);
            fetchSections();
            alert('บันทึกสำเร็จ!');
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    async function handleDelete(id) {
        if (confirm('ยืนยันการลบบล็อกนี้?')) {
            await supabase.from('sections').delete().eq('id', id);
            fetchSections();
        }
    }

    async function moveSection(index, direction) {
        const newSections = [...sections];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newSections.length) return;

        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];

        // Update all sort orders
        const updates = newSections.map((s, i) =>
            supabase.from('sections').update({ sort_order: i }).eq('id', s.id)
        );
        await Promise.all(updates);
        fetchSections();
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `blocks/${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('cms')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('cms')
                .getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                content: { ...prev.content, bg_url: publicUrl }
            }));
        } catch (error) {
            alert('Upload error: ' + error.message);
        }
    };

    if (!pageId) return <div>Missing Page ID</div>;
    if (loading && !page) return <div className="shimmer-placeholder" style={{ height: '400px' }}></div>;

    return (
        <div className="admin-content-inner">
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Link href="/admin/pages" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'none', fontWeight: '800' }}>← กลับไปหน้าตั้งค่า</Link>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', marginTop: '5px' }}>
                        แก้ไขบล็อกเนื้อหา: <span style={{ color: 'var(--primary-dark)' }}>{page?.title_th}</span>
                    </h2>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => openAdd('banner')} className="btn-primary" style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', background: '#0f172a', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>+ เพิ่ม Banner</button>
                    <button onClick={() => openAdd('rich_text')} className="btn-primary" style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', background: '#0f172a', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>+ เพิ่มข้อความ/HTML</button>
                    <button onClick={() => openAdd('person_grid')} className="btn-primary" style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', background: '#334155', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>+ แผงบุคลากร</button>
                    <button onClick={() => openAdd('doc_list')} className="btn-primary" style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', background: '#334155', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>+ รายการเอกสาร</button>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
                {sections.map((section, index) => (
                    <div key={section.id} style={{ background: 'white', borderRadius: '15px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <button onClick={() => moveSection(index, -1)} disabled={index === 0} style={{ border: 'none', background: '#f1f5f9', borderRadius: '5px', cursor: 'pointer', padding: '5px' }}>▲</button>
                            <button onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1} style={{ border: 'none', background: '#f1f5f9', borderRadius: '5px', cursor: 'pointer', padding: '5px' }}>▼</button>
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>{section.block_type}</span>
                                    <h4 style={{ margin: '5px 0' }}>
                                        {section.block_type === 'banner' && (section.content.title_th || 'Untitled Banner')}
                                        {section.block_type === 'rich_text' && 'เนื้อหา Rich Text'}
                                        {section.block_type === 'person_grid' && 'บล็อกแสดงรายชื่อบุคลากร (Auto)'}
                                        {section.block_type === 'doc_list' && 'บล็อกแสดงรายการเอกสาร (Auto)'}
                                    </h4>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {['banner', 'rich_text'].includes(section.block_type) && (
                                        <button onClick={() => openEdit(section)} style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#eff6ff', color: '#3b82f6', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>แก้ไข</button>
                                    )}
                                    <button onClick={() => handleDelete(section.id)} style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#fef2f2', color: '#ef4444', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>ลบ</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {sections.length === 0 && (
                    <div style={{ padding: '60px', textAlign: 'center', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
                        <p style={{ color: '#64748b' }}>ยังไม่มีบล็อกเนื้อหาในหน้านี้ Boss เริ่มเพิ่มจากปุ่มด้านบนได้เลยครับ!</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '20px', padding: '30px' }}>
                        <h3>{currentSection ? 'แก้ไขบล็อก' : 'เพิ่มบล็อกใหม่'}: {formData.block_type}</h3>
                        <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'grid', gap: '15px' }}>
                            {formData.block_type === 'banner' && (
                                <>
                                    <input placeholder="หัวข้อ (TH)" value={formData.content.title_th} onChange={e => setFormData({ ...formData, content: { ...formData.content, title_th: e.target.value } })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <input placeholder="หัวข้อ (EN)" value={formData.content.title_en} onChange={e => setFormData({ ...formData, content: { ...formData.content, title_en: e.target.value } })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {formData.content.bg_url && <img src={formData.content.bg_url} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />}
                                        <input type="file" accept="image/*" onChange={handleFileUpload} style={{ fontSize: '0.8rem' }} />
                                    </div>
                                </>
                            )}
                            {formData.block_type === 'rich_text' && (
                                <>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>HTML (ไทย)</label>
                                    <textarea rows="8" value={formData.content.html_th} onChange={e => setFormData({ ...formData, content: { ...formData.content, html_th: e.target.value } })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                </>
                            )}
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>ยกเลิก</button>
                                <button type="submit" style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#0f172a', color: 'white', fontWeight: '700', cursor: 'pointer' }}>บันทึก</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function BlockEditor() {
    return (
        <Suspense fallback={<div className="shimmer-placeholder" style={{ height: '400px' }}></div>}>
            <BlockEditorContent />
        </Suspense>
    );
}
