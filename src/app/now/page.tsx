import type { Metadata } from 'next';
import Link from 'next/link';

import { FieldNoteComposer } from '@/components/FieldNoteComposer';
import { site } from '@/data/site';
import { getAllNotes } from '@/lib/notes';
import { getNowPage } from '@/lib/pages';

export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const now = await getNowPage();

  return {
    title: now?.frontmatter.title ?? 'Now',
    description:
      'What I am working on at the moment, and the field notes that come out of it — small observations that are not finished essays yet.',
  };
}

/**
 * The Now page: the home page's Now block, kept up to date, followed by every
 * field note in full. A place to look when you want to know what is actually
 * happening rather than what has been published.
 */
export default async function NowPage() {
  const now = await getNowPage();
  const notes = await getAllNotes();

  return (
    <section className="container section">
      <header className="about-head" style={{ paddingTop: 0 }}>
        <p className="eyebrow">Now · The current page</p>
        <h1 className="about-head__title">{now?.frontmatter.title ?? 'Now'}</h1>
        <p className="about-head__headline lede">
          What I am working on at the moment — and the small things I noticed along the way.
        </p>
      </header>

      {now ? (
        <>
          <hr className="rule" style={{ marginBlock: 'var(--space-7)' }} />

          <div className="now-page">
            <p className="now-block__month meta">
              {[now.frontmatter.month, now.frontmatter.updated && `Last updated: ${now.frontmatter.updated}`]
                .filter(Boolean)
                .join(' · ')}
            </p>

            <div className="now-block__list prose" dangerouslySetInnerHTML={{ __html: now.html }} />
          </div>
        </>
      ) : null}

      <hr className="rule" style={{ marginBlock: 'var(--space-7)' }} />

      <section>
        <div className="block-head">
          <h2 className="block-head__title">Field notes</h2>
          {notes.length > 0 ? (
            <span className="block-head__more meta">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              <span className="dot-sep">·</span>
              Newest first
            </span>
          ) : null}
        </div>

        <p className="muted" style={{ marginBottom: 'var(--space-6)', maxWidth: '40rem' }}>
          Short observations, written where they happened — not everything needs to become a finished
          essay. Longer pieces are under{' '}
          <Link href="/writing" className="link-underline">
            Writing
          </Link>
          .
        </p>

        {/* The list and the private "note to myself" box live together, so the
            author's edits and the readers' view never disagree. See 9.5 in the
            manual for the token it asks for. */}
        <FieldNoteComposer notes={notes} />
      </section>

      <hr className="rule" style={{ marginBlock: 'var(--space-7)' }} />

      <p className="muted">
        Written from {site.location}. If any of this is close to something you are working on,{' '}
        <a className="link-underline" href={`mailto:${site.email}`}>
          write to me
        </a>
        .
      </p>
    </section>
  );
}
