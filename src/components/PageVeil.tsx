'use client';

import { useEffect, useRef, useState } from 'react';

/** The event the footer glyph fires; the veil below listens for it. */
export const PAGE_VEIL_EVENT = 'site:toggle-veil';

/** Ask the page to go blank (or to come back). */
export function togglePageVeil(): void {
  window.dispatchEvent(new Event(PAGE_VEIL_EVENT));
}

/**
 * The blank page — the third and quietest of the site's small jokes.
 *
 * Click the ❋ at the foot of the page and everything fades away: masthead,
 * text, footer, all of it, leaving a single sheet of paper with nothing on it
 * but the same little ornament. Click anywhere on that sheet (or press
 * Escape) and the page comes back exactly as it was.
 *
 * Nothing is stored, nothing is fetched, nothing is lost: a reload always
 * returns the site as it was. Unmounting the component — or deleting the one
 * line in SiteFooter.tsx that renders the glyph — removes the joke entirely.
 */
export function PageVeil() {
  const [open, setOpen] = useState(false);
  const veilRef = useRef<HTMLDivElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  // Listen for the toggle. The glyph's click handler only dispatches an
  // event, so the two components stay independent of each other.
  useEffect(() => {
    const toggle = () => setOpen((value) => !value);
    window.addEventListener(PAGE_VEIL_EVENT, toggle);
    return () => window.removeEventListener(PAGE_VEIL_EVENT, toggle);
  }, []);

  // Blank the page, take focus while it is blank, hand it back afterwards.
  useEffect(() => {
    document.documentElement.classList.toggle('is-veiled', open);

    if (open) {
      returnFocusTo.current = document.activeElement as HTMLElement | null;
      veilRef.current?.focus({ preventScroll: true });
      return;
    }

    const previous = returnFocusTo.current;
    returnFocusTo.current = null;
    if (previous?.focus) {
      // Let the page become visible again before moving focus back into it.
      const id = window.setTimeout(() => previous.focus({ preventScroll: true }), 0);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  // Escape is the keyboard's way back.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div
      ref={veilRef}
      className={`veil${open ? ' veil--open' : ''}`}
      tabIndex={open ? -1 : undefined}
      aria-hidden={open ? undefined : true}
      role={open ? 'dialog' : undefined}
      aria-label={open ? 'A blank page. Click anywhere to bring it back.' : undefined}
      onClick={() => setOpen(false)}
    >
      <span className="veil__mark" aria-hidden="true">
        ❋
      </span>
      <span className="veil__hint">Click anywhere to bring it back</span>
    </div>
  );
}
