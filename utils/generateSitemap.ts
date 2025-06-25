interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function generateSiteMap(): Promise<SitemapEntry[]> {
  const baseUrl = 'https://finlaygraham.com';
  const sitemap: SitemapEntry[] = [];

  // Static pages
  const staticPages = [
    { path: '/', priority: 1.0, changeFreq: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/teaching', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/work', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/media', priority: 0.6, changeFreq: 'monthly' as const }
  ];

  staticPages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}${page.path}`,
      changeFrequency: page.changeFreq,
      priority: page.priority,
      lastModified: new Date()
    });
  });

  // Dynamic pages - compositions
  try {
    const pieces = await queryCollection('pieces').all();
    pieces.forEach((piece: any) => {
      sitemap.push({
        url: `${baseUrl}/work/pieces${piece.path}`,
        changeFrequency: 'yearly',
        priority: 0.7,
        lastModified: piece.date ? new Date(piece.date) : new Date()
      });
    });
  } catch (error) {
    console.warn('Could not load pieces for sitemap:', error);
  }

  // Dynamic pages - writing
  try {
    const writing = await queryCollection('writing').all();
    writing.forEach((writing: any) => {
      sitemap.push({
        url: `${baseUrl}/work/writing${writing.path}`,
        changeFrequency: 'yearly',
        priority: 0.6,
        lastModified: writing.date ? new Date(writing.date) : new Date()
      });
    });
  } catch (error) {
    console.warn('Could not load writing for sitemap:', error);
  }

  return sitemap;
}

export function generateSitemapXML(entries: SitemapEntry[]): string {
  const xmlEntries = entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    ${entry.lastModified ? `<lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>` : ''}
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
} 