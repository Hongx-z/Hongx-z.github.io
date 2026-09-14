/**
 * GitHub Pages project sites are served from a sub-path
 * (e.g. https://user.github.io/personal-site/), so any hand-written URL that
 * points at something in /public must be prefixed with the base path.
 *
 * `next/link` and `next/image` handle this automatically — use this helper
 * only for raw `src`/`href` attributes.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBase(pathname: string): string {
  if (!pathname) return pathname;

  // Leave absolute URLs and data URIs alone.
  if (/^(?:[a-z]+:)?\/\//i.test(pathname) || pathname.startsWith('data:')) {
    return pathname;
  }

  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${basePath}${normalized}`;
}
