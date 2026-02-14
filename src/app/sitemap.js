import { newsArticles, procurementProjects } from '@/data/content';

export default function sitemap() {
    const baseUrl = 'https://bpao-2026.vercel.app';

    // Base routes
    const routes = ['', '/services', '/departments', '/announcements', '/projects'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1 : 0.8,
    }));

    // News routes
    const newsRoutes = newsArticles.map((news) => ({
        url: `${baseUrl}/news/${news.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    // Project routes
    const projectRoutes = procurementProjects.map((project) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...routes, ...newsRoutes, ...projectRoutes];
}
