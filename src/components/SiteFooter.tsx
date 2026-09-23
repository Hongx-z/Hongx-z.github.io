import Link from 'next/link';

import { LiveClock } from '@/components/LiveClock';
import { site } from '@/data/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__primary">
          <p>
            © {year} {site.name}. Written and filmed by hand.
          </p>
          <LiveClock />
        </div>

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
          <Link href="/guestbook" className="link-underline">
            Guestbook
          </Link>
          {/* The colophon is deliberately quiet: a footnote, not a feature. */}
          <Link href="/colophon" className="footer__colophon">
            Colophon
          </Link>
        </div>
      </div>
    </footer>
  );
}
