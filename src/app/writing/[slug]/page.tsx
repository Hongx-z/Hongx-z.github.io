import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleList } from '@/components/ArticleList';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { Prose } from '@/components/Prose';
import { ReadingProgress } from '@/components/ReadingProgress';
import { TableOfContents } from '@/components/TableOfContents';
import { TagRow } from '@/components/TagRow';
import { site } from '@/data/site';
import { getArticle, getArticleSlugs, getRelatedArticles } from '@/lib/articles';
import { withBase } from '@/lib/base';
import { decodeRouteParam, formatDate } from '@/lib/format';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = decodeRouteParam((await params).slug);
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
  const slug = decodeRouteParam((await params).slug);

  if (!getArticleSlugs().includes(slug)) {
    notFound();
  }

  const article = await getArticle(slug);
  const related = getRelatedArticles(article);
  const toc = article.headings.filter((heading) => heading.depth === 2);
  // Pieces with one heading or none don't get a contents column at all —
  // an empty 16rem gutter beside a short essay is just blank paper.
  const hasToc = toc.length > 1;

  return (
    <article className="container">
      <ReadingProgress />

      <div className="article-grid section section--tight">
        {hasToc ? <TableOfContents headings={toc} /> : null}

        <div className="article-grid__body">
          <header className="article-header">
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
                {article.source ? (
                  <>
                    <span className="dot-sep">·</span>
                    <a
                      className="link-underline"
                      href={article.source}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {article.lang === 'zh' ? '阅读原文' : 'Read the original'}
                    </a>
                  </>
                ) : null}
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

          <Prose html={article.html} variant="article" lang={article.lang} />

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
