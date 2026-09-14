import { withBase } from '@/lib/base';
import { posterBackground } from '@/lib/poster';

interface FilmPosterProps {
  title: string;
  subject: string;
  poster?: string;
  /** Seed for the procedural placeholder. Defaults to the title. */
  seed?: string;
  className?: string;
}

export function FilmPoster({ title, subject, poster, seed, className }: FilmPosterProps) {
  if (poster) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized
      <img
        className={className ?? 'film-card__poster'}
        src={withBase(poster)}
        alt={`Still from “${title}”, about ${subject}`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className="poster-placeholder"
      style={{ background: posterBackground(seed ?? title) }}
      role="img"
      aria-label={`Placeholder still for “${title}”, about ${subject}`}
    >
      <span className="poster-placeholder__subject">{subject}</span>
    </div>
  );
}
