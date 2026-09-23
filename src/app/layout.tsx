import type { Metadata } from 'next';

import { AudioToggle } from '@/components/AudioToggle';
import { BackToTop } from '@/components/BackToTop';
import { EasterEgg } from '@/components/EasterEgg';
import { PageVeil } from '@/components/PageVeil';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { site } from '@/data/site';
import { withBase } from '@/lib/base';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  icons: {
    // Metadata URLs are not rewritten for basePath, so prefix it by hand.
    icon: [{ url: withBase('/favicon.svg'), type: 'image/svg+xml' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Everything visible lives in .page so the blank-page easter egg can
            fade it all out at once — see PageVeil. */}
        <div className="page">
          <a className="skip-link" href="#main">
            Skip to content
          </a>

          <SiteHeader />

          <main id="main">{children}</main>

          <SiteFooter />

          {/* Global, optional extras. Each one hides itself when unconfigured. */}
          <BackToTop />
          <AudioToggle />
          <EasterEgg />
        </div>

        {/* Not part of the page: the sheet of paper that replaces it. */}
        <PageVeil />
      </body>
    </html>
  );
}
