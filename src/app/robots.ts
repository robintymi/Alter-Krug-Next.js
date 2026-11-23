import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE_URL = 'https://alter-krug-kallinchen.de'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/',
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}
