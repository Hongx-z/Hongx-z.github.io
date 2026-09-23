'use client';

import { useEffect, useState } from 'react';

import { site } from '@/data/site';

/**
 * Live clock for the footer — what time it is where the site's owner is.
 * Renders nothing until mounted (avoids a server/client hydration mismatch),
 * and nothing at all when `site.timeZone` is empty.
 */
export function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (!site.timeZone) return;

    const format = () => {
      try {
        return new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: site.timeZone,
        }).format(new Date());
      } catch {
        // An invalid time zone should not break the footer.
        return null;
      }
    };

    setTime(format());

    const interval = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  if (!site.timeZone || !time) return null;

  return (
    <span className="footer__clock">
      It is <time>{time}</time> where {site.name} is.
    </span>
  );
}
