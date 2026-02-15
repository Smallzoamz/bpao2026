import { supabase } from '@/utils/supabase';
import { siteConfig } from '@/data/content';
import NewsClient from './NewsClient';
import AutoBanner from '@/components/AutoBanner';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const { data: news } = await supabase.from('news').select('*').eq('id', id).single();

    if (!news) {
        return {
            title: 'ไม่พบข่าว',
        };
    }

    return {
        title: news.title_th,
        description: news.excerpt_th,
        openGraph: {
            title: news.title_th,
            description: news.excerpt_th,
            images: [
                {
                    url: news.image_url,
                    width: 1200,
                    height: 630,
                    alt: news.title_th,
                },
            ],
            type: 'article',
            publishedTime: news.publish_date,
        },
    };
}

export default async function NewsPage({ params }) {
    const { id } = await params;
    const { data: news } = await supabase.from('news').select('*').eq('id', id).single();

    if (!news) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: news.title,
        image: [news.image],
        datePublished: news.date, // Note: Should ideally be ISO format
        description: news.excerpt,
        author: [{
            '@type': 'Organization',
            name: siteConfig.name,
            url: 'https://bpao-2026.vercel.app',
        }],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Auto Banner for News Detail */}
            <AutoBanner
                title={news.title_th}
                subtitle={new Date(news.publish_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                bgUrl={news.image_url}
            />

            <NewsClient newsItem={news} newsId={id} />
        </>
    );
}
