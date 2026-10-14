import { honors } from '@/data/resume';
import { detectLang } from '@/lib/format';

export function HonorList() {
  if (honors.length === 0) {
    return (
      <div className="empty-state">
        No honors listed yet. Add them to <code>src/data/resume.ts</code>.
      </div>
    );
  }

  const sorted = [...honors].sort((a, b) => (a.year < b.year ? 1 : -1));

  return (
    <ul className="honor-list">
      {sorted.map((honor) => (
        <li key={honor.id} className="honor">
          <span className="honor__year">{honor.year}</span>

          <div>
            <h3 className="honor__title">
              {honor.href ? (
                <a
                  href={honor.href}
                  className="link-underline"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {honor.title}
                </a>
              ) : (
                honor.title
              )}
            </h3>

            {honor.issuer ? <p className="honor__issuer">{honor.issuer}</p> : null}
            {/* The note is the place for a Chinese line, so it carries its own
                language marker when it is written in one. */}
            {honor.note ? (
              <p
                className="honor__note"
                {...(detectLang(honor.note) === 'zh' ? { lang: 'zh' } : {})}
              >
                {honor.note}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
