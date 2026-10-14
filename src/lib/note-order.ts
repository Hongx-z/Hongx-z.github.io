/**
 * How field notes are ordered.
 *
 * Shared by the build (src/lib/notes.ts) and the browser-side composer on /now,
 * so the two never disagree about which note comes first. Deliberately free of
 * Node imports — a client component can use it.
 */

export interface OrderableNote {
  slug: string;
  /** ISO date, e.g. '2026-09-23'. */
  date: string;
  pinned?: boolean;
}

/**
 * Pinned notes first, then newest first. Ties break on the slug so the order
 * never flickers between builds.
 */
export function compareNotes(a: OrderableNote, b: OrderableNote): number {
  if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  return a.slug.localeCompare(b.slug);
}
