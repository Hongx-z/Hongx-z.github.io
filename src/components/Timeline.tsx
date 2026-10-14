import { TagRow } from '@/components/TagRow';
import { timeline, type TimelineKind } from '@/data/resume';
import { detectLang, formatPeriod, slugify } from '@/lib/format';

/** A note is marked up in its own language when it is not English. */
function isCjk(text: string): boolean {
  return detectLang(text) === 'zh';
}

const KIND_LABEL: Record<TimelineKind, string> = {
  work: 'Work',
  education: 'Education',
  project: 'Project',
};

export function Timeline() {
  if (timeline.length === 0) {
    return (
      <div className="empty-state">
        No timeline entries yet. Add them to <code>src/data/resume.ts</code>.
      </div>
    );
  }

  return (
    <ol className="timeline">
      {timeline.map((entry) => (
        <li key={entry.id} className="timeline__entry" data-kind={entry.kind}>
          <div>
            <span className="timeline__period">{formatPeriod(entry.start, entry.end)}</span>
            <span className="timeline__kind">{KIND_LABEL[entry.kind]}</span>
          </div>

          <h3 className="timeline__title">{entry.title}</h3>

          {(entry.org || entry.location) && (
            <p className="timeline__org">
              {entry.org}
              {entry.org && entry.location ? ' · ' : ''}
              {entry.location}
            </p>
          )}

          <p className="timeline__summary">{entry.summary}</p>

          {/* The quieter second line — usually Chinese. Same facts, other
              language; the type is set for both. */}
          {entry.note ? (
            <p className="timeline__note" {...(isCjk(entry.note) ? { lang: 'zh' } : {})}>
              {entry.note}
            </p>
          ) : null}

          {entry.highlights && entry.highlights.length > 0 ? (
            <ul className="timeline__highlights">
              {entry.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          ) : null}

          {entry.tags && entry.tags.length > 0 ? (
            <div className="timeline__tags">
              <TagRow tags={entry.tags} tagSlugs={entry.tags.map(slugify)} />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
