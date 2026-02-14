export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: 'https://bpao-2026.vercel.app/sitemap.xml',
    };
}
