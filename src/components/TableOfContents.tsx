'use client';

import { useState } from 'react';

import type { Heading } from '@/lib/markdown';

interface TableOfContentsProps {
  headings: Heading[];
}

/**
 * The article contents column. Sticky on wide screens, hidden on narrow ones
 * (the media query in globals.css), and collapsible either way — some pieces
 * read better without a map beside them.
 */
export function TableOfContents({ headings }: TableOfContentsProps) {
  const [open, setOpen] = useState(true);

  return (
    <nav className={`toc${open ? '' : ' toc--closed'}`} aria-label="Contents">
      <div className="toc__head">
        <p className="toc__title">Contents</p>

        <button
          type="button"
          className="toc__toggle"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </div>

      {open ? (
        <ul className="toc__list">
          {headings.map((heading) => (
            <li key={heading.id} data-depth={heading.depth}>
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
