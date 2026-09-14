import Link from 'next/link';

import { site } from '@/data/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {year} {site.name}. Written and filmed by hand.
        </p>

        <div className="footer__links">
          {site.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link-underline"
              {...(link.href.startsWith('http')
                ? { target: '_blank', rel: 'noreferrer noopener' }
                : {})}
            >
              {link.label}
            </a>
          ))}
          <Link href="/writing" className="link-underline">
            Writing
          </Link>
          <Link href="/documentaries" className="link-underline">
            Films
          </Link>
        </div>
      </div>
    </footer>
  );
}
