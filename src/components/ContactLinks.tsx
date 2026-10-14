'use client';

import { useState } from 'react';

import { site, type ContactLink } from '@/data/site';

interface ContactLinksProps {
  /**
   * Print the account id next to each copyable entry. The footer stays compact
   * and leaves it off; the about page shows it, because that is the page
   * someone reads when they actually want to find you.
   */
  showHandles?: boolean;
}

/**
 * Where to find me — the footer's list and the about page's, from one source.
 *
 * Somewhere to find someone is not always a URL. WeChat has no public profile
 * page at all, and a link to a profile that does not exist is worse than no
 * link. So an entry with an `href` is a link, and an entry with a `handle` is
 * a copyable id: click the mark, the id is on your clipboard, ready to paste
 * into whichever app it belongs to.
 */
export function ContactLinks({ showHandles = false }: ContactLinksProps) {
  const [status, setStatus] = useState<{ label: string; ok: boolean } | null>(null);

  const copy = async (link: ContactLink) => {
    if (!link.handle) return;

    try {
      await navigator.clipboard.writeText(link.handle);
      setStatus({ label: link.label, ok: true });
    } catch {
      // Older browsers, or a page not served over https, refuse the clipboard.
      setStatus({ label: link.label, ok: false });
    }

    window.setTimeout(
      () => setStatus((current) => (current?.label === link.label ? null : current)),
      2000,
    );
  };

  return (
    <>
      {site.links.map((link, index) => {
        const copied = status?.label === link.label;

        return (
          <span key={link.label} className="contact">
            {index > 0 ? (
              <span className="dot-sep" aria-hidden="true">
                ·
              </span>
            ) : null}

            {link.href ? (
              <a
                className="link-underline"
                href={link.href}
                {...(link.href.startsWith('http')
                  ? { target: '_blank', rel: 'noreferrer noopener' }
                  : {})}
              >
                {link.label}
              </a>
            ) : (
              <span className="contact__label">{link.label}</span>
            )}

            {link.handle ? (
              <>
                {showHandles ? <span className="contact__handle">{link.handle}</span> : null}
                <button
                  type="button"
                  className={`contact__copy${copied ? ' contact__copy--done' : ''}`}
                  onClick={() => void copy(link)}
                  title={`Copy ${link.handle}`}
                  aria-label={`Copy ${link.label} id: ${link.handle}`}
                >
                  {copied ? (status?.ok ? 'Copied' : 'Copy failed') : '⧉'}
                </button>
              </>
            ) : null}
          </span>
        );
      })}
    </>
  );
}
