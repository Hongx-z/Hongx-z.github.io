import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Prose } from '@/components/Prose';
import { getSimplePage } from '@/lib/pages';

export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSimplePage('colophon.md', 'colophon');
  return {
    title: page.frontmatter.title,
    description: page.frontmatter.headline,
  };
}

export default async function ColophonPage() {
  const page = await getSimplePage('colophon.md', 'colophon');

  return (
    <section className="container section">
      <header className="about-head" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">{page.frontmatter.eyebrow ?? 'Colophon'}</p>
        <h1 className="about-head__title">{page.frontmatter.title}</h1>
        {page.frontmatter.headline ? (
          <p className="about-head__headline lede">{page.frontmatter.headline}</p>
        ) : null}
      </header>

      <hr className="rule" style={{ marginBlock: 'var(--space-7)' }} />

      <div className="colophon">
        <Prose html={page.html} />
      </div>
    </section>
  );
}
