import Link from 'next/link';

import { TagRow } from '@/components/TagRow';
import type { ArticleMeta } from '@/lib/articles';
import { formatDate } from '@/lib/format';

interface ArticleListProps {
  articles: ArticleMeta[];
  /** Compact hides summaries — good for sidebars and "related" blocks. */
  variant?: 'full' | 'compact';
  emptyMessage?: React.ReactNode;
}

export function ArticleList({ articles, variant = 'full', emptyMessage }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="empty-state">
        {emptyMessage ?? (
          <>
            Nothing here yet. Add a Markdown file to <code>content/articles/</code> and it will
            appear on this page.
          </>
        )}
      </div>
    );
  }

  const compact = variant === 'compact';

  return (
    <ol className={`post-list${compact ? ' post-list--compact' : ''}`}>
      {articles.map((article) => (
        <li key={article.slug} className="post-item">
          <time className="post-item__date" dateTime={article.date}>
            {formatDate(article.date)}
          </time>

          <h3 className="post-item__title">
            <Link href={`/writing/${article.slug}`}>{article.title}</Link>
          </h3>

          {!compact && article.summary ? (
            <p className="post-item__summary">{article.summary}</p>
          ) : null}

          <div className="post-item__foot">
            {!compact && article.tags.length > 0 ? (
              <TagRow tags={article.tags} tagSlugs={article.tagSlugs} />
            ) : null}
            <span className="meta">{article.readingTime}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
