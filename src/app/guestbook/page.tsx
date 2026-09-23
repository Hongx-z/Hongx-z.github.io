import type { Metadata } from 'next';

import { GiscusComments } from '@/components/GiscusComments';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Guestbook',
  description: `Leave a note for ${site.name} — the guestbook runs on GitHub Discussions, no account needed beyond GitHub itself.`,
};

const SETUP_STEPS = [
  {
    title: 'Turn on Discussions',
    body: 'In your repository: Settings → General → Features → tick "Discussions".',
  },
  {
    title: 'Install the giscus app',
    body: 'Go to github.com/apps/giscus and install it, granting access to this repository only.',
  },
  {
    title: 'Copy four values into site.ts',
    body: 'Open giscus.app, enter your repo name, pick the "General" category, and copy repo, repoId, category and categoryId into src/data/site.ts under giscus.',
  },
];

export default function GuestbookPage() {
  const { repo, repoId, categoryId } = site.giscus;
  const configured = Boolean(repo && repoId && categoryId);

  return (
    <section className="container section">
      <header className="about-head" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">Correspondence</p>
        <h1 className="about-head__title">Guestbook</h1>
        <p className="about-head__headline lede">
          If something here stayed with you, leave a line. Notes land in the GitHub
          Discussions of this very repository — public, plain text, and mine to
          moderate, like everything else on this site.
        </p>
      </header>

      <hr className="rule" style={{ marginBlock: 'var(--space-7)' }} />

      {configured ? (
        <GiscusComments />
      ) : (
        <div className="setup-panel">
          <p className="setup-panel__title">The guestbook is not switched on yet.</p>
          <p className="setup-panel__lede">
            It runs on GitHub Discussions through{' '}
            <a className="link-underline" href="https://giscus.app" target="_blank" rel="noreferrer noopener">
              giscus
            </a>
            , so it needs no server and costs nothing. Three steps, about five minutes:
          </p>
          <ol className="setup-panel__steps">
            {SETUP_STEPS.map((step, index) => (
              <li key={step.title}>
                <p className="setup-panel__step-title">
                  <span className="setup-panel__step-number">{index + 1}</span>
                  {step.title}
                </p>
                <p className="setup-panel__step-body">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="setup-panel__lede">
            The values go into <code>giscus</code> in <code>src/data/site.ts</code>. The
            Chinese manual has a longer walkthrough. Until then,{' '}
            <a className="link-underline" href={`mailto:${site.email}`}>
              email
            </a>{' '}
            works the old-fashioned way.
          </p>
        </div>
      )}
    </section>
  );
}
