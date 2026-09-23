import type { Metadata } from 'next';
import Link from 'next/link';

import { ArticleList } from '@/components/ArticleList';
import { HonorList } from '@/components/HonorList';
import { Prose } from '@/components/Prose';
import { Timeline } from '@/components/Timeline';
import { site } from '@/data/site';
import { getAllArticles } from '@/lib/articles';
import { withBase } from '@/lib/base';
import { getAboutPage } from '@/lib/pages';

export const metadata: Metadata = {
  title: 'About',
  description:
    'A written record of a working life: the timeline, the honors, and the articles that came out of it.',
};

export default async function AboutPage() {
  const page = await getAboutPage();
  const articles = getAllArticles();
  const selected = articles.slice(0, 6);

  const { headline, location, email, portrait, status } = page.frontmatter;

  return (
    <>
      <section className="container about-head">
        <p className="eyebrow">About</p>
        <h1 className="about-head__title">{page.frontmatter.title}</h1>
        {headline ? <p className="about-head__headline lede">{headline}</p> : null}

        {status && status.length > 0 ? (
          <div className="about-head__status">
            {status.map((item) => (
              <span key={item} className="tag tag--plain">
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <hr className="rule" />

      <section className="container section">
        <div className="about-grid">
          <div>
            <Prose html={page.html} />
          </div>

          <aside className="about-aside">
            {portrait ? (
              // eslint-disable-next-line @next/next/no-img-element -- static export
              <img className="portrait" src={withBase(portrait)} alt={site.name} />
            ) : null}

            {location ? (
              <div className="about-aside__row">
                <span className="about-aside__label">Based in</span>
                <span className="about-aside__value">{location}</span>
              </div>
            ) : null}

            {email ? (
              <div className="about-aside__row">
                <span className="about-aside__label">Email</span>
                <a className="about-aside__value link-underline" href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            ) : null}

            <div className="about-aside__row">
              <span className="about-aside__label">Elsewhere</span>
              <span className="about-aside__value">
                {site.links.map((link, index) => (
                  <span key={link.href}>
                    {index > 0 ? <span className="dot-sep">·</span> : null}
                    <a
                      className="link-underline"
                      href={link.href}
                      {...(link.href.startsWith('http')
                        ? { target: '_blank', rel: 'noreferrer noopener' }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </span>
                ))}
              </span>
            </div>

            <Link href="/writing" className="link-underline">
              All {articles.length} articles →
            </Link>
          </aside>
        </div>
      </section>

      <hr className="rule" />

      <section className="container section">
        <div className="block-head">
          <h2 className="block-head__title">Timeline</h2>
          <span className="block-head__more meta">Newest first</span>
        </div>

        <Timeline />
      </section>

      <hr className="rule" />

      <section className="container section">
        <div className="block-head">
          <h2 className="block-head__title">Honors &amp; recognition</h2>
          <span className="block-head__more meta">Formal awards, grants, selections</span>
        </div>

        <HonorList />
      </section>

      <hr className="rule" />

      <section className="container section">
        <div className="block-head">
          <h2 className="block-head__title">Selected writing</h2>
          <Link href="/writing" className="block-head__more link-underline">
            All articles →
          </Link>
        </div>

        <ArticleList articles={selected} variant="compact" />
      </section>
    </>
  );
}
