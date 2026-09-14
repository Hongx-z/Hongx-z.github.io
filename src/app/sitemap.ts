import type { MetadataRoute } from 'next';

import { site } from '@/data/site';
import { getAllArticles } from '@/lib/articles';
import { getAllDocumentaries } from '@/lib/documentaries';
import { getAllTagSummaries } from '@/lib/tags';

// Required for `output: 'export'` — sitemap.xml must be prerendered.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, '');

  const articles = getAllArticles();
  const films = getAllDocumentaries();
  const tags = getAllTagSummaries();

  // The newest article or film stands in for "last modified" on the index pages.
  const latest = [...articles.map((a) => a.date), ...films.map((f) => f.date)]
    .filter(Boolean)
    .sort()
    .at(-1);

  return [
    { url: `${base}/`, lastModified: latest ? new Date(latest) : undefined, priority: 1 },
    { url: `${base}/about/`, priority: 0.9 },
    { url: `${base}/writing/`, lastModified: latest ? new Date(latest) : undefined, priority: 0.9 },
    { url: `${base}/documentaries/`, priority: 0.9 },
    { url: `${base}/tags/`, priority: 0.5 },

    ...articles.map((article) => ({
      url: `${base}/writing/${article.slug}/`,
      lastModified: new Date(article.date),
      priority: 0.8,
    })),

    ...films.map((film) => ({
      url: `${base}/documentaries/${film.slug}/`,
      lastModified: film.date ? new Date(film.date) : undefined,
      priority: 0.8,
    })),

    ...tags.map((tag) => ({
      url: `${base}/tags/${tag.slug}/`,
      priority: 0.4,
    })),
  ];
}
