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

const FULL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "2026-09-23" -> "23 September". Used by the field notes, where the day matters. */
export function formatDayMonth(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return formatMonth(value);
  const monthIndex = Number(match[2]) - 1;
  return `${Number(match[3])} ${FULL_MONTHS[monthIndex] ?? match[2]}`;
}

/**
 * Turn a human label into a URL-safe slug: "Field Notes" -> "field-notes".
 *
 * Letters and digits from any script survive, so a Chinese tag keeps its own
 * name — 田野笔记 -> 田野笔记 — instead of being reduced to an empty string and
 * losing its page. Browsers percent-encode it in the address bar; the file on
 * disk keeps the characters.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * A dynamic route parameter as a real value.
 *
 * Next hands a page the segment percent-encoded when it contains anything
 * outside ASCII — /tags/随笔 arrives as '%E9%9A%8F%E7%AC%94'. Comparing that
 * with a slug finds nothing, so every non-Latin page 404s until it is decoded.
 */
export function decodeRouteParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    // A stray '%' makes decodeURIComponent throw; the raw value is the best
    // guess left, and it will simply not match anything.
    return value;
  }
}

/* -------------------------------------------------------------------------- */
/* Language                                                                   */
/* -------------------------------------------------------------------------- */

/** Han, kana and hangul — the scripts that count in characters, not words. */
const CJK_CHAR = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af\u3005\u3006]/g;
/** One word of a space-separated language. */
const WORD = /[\p{Letter}\p{Number}][\p{Letter}\p{Number}'’-]*/gu;

/** How many Chinese characters a text has to show before we call it Chinese. */
const CJK_FLOOR = 8;
/** …and what share of its letters they have to be. */
const CJK_SHARE = 0.2;

function countCjk(text: string): number {
  return (text.match(CJK_CHAR) ?? []).length;
}

/** Words, with the Chinese stripped out first — one character is not one word. */
function countWords(text: string): number {
  return (text.replace(CJK_CHAR, ' ').match(WORD) ?? []).length;
}

/**
 * The language a piece of text is written in, as a BCP-47 tag — or undefined
 * when it is English, which is the site's default and needs no marker.
 *
 * Only used for typography: Chinese and Japanese set better with looser
 * leading, and a Chinese paragraph should never get a Latin drop cap.
 */
export function detectLang(text: string): string | undefined {
  const sample = text.slice(0, 600);
  const cjk = countCjk(sample);
  if (cjk < CJK_FLOOR) return undefined;

  // A Chinese piece often carries English names and titles; measure against
  // letters rather than words so a handful of them cannot outvote the Han.
  const letters = sample.replace(CJK_CHAR, '').replace(/[^\p{Letter}\p{Number}]/gu, '').length;
  return cjk / (cjk + letters) >= CJK_SHARE ? 'zh' : undefined;
}

/**
 * Rough reading time. English at ~220 words a minute; Chinese counted by the
 * character, where two characters carry about as much as one English word.
 * Minimum 1 minute.
 */
export function readingTime(text: string): string {
  const words = countWords(text) + Math.round(countCjk(text) / 2);
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}
