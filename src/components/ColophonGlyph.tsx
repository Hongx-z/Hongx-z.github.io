'use client';

import { useEffect, useState } from 'react';

import { togglePageVeil } from '@/components/PageVeil';

/**
 * A small ornamental glyph at the foot of every page.
 *
 * It does two things, both quietly. Every so often, at random, it fades out
 * and — a moment later — comes back, as if it had briefly forgotten what it
 * was doing. And if you click it, the page itself does the same thing: every
 * word vanishes, and one more click brings them all back. (See PageVeil.)
 *
 * Purely decorative: nothing important depends on it, so it may vanish
 * without notice, like most small things do.
 */
export function ColophonGlyph() {
  const [dimmed, setDimmed] = useState(false);

  useEffect(() => {
    let timer: number;

    const scheduleBlink = () => {
      // A long spell of quiet (18–45s), then a brief disappearance.
      timer = window.setTimeout(() => {
        setDimmed(true);
        timer = window.setTimeout(() => {
          setDimmed(false);
          scheduleBlink();
        }, 900 + Math.random() * 1400);
      }, 18_000 + Math.random() * 27_000);
    };

    scheduleBlink();

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <button
      type="button"
      className={`footer__glyph${dimmed ? ' footer__glyph--hidden' : ''}`}
      aria-label="Clear the page"
      title="Clear the page"
      onClick={togglePageVeil}
    >
      ❋
    </button>
  );
}
