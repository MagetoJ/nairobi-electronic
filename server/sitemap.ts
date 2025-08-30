import { storage } from "./storage";

export async function generateSitemap(): Promise<string> {
  try {
    const baseUrl = process.env.REPLIT_DOMAINS 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
      : 'https://localhost:5000';

    // Get all products and categories for dynamic URLs
    const products = await storage.getProducts({ limit: 1000 });
    const categories = await storage.getCategories();

    const staticUrls = [
      {
        loc: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/products',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/about',
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/contact',
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/shipping',
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/returns',
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/warranty',
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/privacy',
        changefreq: 'yearly',
        priority: 0.3,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/terms',
        changefreq: 'yearly',
        priority: 0.3,
        lastmod: new Date().toISOString().split('T')[0]
      }
    ];

    // Add category URLs
    const categoryUrls = categories.map(category => ({
      loc: `/products?category=${category.slug}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString().split('T')[0]
    }));

    // Add product URLs
    const productUrls = products.map(product => ({
      loc: `/products/${product.id}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }));

    const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return basic sitemap if there's an error
    const baseUrl = process.env.REPLIT_DOMAINS 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
      : 'https://localhost:5000';
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
  }
}
