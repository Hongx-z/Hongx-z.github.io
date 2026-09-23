'use client';

import { useEffect, useState } from 'react';

import { site } from '@/data/site';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/**
 * The site's one easter egg. A reader who enters the Konami code anywhere
 * (↑ ↑ ↓ ↓ ← → ← → B A) is shown a single line of text — `site.dedication`.
 * Click, tap or press Escape to dismiss. Empty text disables it entirely.
 */
export function EasterEgg() {
  const [shown, setShown] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!site.dedication) return;

    let position = 0;

    const onKey = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === KONAMI_SEQUENCE[position]) {
        position += 1;
        if (position === KONAMI_SEQUENCE.length) {
          position = 0;
          setShown(true);
          setClosing(false);
        }
      } else {
        position = key === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!shown) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shown]);

  if (!site.dedication || !shown) return null;

  const dismiss = () => {
    setClosing(true);
    window.setTimeout(() => setShown(false), 400);
  };

  return (
    <div
      className={`dedication${closing ? ' dedication--closing' : ''}`}
      onClick={dismiss}
      role="dialog"
      aria-label="A note from the author"
    >
      <p className="dedication__line">{site.dedication}</p>
      <p className="dedication__hint">Click anywhere to close</p>
    </div>
  );
}
