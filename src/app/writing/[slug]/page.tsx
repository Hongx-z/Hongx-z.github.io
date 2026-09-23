import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleList } from '@/components/ArticleList';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { Prose } from '@/components/Prose';
import { ReadingProgress } from '@/components/ReadingProgress';
import { TagRow } from '@/components/TagRow';
import { site } from '@/data/site';
import { getArticle, getArticleSlugs, getRelatedArticles } from '@/lib/articles';
import { withBase } from '@/lib/base';
import { formatDate } from '@/lib/format';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.summary,
      url: `${site.url}/writing/${article.slug}/`,
      publishedTime: article.date,
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  if (!getArticleSlugs().includes(slug)) {
    notFound();
  }

  const article = await getArticle(slug);
  const related = getRelatedArticles(article);
  const toc = article.headings.filter((heading) => heading.depth === 2);

  return (
    <article className="container container--wide">
      <ReadingProgress />

      <header className="about-head" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">
          <Link href="/writing" className="link-underline">
            Writing
          </Link>
        </p>

        <h1 className="article-header__title">{article.title}</h1>

        <p className="article-header__summary">{article.summary}</p>

        <div className="article-header__foot">
          <span className="meta">
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            <span className="dot-sep">·</span>
            {article.readingTime}
          </span>
          <CopyLinkButton />
        </div>
      </header>

      {article.cover ? (
        <figure style={{ marginTop: 'var(--space-6)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
          <img className="cover-image" src={withBase(article.cover)} alt="" />
        </figure>
      ) : null}

      <hr className="rule" style={{ marginTop: 'var(--space-6)' }} />

      <div className="article-grid section section--tight">
        {toc.length > 1 ? (
          <nav className="toc" aria-label="Contents">
            <p className="toc__title">Contents</p>
            <ul className="toc__list">
              {toc.map((heading) => (
                <li key={heading.id} data-depth={heading.depth}>
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <div aria-hidden="true" />
        )}

        <div className="article-grid__body">
          <Prose html={article.html} variant="article" />

          <footer className="article-foot">
            <p className="meta">
              Written {formatDate(article.date)}. If you want to argue with any of it,{' '}
              <a className="link-underline" href={`mailto:${site.email}`}>
                email me
              </a>
              .
            </p>

            {article.tags.length > 0 ? (
              <div className="article-foot__tags">
                <TagRow tags={article.tags} tagSlugs={article.tagSlugs} />
              </div>
            ) : null}
          </footer>

          {related.length > 0 ? (
            <section style={{ marginTop: 'var(--space-8)' }}>
              <div className="block-head">
                <h2 className="block-head__title" style={{ fontSize: 'var(--step-1)' }}>
                  Related
                </h2>
              </div>
              <ArticleList articles={related} variant="compact" />
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}
