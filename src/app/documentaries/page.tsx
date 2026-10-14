import type { Metadata } from 'next';
import Link from 'next/link';

import { FilmCard } from '@/components/FilmCard';
import { site } from '@/data/site';
import { getAllDocumentaries } from '@/lib/documentaries';

export const metadata: Metadata = {
  title: 'Films',
  description:
    'Short documentaries about other people — the filmed half of this site. Watch them here, in order, without an algorithm in the way.',
};

export default function DocumentariesPage() {
  const films = getAllDocumentaries();
  const featured = films.filter((film) => film.featured);
  const rest = films.filter((film) => !film.featured);
  const ready = films.filter((film) => film.video).length;

  return (
    <section className="container container--wide section">
      <header className="about-head" style={{ paddingTop: 0 }}>
        <p className="eyebrow">The filmed record</p>
        <h1 className="about-head__title">Films</h1>
        <p className="about-head__headline lede">
          {films.length} {films.length === 1 ? 'film' : 'films'}, each one about a single person and
          the work they do when nobody is watching.
        </p>
        <p className="muted" style={{ marginTop: 'var(--space-5)', maxWidth: '44rem' }}>
          {ready < films.length
            ? `${ready} of ${films.length} films are streaming here. The rest are still being cut, or waiting on permissions — read about them below.`
            : 'Every film here is streaming. They are short: none of them runs past half an hour.'}
        </p>

        {site.filmChannelUrl ? (
          <p style={{ marginTop: 'var(--space-5)' }}>
            <a
              className="link-underline"
              href={site.filmChannelUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Or subscribe to the channel →
            </a>
          </p>
        ) : null}
      </header>

      <hr className="rule" />

      {films.length === 0 ? (
        <div className="empty-state">
          No films yet. Add a Markdown file to <code>content/documentaries/</code> — the filename
          becomes the URL.
        </div>
      ) : (
        <>
          {featured.length > 0 ? (
            <section style={{ marginBottom: 'var(--space-9)' }}>
              <div className="block-head">
                <h2 className="block-head__title">Featured film</h2>
                <span className="block-head__more meta">Listed first on the home page</span>
              </div>

              <ul className="film-grid">
                {featured.map((film) => (
                  <FilmCard key={film.slug} film={film} />
                ))}
              </ul>
            </section>
          ) : null}

          {rest.length > 0 ? (
            <section>
              <div className="block-head">
                <h2 className="block-head__title">All films</h2>
                <span className="block-head__more meta">
                  Newest first
                  <span className="dot-sep">·</span>
                  <Link href="/tags" className="link-underline">
                    By tag
                  </Link>
                </span>
              </div>

              <ul className="film-grid">
                {rest.map((film) => (
                  <FilmCard key={film.slug} film={film} />
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </section>
  );
}
