import Link from 'next/link';

import { FilmPoster } from '@/components/FilmPoster';
import type { DocumentaryMeta } from '@/lib/documentaries';
import { formatDateShort } from '@/lib/format';

interface FilmListProps {
  films: DocumentaryMeta[];
  emptyMessage?: React.ReactNode;
}

/**
 * A compact, horizontal film row — used where a full grid would be too heavy
 * (tag pages, sidebars).
 */
export function FilmList({ films, emptyMessage }: FilmListProps) {
  if (films.length === 0) {
    return <div className="empty-state">{emptyMessage ?? 'No films here yet.'}</div>;
  }

  return (
    <ol className="post-list">
      {films.map((film) => (
        <li key={film.slug} className="post-item">
          <div className="film-row">
            <Link href={`/documentaries/${film.slug}`} className="film-row__thumb">
              <FilmPoster
                title={film.title}
                subject={film.subject}
                poster={film.poster}
                seed={film.slug}
              />
            </Link>

            <div className="film-row__body">
              <h3 className="post-item__title">
                <Link href={`/documentaries/${film.slug}`}>{film.title}</Link>
              </h3>

              <div className="post-item__foot">
                <span className="meta">
                  A film about {film.subject}
                  {film.runtime ? <span className="dot-sep">·</span> : null}
                  {film.runtime}
                  {film.date ? <span className="dot-sep">·</span> : null}
                  {film.date ? formatDateShort(film.date) : null}
                </span>
              </div>

              <p className="post-item__summary">{film.summary}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
