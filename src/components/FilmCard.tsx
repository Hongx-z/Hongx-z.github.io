import Link from 'next/link';

import { FilmPoster } from '@/components/FilmPoster';
import type { DocumentaryMeta } from '@/lib/documentaries';
import { formatDateShort } from '@/lib/format';

interface FilmCardProps {
  film: DocumentaryMeta;
}

export function FilmCard({ film }: FilmCardProps) {
  const facts = [film.runtime, film.location, film.date ? formatDateShort(film.date) : undefined]
    .filter(Boolean)
    .join(' · ');

  return (
    <li className="film-card">
      <Link href={`/documentaries/${film.slug}`} className="film-card__link">
        <div className="film-card__frame">
          <FilmPoster
            title={film.title}
            subject={film.subject}
            poster={film.poster}
            seed={film.slug}
          />
          <span className="film-card__play" aria-hidden="true">
            <span>{film.video ? '▶' : '·'}</span>
          </span>
        </div>

        <div className="film-card__body">
          <h3 className="film-card__title">{film.title}</h3>
          <p className="film-card__subject">A film about {film.subject}</p>
          <p className="film-card__summary">{film.summary}</p>

          <div className="film-card__foot">
            {facts ? <span>{facts}</span> : null}
            {!film.video ? (
              <span className="status-pill">Awaiting video</span>
            ) : null}
          </div>
        </div>
      </Link>
    </li>
  );
}
