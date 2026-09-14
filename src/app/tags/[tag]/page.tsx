import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleList } from '@/components/ArticleList';
import { FilmList } from '@/components/FilmList';
import { describeTag, getAllTagSummaries, getTagContents } from '@/lib/tags';

interface PageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return getAllTagSummaries().map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const match = getAllTagSummaries().find((entry) => entry.slug === tag);

  return {
    title: match ? `Tagged “${match.label}”` : 'Tag',
    description: match
      ? `Everything filed under ${match.label}, across the writing and the films.`
      : 'Everything filed under this tag.',
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const contents = getTagContents(tag);

  if (!contents) {
    notFound();
  }

  const { tag: summary, articles, films } = contents;
  const others = getAllTagSummaries().filter((entry) => entry.slug !== tag).slice(0, 12);

  return (
    <section className="container container--wide section">
      <header className="about-head" style={{ paddingTop: 0 }}>
        <p className="eyebrow">
          <Link href="/tags" className="link-underline">
            Tags
          </Link>
        </p>
        <h1 className="about-head__title">{summary.label}</h1>
        <p className="about-head__headline lede">{describeTag(summary)} filed under this tag.</p>
      </header>

      {articles.length > 0 ? (
        <div className="block-head">
          <h2 className="block-head__title">Articles</h2>
          <span className="block-head__more meta">{summary.articleCount}</span>
        </div>
      ) : null}

      {articles.length > 0 ? <ArticleList articles={articles} /> : null}

      {films.length > 0 ? (
        <div
          className="block-head"
          style={{ marginTop: articles.length > 0 ? 'var(--space-8)' : 0 }}
        >
          <h2 className="block-head__title">Films</h2>
          <span className="block-head__more meta">{summary.filmCount}</span>
        </div>
      ) : null}

      {films.length > 0 ? <FilmList films={films} /> : null}

      {others.length > 0 ? (
        <section style={{ marginTop: 'var(--space-9)' }}>
          <div className="block-head">
            <h2 className="block-head__title" style={{ fontSize: 'var(--step-1)' }}>
              Other tags
            </h2>
          </div>

          <div className="tag-row">
            {others.map((entry) => (
              <Link key={entry.slug} href={`/tags/${entry.slug}`} className="tag">
                {entry.label} · {entry.count}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
