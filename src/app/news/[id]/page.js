import { newsArticles, siteConfig } from '@/data/content';
import NewsClient from './NewsClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const news = newsArticles.find(n => n.id.toString() === id.toString());

    if (!news) {
        return {
            title: 'ไม่พบข่าว',
        };
    }

    return {
        title: news.title,
        description: news.excerpt,
        openGraph: {
            title: news.title,
            description: news.excerpt,
            images: [
                {
                    url: news.image,
                    width: 1200,
                    height: 630,
                    alt: news.title,
                },
            ],
            type: 'article',
            publishedTime: news.date,
            authors: [siteConfig.name],
        },
        twitter: {
            card: 'summary_large_image',
            title: news.title,
            description: news.excerpt,
            images: [news.image],
        },
    };
}

export default async function NewsPage({ params }) {
    const { id } = await params;
    const news = newsArticles.find(n => n.id.toString() === id.toString());

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
            <NewsClient newsItem={news} newsId={id} />
        </>
    );
}
