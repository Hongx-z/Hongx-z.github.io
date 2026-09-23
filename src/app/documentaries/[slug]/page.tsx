import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FilmPoster } from '@/components/FilmPoster';
import { Prose } from '@/components/Prose';
import { ReadingProgress } from '@/components/ReadingProgress';
import { TagRow } from '@/components/TagRow';
import { VideoPlayer } from '@/components/VideoPlayer';
import { site } from '@/data/site';
import {
  getAllDocumentaries,
  getDocumentary,
  getDocumentarySlugs,
} from '@/lib/documentaries';
import { formatDate } from '@/lib/format';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getDocumentarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const film = await getDocumentary(slug);

  return {
    title: `${film.title} — a film about ${film.subject}`,
    description: film.summary,
    openGraph: {
      type: 'video.other',
      title: film.title,
      description: film.summary,
      url: `${site.url}/documentaries/${film.slug}/`,
    },
  };
}

export default async function DocumentaryPage({ params }: PageProps) {
  const { slug } = await params;

  if (!getDocumentarySlugs().includes(slug)) {
    notFound();
  }

  const film = await getDocumentary(slug);
  const all = getAllDocumentaries();
  const index = all.findIndex((entry) => entry.slug === film.slug);
  const previous = index > 0 ? all[index - 1] : undefined;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;

  const credits = Object.entries(film.credits);

  return (
    <article className="container container--wide">
      <ReadingProgress />

      <header className="film-header">
        <p className="eyebrow">
          <Link href="/documentaries" className="link-underline">
            About others
          </Link>
        </p>

        <h1 className="film-header__title">{film.title}</h1>
        <p className="film-header__subject">A film about {film.subject}</p>

        <div className="film-meta">
          {film.date ? (
            <div className="film-meta__item">
              <span className="film-meta__label">Completed</span>
              <span className="film-meta__value">{formatDate(film.date)}</span>
            </div>
          ) : null}

          {film.runtime ? (
            <div className="film-meta__item">
              <span className="film-meta__label">Runtime</span>
              <span className="film-meta__value">{film.runtime}</span>
            </div>
          ) : null}

          {film.location ? (
            <div className="film-meta__item">
              <span className="film-meta__label">Shot in</span>
              <span className="film-meta__value">{film.location}</span>
            </div>
          ) : null}

          <div className="film-meta__item">
            <span className="film-meta__label">Status</span>
            <span className="film-meta__value">
              {film.video ? 'Streaming' : 'Not yet available'}
            </span>
          </div>
        </div>
      </header>

      <VideoPlayer title={film.title} source={film.video} poster={film.poster} slug={film.slug} />

      <div className="article-grid section section--tight">
        {film.poster ? (
          <div className="toc">
            <p className="toc__title">Still</p>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <FilmPoster
                title={film.title}
                subject={film.subject}
                poster={film.poster}
                seed={film.slug}
                className="portrait"
              />
            </div>
          </div>
        ) : (
          <div aria-hidden="true" />
        )}

        <div className="article-grid__body">
          <Prose html={film.html} />

          {credits.length > 0 ? (
            <section className="credits" aria-label="Credits">
              {credits.map(([role, name]) => (
                <div key={role} className="credit">
                  <span className="credit__role">{role}</span>
                  <span className="credit__name">{name}</span>
                </div>
              ))}
            </section>
          ) : null}

          {film.tags.length > 0 ? (
            <div style={{ marginTop: 'var(--space-6)' }}>
              <TagRow tags={film.tags} tagSlugs={film.tagSlugs} />
            </div>
          ) : null}

          <nav className="article-foot" aria-label="More films">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
              {previous ? (
                <Link href={`/documentaries/${previous.slug}`} className="link-underline">
                  ← {previous.title}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/documentaries/${next.slug}`} className="link-underline">
                  {next.title} →
                </Link>
              ) : null}
            </div>
          </nav>
        </div>
      </div>
    </article>
  );
}
