import { getAllArticles, type ArticleMeta } from '@/lib/articles';
import { getAllDocumentaries, type DocumentaryMeta } from '@/lib/documentaries';

/**
 * Tags span both halves of the site. An article tagged "Night Work" and a film
 * tagged "Night Work" end up on the same tag page, which is the point — that
 * is how you get from the writing to the films about the same subject.
 */

export interface TagSummary {
  label: string;
  slug: string;
  articleCount: number;
  filmCount: number;
  /** Total entries across both collections. */
  count: number;
}

export interface TagContents {
  tag: TagSummary;
  articles: ArticleMeta[];
  films: DocumentaryMeta[];
}

function collect(): Map<string, TagSummary> {
  const bySlug = new Map<string, TagSummary>();

  const bump = (label: string, slug: string, kind: 'article' | 'film') => {
    const existing = bySlug.get(slug);
    if (existing) {
      if (kind === 'article') existing.articleCount += 1;
      else existing.filmCount += 1;
      existing.count = existing.articleCount + existing.filmCount;
      return;
    }
    bySlug.set(slug, {
      label,
      slug,
      articleCount: kind === 'article' ? 1 : 0,
      filmCount: kind === 'film' ? 1 : 0,
      count: 1,
    });
  };

  for (const article of getAllArticles()) {
    article.tags.forEach((label, index) => {
      const slug = article.tagSlugs[index];
      if (slug) bump(label, slug, 'article');
    });
  }

  for (const film of getAllDocumentaries()) {
    film.tags.forEach((label, index) => {
      const slug = film.tagSlugs[index];
      if (slug) bump(label, slug, 'film');
    });
  }

  return bySlug;
}

export function getAllTagSummaries(): TagSummary[] {
  return [...collect().values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  );
}

/** Returns null for an unknown slug so callers can `notFound()`. */
export function getTagContents(slug: string): TagContents | null {
  const tag = collect().get(slug);
  if (!tag) return null;

  return {
    tag,
    articles: getAllArticles().filter((article) => article.tagSlugs.includes(slug)),
    films: getAllDocumentaries().filter((film) => film.tagSlugs.includes(slug)),
  };
}

/** Human summary, e.g. "3 articles · 1 film". */
export function describeTag(tag: TagSummary): string {
  const parts: string[] = [];
  if (tag.articleCount > 0) {
    parts.push(`${tag.articleCount} ${tag.articleCount === 1 ? 'article' : 'articles'}`);
  }
  if (tag.filmCount > 0) {
    parts.push(`${tag.filmCount} ${tag.filmCount === 1 ? 'film' : 'films'}`);
  }
  return parts.join(' · ');
}
