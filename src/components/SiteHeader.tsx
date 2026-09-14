'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { site } from '@/data/site';
import { basePath } from '@/lib/base';

/**
 * `usePathname()` may or may not include the configured basePath depending on
 * how the site is served, so normalise before comparing.
 */
function useCurrentPath(): string {
  const pathname = usePathname() ?? '/';
  if (basePath && pathname.startsWith(basePath)) {
    return pathname.slice(basePath.length) || '/';
  }
  return pathname;
}

function isActive(currentPath: string, href: string): boolean {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function SiteHeader() {
  const currentPath = useCurrentPath();

  return (
    <header className="masthead">
      <div className="container masthead__inner">
        <Link href="/" className="masthead__brand">
          <span className="masthead__name">{site.name}</span>
          <span className="masthead__tagline">{site.tagline}</span>
        </Link>

        <nav className="masthead__nav" aria-label="Primary">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(currentPath, item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
