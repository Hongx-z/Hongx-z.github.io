import Link from 'next/link';

import { FilmPoster } from '@/components/FilmPoster';
import { site } from '@/data/site';
import { getAllArticles } from '@/lib/articles';
import { getAllDocumentaries } from '@/lib/documentaries';
import { formatDateShort, formatDayMonth } from '@/lib/format';
import { getAllNotes } from '@/lib/notes';
import { getNowPage } from '@/lib/pages';

export default async function HomePage() {
  // Explain first (intro), intrigue second (stories, films), poetic third
  // (the Now block and the field notes) — in that order.
  const articles = getAllArticles().slice(0, 4);
  const films = getAllDocumentaries();
  const featuredFilm = films[0];
  const otherFilms = films.slice(1, 4);
  const notes = (await getAllNotes()).slice(0, 2);
  const now = await getNowPage();

  return (
    <>
      {/* ------------------------------ Introduction ------------------------------ */}
      <section className="container hero">
        <p className="eyebrow">Personal site</p>

        <h1 className="hero__name">{site.name}</h1>

        <p className="hero__tagline lede">{site.tagline}</p>

        <p className="hero__positioning lede">{site.positioning}</p>

        <p className="hero__intro">{site.intro}</p>

        <div className="hero__links">
          <Link href="/writing" className="link-underline">
            Read my writing →
          </Link>
          <Link href="/documentaries" className="link-underline">
            Watch my films →
          </Link>
        </div>

        {site.introNote ? <p className="hero__note">{site.introNote}</p> : null}
      </section>

      <hr className="rule" />

      {/* ------------------------------ Featured writing ------------------------------ */}
      <section className="container section">
        <div className="block-head">
          <h2 className="block-head__title">Stories</h2>
          <Link href="/writing" className="block-head__more link-underline">
            Read all stories →
          </Link>
        </div>

        {articles.length > 0 ? (
          <ol className="stories">
            {articles.map((article) => (
              <li key={article.slug} className="stories__item">
                <h3 className="stories__title">
                  <Link href={`/writing/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="stories__summary">{article.summary}</p>
                <p className="stories__meta meta">{formatDateShort(article.date)}</p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty-state">
            No stories yet. Add a Markdown file to <code>content/articles/</code>.
          </div>
        )}
      </section>

      <hr className="rule" />

      {/* ------------------------------ Featured film ------------------------------ */}
      <section className="container section">
        <div className="block-head">
          <h2 className="block-head__title">Films</h2>
          <Link href="/documentaries" className="block-head__more link-underline">
            See all films →
          </Link>
        </div>

        <p className="muted" style={{ marginBottom: 'var(--space-6)', maxWidth: '40rem' }}>
          Short documentaries about people and the places they inhabit.
        </p>

        {featuredFilm ? (
          <Link href={`/documentaries/${featuredFilm.slug}`} className="film-card__link">
            <div className="film-card__frame" style={{ marginBottom: 'var(--space-5)' }}>
              <FilmPoster
                title={featuredFilm.title}
                subject={featuredFilm.subject}
                poster={featuredFilm.poster}
                seed={featuredFilm.slug}
              />
            </div>

            <h3 className="film-card__title">{featuredFilm.title}</h3>
            <p className="film-card__subject">
              {featuredFilm.subject}
              {featuredFilm.runtime ? (
                <>
                  <span className="dot-sep">·</span>
                  {featuredFilm.runtime}
                </>
              ) : null}
            </p>
          </Link>
        ) : (
          <div className="empty-state">
            No films yet. Add a Markdown file to <code>content/documentaries/</code>.
          </div>
        )}

        {otherFilms.length > 0 ? (
          <ul className="films-shortlist">
            {otherFilms.map((film) => (
              <li key={film.slug} className="films-shortlist__item">
                <Link href={`/documentaries/${film.slug}`} className="films-shortlist__link">
                  {film.title}
                  <span className="films-shortlist__meta">
                    {film.subject}
                    {film.runtime ? (
                      <>
                        <span className="dot-sep">·</span>
                        {film.runtime}
                      </>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {/* ---------------------------------- Now ---------------------------------- */}
      {now ? (
        <>
          <hr className="rule" />

          <section className="container section now-block" id="now">
            <div className="block-head">
              <h2 className="block-head__title">{now.frontmatter.title}</h2>
              <Link href="/now" className="block-head__more link-underline">
                The full Now page →
              </Link>
            </div>

            {now.frontmatter.month || now.frontmatter.updated ? (
              <p className="now-block__month meta">
                {[
                  now.frontmatter.month,
                  now.frontmatter.updated ? `Last updated: ${now.frontmatter.updated}` : '',
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            ) : null}

            <div className="now-block__list prose" dangerouslySetInnerHTML={{ __html: now.html }} />
          </section>
        </>
      ) : null}

      {/* ------------------------------- Field notes ------------------------------ */}
      {notes.length > 0 ? (
        <>
          <hr className="rule" />

          <section className="container section">
            <div className="block-head">
              <h2 className="block-head__title">Field notes</h2>
              <Link href="/now" className="block-head__more link-underline">
                All field notes →
              </Link>
            </div>

            <p className="muted" style={{ marginBottom: 'var(--space-6)', maxWidth: '40rem' }}>
              Short observations — not everything needs to become a finished essay.
            </p>

            <ol className="field-notes">
              {notes.map((note) => (
                <li key={note.slug} className="field-notes__item">
                  <p className="field-notes__date meta">{formatDayMonth(note.date)}</p>
                  <div
                    className="field-notes__body prose"
                    dangerouslySetInnerHTML={{ __html: note.html }}
                  />
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : null}
    </>
  );
}
