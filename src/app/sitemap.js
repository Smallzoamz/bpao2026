import { newsArticles } from '@/data/content';

export default function sitemap() {
    const baseUrl = 'https://bpao-2026.vercel.app';

    // Base routes
    const routes = ['', '/services', '/departments', '/announcements'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1 : 0.8,
    }));

    // News routes
    const newsRoutes = newsArticles.map((news) => ({
        url: `${baseUrl}/news/${news.id}`,
        lastModified: new Date(), // Ideally this would be the actual news update date
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    return [...routes, ...newsRoutes];
}
