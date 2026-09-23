'use client';

import { useEffect, useRef } from 'react';

import { site } from '@/data/site';

/**
 * Guestbook comments, backed by GitHub Discussions via giscus.app.
 *
 * Renders nothing until all four fields in `site.giscus` are filled in —
 * the guestbook page shows setup instructions instead. Once configured,
 * the giscus widget loads lazily inside this container.
 */
export function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { repo, repoId, category, categoryId } = site.giscus;
  const configured = Boolean(repo && repoId && categoryId);

  useEffect(() => {
    const container = containerRef.current;
    if (!configured || !container) return;

    // Giscus re-renders on route changes; start from a clean container.
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    const attributes: Record<string, string> = {
      'data-repo': repo,
      'data-repo-id': repoId,
      'data-category': category,
      'data-category-id': categoryId,
      // One guestbook thread per visit; new pages get their own thread.
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      // Comment box above the list reads like a guestbook, not a forum.
      'data-input-position': 'top',
      'data-theme': 'light',
      'data-lang': 'en',
      'data-loading': 'lazy',
    };

    for (const [name, value] of Object.entries(attributes)) {
      script.setAttribute(name, value);
    }

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [configured, repo, repoId, category, categoryId]);

  if (!configured) return null;

  return <div ref={containerRef} className="giscus" />;
}
