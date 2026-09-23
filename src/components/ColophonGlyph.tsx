'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * A small ornamental glyph at the foot of every page. It links to the
 * colophon and, every so often at random, quietly fades out and — a moment
 * later — comes back. Purely decorative: nothing important depends on it,
 * so it may vanish without notice, like most small things do.
 */
export function ColophonGlyph() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let timer: number;

    const scheduleBlink = () => {
      // A long spell of quiet (18–45s), then a brief disappearance.
      timer = window.setTimeout(() => {
        setHidden(true);
        timer = window.setTimeout(() => {
          setHidden(false);
          scheduleBlink();
        }, 900 + Math.random() * 1400);
      }, 18_000 + Math.random() * 27_000);
    };

    scheduleBlink();

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Link
      href="/colophon"
      className={`footer__glyph${hidden ? ' footer__glyph--hidden' : ''}`}
      aria-label="Colophon — how this site was made"
      title="Colophon"
    >
      ❋
    </Link>
  );
}
