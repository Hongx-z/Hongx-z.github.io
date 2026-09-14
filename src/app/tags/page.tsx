import type { Metadata } from 'next';
import Link from 'next/link';

import { ArticleList } from '@/components/ArticleList';
import { FilmList } from '@/components/FilmList';
import { getAllArticles } from '@/lib/articles';
import { describeTag, getAllTagSummaries, getTagContents } from '@/lib/tags';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Every topic this site has touched, across both the writing and the films.',
};

export default function TagsPage() {
  const tags = getAllTagSummaries();
  const articles = getAllArticles();

  return (
    <section className="container container--wide section">
      <header className="about-head" style={{ paddingTop: 0 }}>
        <p className="eyebrow">Index</p>
        <h1 className="about-head__title">Tags</h1>
        <p className="about-head__headline lede">
          {tags.length} {tags.length === 1 ? 'tag' : 'tags'} across the writing and the films.
        </p>
        <p className="muted" style={{ marginTop: 'var(--space-5)', maxWidth: '44rem' }}>
          The same vocabulary files both halves of the site, so an essay and a documentary about
          night work end up together.
        </p>
      </header>

      {tags.length === 0 ? (
        <div className="empty-state">
          No tags yet — add a <code>tags:</code> list to any article or film&rsquo;s frontmatter.
        </div>
      ) : (
        <>
          <div className="tag-cloud">
            {tags.map((tag) => (
              <Link key={tag.slug} href={`/tags/${tag.slug}`} className="tag-cloud__item">
                <span className="tag-cloud__label">{tag.label}</span>
                <span className="tag-cloud__count">{tag.count}</span>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-9)' }}>
            {tags.map((tag) => {
              const contents = getTagContents(tag.slug);
              if (!contents) return null;

              return (
                <section key={tag.slug} style={{ marginBottom: 'var(--space-8)' }}>
                  <div className="block-head">
                    <h2 className="block-head__title">
                      <Link href={`/tags/${tag.slug}`} className="link-underline">
                        {tag.label}
                      </Link>
                    </h2>
                    <span className="block-head__more meta">{describeTag(tag)}</span>
                  </div>

                  {contents.articles.length > 0 ? (
                    <ArticleList articles={contents.articles} variant="compact" />
                  ) : null}

                  {contents.films.length > 0 ? (
                    <div style={{ marginTop: contents.articles.length > 0 ? 'var(--space-5)' : 0 }}>
                      <FilmList films={contents.films} />
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>

          <p className="pagination-note">
            {articles.length} articles in total.{' '}
            <Link href="/writing" className="link-underline">
              Read them all →
            </Link>
          </p>
        </>
      )}
    </section>
  );
}
