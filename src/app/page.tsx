import Link from 'next/link';

import { ArticleList } from '@/components/ArticleList';
import { FilmPoster } from '@/components/FilmPoster';
import { site } from '@/data/site';
import { getAllArticles } from '@/lib/articles';
import { getAllDocumentaries } from '@/lib/documentaries';
export default function HomePage() {
  const articles = getAllArticles().slice(0, 5);
  const films = getAllDocumentaries();
  const featuredFilm = films[0];

  return (
    <>
      <section className="container hero">
        <p className="eyebrow">Personal site</p>

        <h1 className="hero__name">{site.name}</h1>

        <p className="hero__tagline lede">{site.tagline}</p>

        <p className="hero__intro">{site.intro}</p>

        <div className="hero__links">
          <Link href="/about" className="link-underline">
            Read the long version →
          </Link>
          <Link href="/documentaries" className="link-underline">
            Watch the films →
          </Link>
        </div>
      </section>

      <hr className="rule" />

      <section className="container section">
        <div className="split split--asymmetric">
          {/* ------------------------------ About me ------------------------------ */}
          <div>
            <div className="block-head">
              <h2 className="block-head__title">About me</h2>
              <Link href="/writing" className="block-head__more link-underline">
                All writing →
              </Link>
            </div>

            <p className="muted" style={{ marginBottom: 'var(--space-6)', maxWidth: '40rem' }}>
              A résumé told as a timeline: what I did, where I did it, what came of it — plus the
              articles that came out the other side.
            </p>

            <ArticleList articles={articles} />

            <p className="pagination-note">
              <Link href="/about" className="link-underline">
                The full timeline and honors
              </Link>
              <span className="dot-sep">·</span>
              <Link href="/tags" className="link-underline">
                Browse by tag
              </Link>
            </p>
          </div>

          {/* ---------------------------- About others ---------------------------- */}
          <div>
            <div className="block-head">
              <h2 className="block-head__title">About others</h2>
              <Link href="/documentaries" className="block-head__more link-underline">
                All films →
              </Link>
            </div>

            <p className="muted" style={{ marginBottom: 'var(--space-6)', maxWidth: '40rem' }}>
              Short documentaries about people I met while reporting, and could not stop thinking
              about afterwards.
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
                <p className="film-card__subject">A film about {featuredFilm.subject}</p>
              </Link>
            ) : (
              <div className="empty-state">
                No films yet. Add a Markdown file to <code>content/documentaries/</code>.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
