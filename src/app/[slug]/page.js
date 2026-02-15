'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlockRenderer from '@/components/BlockRenderer';
import AutoBanner from '@/components/AutoBanner';
import { supabase } from '@/utils/supabase';
import { useLanguage } from '@/context/LanguageContext';

export default function DynamicPage() {
    const { slug } = useParams();
    const { language } = useLanguage();
    const [page, setPage] = useState(null);
    const [sections, setSections] = useState([]);
    const [extraData, setExtraData] = useState({ personnel: [], docs: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // 1. Fetch Page Info
            const { data: pageData } = await supabase
                .from('pages')
                .select('*')
                .eq('slug', slug)
                .single();

            if (pageData) {
                setPage(pageData);

                // 2. Fetch Sections
                const { data: sectionData } = await supabase
                    .from('sections')
                    .select('*')
                    .eq('page_id', pageData.id)
                    .order('sort_order', { ascending: true });

                setSections(sectionData || []);

                // 3. Fetch Extra Data if needed
                const needsPersonnel = sectionData?.some(s => s.block_type === 'person_grid');
                const needsDocs = sectionData?.some(s => s.block_type === 'doc_list');
                const needsNews = sectionData?.some(s => s.block_type === 'news_grid');

                let personnel = [];
                let docs = [];

                if (needsPersonnel) {
                    const { data } = await supabase.from('personnel').select('*').order('sort_order', { ascending: true });
                    personnel = data || [];
                }

                if (needsDocs) {
                    const { data: docData } = await supabase
                        .from('documents')
                        .select('*')
                        .or(`display_target.eq.${slug},display_target.eq.all`)
                        .order('publish_date', { descending: true });

                    // Handle procurement specifically if the slug matches
                    let combinedDocs = docData || [];
                    if (slug === 'procurement') {
                        const { data: procData } = await supabase.from('procurement').select('*').order('publish_date', { descending: true });
                        if (procData) {
                            combinedDocs = [
                                ...combinedDocs,
                                ...procData.map(p => ({
                                    ...p,
                                    file_url: p.pdf_url // Normalize field name
                                }))
                            ];
                        }
                    }
                    docs = combinedDocs;
                }

                let news = [];
                if (needsNews) {
                    const { data } = await supabase.from('news').select('*').order('publish_date', { descending: true }).limit(6);
                    news = data || [];
                }

                setExtraData({ personnel, docs, news });
            }

            setLoading(false);
        }

        if (slug) fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="shimmer-placeholder" style={{ width: '50px', height: '50px', borderRadius: '50%' }}></div>
            </div>
        );
    }

    if (!page) {
        return (
            <>
                <Header />
                <div style={{ padding: '120px 20px', textAlign: 'center' }}>
                    <h1>404</h1>
                    <p>Page Not Found</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main style={{ marginTop: '140px', minHeight: '60vh' }}>
                <div className="container" style={{ paddingBottom: '80px' }}>
                    {/* Auto Banner Injection */}
                    {page && (!sections.length || sections[0].block_type !== 'banner') && (
                        <AutoBanner
                            title={language === 'TH' ? page.title_th : page.title_en}
                            subtitle={language === 'TH' ? 'องค์การบริหารส่วนจังหวัดบุรีรัมย์' : 'Buriram Provincial Administrative Organization'}
                        />
                    )}

                    {sections.map((section) => (
                        <BlockRenderer
                            key={section.id}
                            block={section}
                            extraData={extraData}
                        />
                    ))}

                    {/* Fallback if no sections exist yet */}
                    {sections.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                            <p>{language === 'TH' ? 'ไม่มีเนื้อหาในขณะนี้' : 'No content available yet.'}</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
