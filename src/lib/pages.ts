import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

import { markdownToHtml } from '@/lib/markdown';

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');

export interface MarkdownPage<T = Record<string, unknown>> {
  slug: string;
  frontmatter: T;
  body: string;
  html: string;
}

export interface AboutFrontmatter {
  title: string;
  /** Short professional headline, e.g. "Writer & Documentary Filmmaker". */
  headline: string;
  location: string;
  email: string;
  /** Optional portrait image path, relative to /public. */
  portrait?: string;
  /** Free-form labels shown under the headline, e.g. ["Available for commissions"]. */
  status?: string[];
}

export interface SimplePageFrontmatter {
  title: string;
  /** Small label above the title, e.g. "Colophon". */
  eyebrow?: string;
  /** Optional one-line standfirst under the title. */
  headline?: string;
}

export interface NowFrontmatter {
  /** e.g. "September 2026" — shown as the small heading of the Now block. */
  month: string;
  /** e.g. "23 September 2026" — shown as "Last updated: …". */
  updated: string;
}

/**
 * The Now block on the home page. Optional by design: if content/pages/now.md
 * does not exist, the home page simply omits the section.
 */
export async function getNowPage(): Promise<MarkdownPage<NowFrontmatter> | null> {
  const fullPath = path.join(PAGES_DIR, 'now.md');

  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const body = content.trim();

  const frontmatter: NowFrontmatter = {
    month: typeof data.month === 'string' ? data.month.trim() : '',
    updated: typeof data.updated === 'string' ? data.updated.trim() : '',
  };

  return {
    slug: 'now',
    frontmatter,
    body,
    html: await markdownToHtml(body),
  };
}

/**
 * A standalone Markdown page from content/pages/ — currently the colophon.
 * Use this (rather than adding another bespoke loader) for future single
 * pages like a now page or a contact page.
 */
export async function getSimplePage(
  fileName: string,
  slug: string,
): Promise<MarkdownPage<SimplePageFrontmatter>> {
  const fullPath = path.join(PAGES_DIR, fileName);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing content/pages/${fileName} — it powers the /${slug} page.`);
  }

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const body = content.trim();

  const frontmatter: SimplePageFrontmatter = {
    title: typeof data.title === 'string' && data.title.trim() ? data.title.trim() : slug,
    eyebrow: typeof data.eyebrow === 'string' && data.eyebrow.trim() ? data.eyebrow.trim() : undefined,
    headline: typeof data.headline === 'string' && data.headline.trim() ? data.headline.trim() : undefined,
  };

  return {
    slug,
    frontmatter,
    body,
    html: await markdownToHtml(body),
  };
}

export async function getAboutPage(): Promise<MarkdownPage<AboutFrontmatter>> {
  const fullPath = path.join(PAGES_DIR, 'about.md');

  if (!fs.existsSync(fullPath)) {
    throw new Error('Missing content/pages/about.md — it powers the "About me" page.');
  }

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const body = content.trim();

  const frontmatter: AboutFrontmatter = {
    title: typeof data.title === 'string' && data.title.trim() ? data.title.trim() : 'About',
    headline: typeof data.headline === 'string' ? data.headline.trim() : '',
    location: typeof data.location === 'string' ? data.location.trim() : '',
    email: typeof data.email === 'string' ? data.email.trim() : '',
    portrait: typeof data.portrait === 'string' && data.portrait.trim() ? data.portrait.trim() : undefined,
    status: Array.isArray(data.status)
      ? data.status.filter((item): item is string => typeof item === 'string' && item.trim() !== '')
      : undefined,
  };

  return {
    slug: 'about',
    frontmatter,
    body,
    html: await markdownToHtml(body),
  };
}
