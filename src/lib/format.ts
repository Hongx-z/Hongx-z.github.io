const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Parse "YYYY" or "YYYY-MM" into parts. Returns null if unparseable. */
function parseParts(value: string): { year: number; month?: number } | null {
  const match = /^(\d{4})(?:-(\d{1,2}))?/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : undefined;
  if (Number.isNaN(year)) return null;
  if (month !== undefined && (month < 1 || month > 12)) {
    return { year };
  }
  return { year, month };
}

/** "2022-04" -> "Apr 2022". "2015" -> "2015". */
export function formatMonth(value: string): string {
  const parts = parseParts(value);
  if (!parts) return value;
  if (parts.month === undefined) return String(parts.year);
  return `${MONTHS[parts.month - 1]} ${parts.year}`;
}

/** Timeline ranges: "Mar 2019 — Mar 2022", or "Apr 2022 — Present". */
export function formatPeriod(start: string, end?: string): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;
}

/** "2024-03-12" -> "12 March 2024". Falls back to the raw string. */
export function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return formatMonth(value);
  const [, y, m, d] = match;
  const monthIndex = Number(m) - 1;
  const monthName = MONTHS[monthIndex] ?? m;
  return `${Number(d)} ${monthName} ${y}`;
}

/** "Mar 2024" style label used in article lists. */
export function formatDateShort(value: string): string {
  const match = /^(\d{4})-(\d{2})/.exec(value.trim());
  if (!match) return formatMonth(value);
  const monthIndex = Number(match[2]) - 1;
  return `${MONTHS[monthIndex] ?? match[2]} ${match[1]}`;
}

/** Turn a human label into a URL-safe tag slug: "Field Notes" -> "field-notes". */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Rough reading time from a word count, ~220 wpm. Minimum 1 minute. */
export function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}
