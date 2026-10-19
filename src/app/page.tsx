import Link from 'next/link';

import { FilmPoster } from '@/components/FilmPoster';
import { Prose } from '@/components/Prose';
import { site } from '@/data/site';
import { getAllArticles } from '@/lib/articles';
import { getAllDocumentaries } from '@/lib/documentaries';
import { formatDateShort, formatDayMonth } from '@/lib/format';
import { getAllNotes } from '@/lib/notes';
import { getNowPage } from '@/lib/pages';

export default async function HomePage() {
  // The order is deliberate: who (name), what (the claim), how (the three
  // figures), why it matters (the quote), then the work itself.
  const articles = getAllArticles().slice(0, 3);
  const films = getAllDocumentaries();
  const featuredFilm = films.find((film) => film.featured) ?? films[0];
  const otherFilms = films.filter((film) => film.slug !== featuredFilm?.slug).slice(0, 2);
  const notes = (await getAllNotes()).slice(0, 3);
  const now = await getNowPage();

  return (
    <>
      {/* ------------------------------ Introduction ------------------------------ */}
      <section className="container hero">
        <div className="hero__grid">
          <div className="hero__main">
            <p className="eyebrow">{site.tagline}</p>

            <h1 className="hero__name">{site.name}</h1>
            <p className="hero__name-zh" lang="zh">
              {site.nameZh}
            </p>

            <p className="hero__statement">{site.statement}</p>

            <p className="hero__intro">{site.intro}</p>

            <div className="hero__links">
              <Link href="/writing" className="hero__link">
                Read the writing <span aria-hidden="true">→</span>
              </Link>
              <Link href="/documentaries" className="hero__link">
                Watch the films <span aria-hidden="true">→</span>
              </Link>
              <Link href="/about" className="hero__link">
                More about me <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {now ? (
            <aside className="hero__aside">
              <p className="hero__aside-kicker">At the moment</p>

              <Prose html={now.html} lang={now.lang} className="hero__now" />

              <p className="hero__aside-foot meta">
                {[site.location, now.frontmatter.month].filter(Boolean).join(' · ')}
              </p>

              <Link href="/now" className="link-underline hero__aside-link">
                The Now page →
              </Link>
            </aside>
          ) : null}
        </div>

        <ul className="facts">
          {site.facts.map((fact) => (
            <li key={fact.label} className="fact">
              <p className="fact__value">{fact.value}</p>
              <p className="fact__label">{fact.label}</p>
              <p className="fact__detail">{fact.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <hr className="rule" />

      {/* -------------------------------- The stance ------------------------------- */}
      <section className="container section section--tight creed">
        <blockquote className="creed__quote">
          <p>{site.quote}</p>
        </blockquote>
        <p className="creed__source meta">From the About page</p>
      </section>

      <hr className="rule" />

      {/* --------------------------------- Writing -------------------------------- */}
      <section className="container section">
        <div className="block-head">
          <h2 className="block-head__title">Writing</h2>
          <Link href="/writing" className="block-head__more link-underline">
            All writing →
          </Link>
        </div>

        {articles.length > 0 ? (
          <ol className="ledger">
            {articles.map((article) => (
              <li key={article.slug} className="ledger__item">
                <p className="ledger__date meta">
                  {formatDateShort(article.date)}
                  {article.lang === 'zh' ? (
                    <>
                      <span className="dot-sep">·</span>
                      <span lang="zh">中文</span>
                    </>
                  ) : null}
                </p>

                <div className="ledger__body">
                  <h3 className="ledger__title">
                    <Link href={`/writing/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="ledger__summary">{article.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty-state">
            No writing yet. Add a Markdown file to <code>content/articles/</code>.
          </div>
        )}
      </section>

      <hr className="rule" />

      {/* ---------------------------------- Films --------------------------------- */}
      <section className="container section">
        <div className="block-head">
          <h2 className="block-head__title">Films</h2>
          <Link href="/documentaries" className="block-head__more link-underline">
            All films →
          </Link>
        </div>

        {featuredFilm ? (
          <div className="film-feature">
            <Link
              href={`/documentaries/${featuredFilm.slug}`}
              className="film-feature__poster"
              aria-label={`${featuredFilm.title} — a film about ${featuredFilm.subject}`}
            >
              <FilmPoster
                title={featuredFilm.title}
                subject={featuredFilm.subject}
                poster={featuredFilm.poster}
                seed={featuredFilm.slug}
              />
            </Link>

            <div className="film-feature__body">
              <p className="eyebrow">Latest film</p>

              <h3 className="film-feature__title">
                <Link href={`/documentaries/${featuredFilm.slug}`}>{featuredFilm.title}</Link>
              </h3>

              <p className="film-feature__subject">
                A film about {featuredFilm.subject}
                {featuredFilm.runtime ? (
                  <>
                    <span className="dot-sep">·</span>
                    {featuredFilm.runtime}
                  </>
                ) : null}
              </p>

              <p className="film-feature__summary">{featuredFilm.summary}</p>

              <Link href={`/documentaries/${featuredFilm.slug}`} className="film-feature__link">
                Watch the film →
              </Link>
            </div>
          </div>
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

      {/* ------------------------------- Field notes ------------------------------- */}
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

            <p className="muted section__standfirst">
              Short observations — not everything needs to become a finished essay.
            </p>

            <ol className="field-notes">
              {notes.map((note) => (
                <li key={note.slug} className="field-notes__item">
                  <p className="field-notes__date meta">
                    {formatDayMonth(note.date)}
                    {note.pinned ? (
                      <>
                        <span className="dot-sep">·</span>
                        <span className="field-notes__pin">Pinned</span>
                      </>
                    ) : null}
                  </p>
                  <Prose html={note.html} lang={note.lang} className="field-notes__body" />
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : null}
    </>
  );
}
