import type { Metadata } from 'next';
import Link from 'next/link';

import { ArticleList } from '@/components/ArticleList';
import { getAllArticles } from '@/lib/articles';
import { getAllTagSummaries } from '@/lib/tags';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Essays, reportage and field notes — everything written, newest first, filterable by tag.',
};

export default function WritingPage() {
  const articles = getAllArticles();
  const tags = getAllTagSummaries();

  return (
    <section className="container container--wide section">
      <header className="about-head" style={{ paddingTop: 0 }}>
        <p className="eyebrow">The written record</p>
        <h1 className="about-head__title">Writing</h1>
        <p className="about-head__headline lede">
          {articles.length} {articles.length === 1 ? 'piece' : 'pieces'} — essays, reportage and
          notes from the field, newest first.
        </p>
      </header>

      <hr className="rule" />

      <ArticleList articles={articles} />

      {tags.length > 0 ? (
        <p className="pagination-note">
          Filed under {tags.length} tags, shared with the films.{' '}
          <Link href="/tags" className="link-underline">
            Browse by tag →
          </Link>
        </p>
      ) : null}
    </section>
  );
}
