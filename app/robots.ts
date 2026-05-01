import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // 禁止抓取后台管理页面
    },
    sitemap: 'https://your-domain.com/sitemap.xml',
  };
}