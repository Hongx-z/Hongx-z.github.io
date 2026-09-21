import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

import { slugify } from '@/lib/format';
import { listMarkdownSlugs } from '@/lib/content';
import { extractHeadings, markdownToHtml, toPlainText, type Heading } from '@/lib/markdown';

const FILMS_DIR = path.join(process.cwd(), 'content', 'documentaries');

/* -------------------------------------------------------------------------- */
/* Video source parsing                                                       */
/* -------------------------------------------------------------------------- */

export type VideoProvider = 'youtube' | 'vimeo' | 'bilibili' | 'file';

export interface VideoSource {
  provider: VideoProvider;
  /** URL to drop into an <iframe src> or <video src>. */
  embedUrl: string;
  /** Where "open in a new tab" should point. */
  watchUrl: string;
}

/**
 * Accepts a plain URL and works out how to embed it.
 * Supported: YouTube, Vimeo, Bilibili, and direct video files (.mp4/.webm/.ogg).
 * Returns null for empty or unrecognised input — the UI degrades to a
 * placeholder frame instead of a broken player.
 */
export function parseVideoSource(input: string | undefined): VideoSource | null {
  const url = (input ?? '').trim();
  if (!url) return null;

  try {
    // Bare IDs are not supported on purpose — a full URL is unambiguous.
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1);
      return id ? youtube(id) : null;
    }

    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const id =
        parsed.searchParams.get('v') ??
        /^\/(?:embed|shorts|live)\/([^/?#]+)/.exec(parsed.pathname)?.[1] ??
        '';
      return id ? youtube(id) : null;
    }

    if (host.endsWith('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop() ?? '';
      return /^\d+$/.test(id)
        ? { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}`, watchUrl: url }
        : null;
    }

    if (host.endsWith('bilibili.com')) {
      const bvid = /\/video\/(BV[0-9A-Za-z]+)/.exec(parsed.pathname)?.[1];
      return bvid
        ? {
            provider: 'bilibili',
            embedUrl: `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1&danmaku=0`,
            watchUrl: url,
          }
        : null;
    }

    if (/\.(mp4|webm|ogv|ogg|m4v)$/i.test(parsed.pathname)) {
      return { provider: 'file', embedUrl: url, watchUrl: url };
    }

    return null;
  } catch {
    return null;
  }
}

function youtube(id: string): VideoSource {
  return {
    provider: 'youtube',
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
  };
}

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface DocumentaryMeta {
  slug: string;
  title: string;
  /** The person the film is about. */
  subject: string;
  /** "YYYY-MM-DD" — the date the film was completed/published. */
  date: string;
  /** Where it was shot. */
  location?: string;
  /** Human-readable length, e.g. "18 min". */
  runtime?: string;
  /** One-paragraph synopsis shown in listings. */
  summary: string;
  tags: string[];
  tagSlugs: string[];
  videoUrl?: string;
  video: VideoSource | null;
  poster?: string;
  /** e.g. { Director: "Your Name", Sound: "Someone Else" } */
  credits: Record<string, string>;
  /** Set true once the film is ready to show. */
  featured: boolean;
  draft: boolean;
}

export interface Documentary extends DocumentaryMeta {
  body: string;
  html: string;
  headings: Heading[];
}

/* -------------------------------------------------------------------------- */
/* Frontmatter parsing                                                        */
/* -------------------------------------------------------------------------- */

function asString(value: unknown): string | undefined {
  const text = typeof value === 'string' ? value.trim() : '';
  return text || undefined;
}

function asTagList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function asCredits(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .map(([key, val]) => [key, typeof val === 'string' ? val.trim() : ''])
      .filter(([, val]) => val),
  );
}

function readFilmFile(slug: string): DocumentaryMeta & { body: string } {
  const fullPath = path.join(FILMS_DIR, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(
      `Documentary "${slug}" not found. Expected a Markdown file at content/documentaries/${slug}.md`,
    );
  }

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  const title = asString(data.title);
  if (!title) {
    throw new Error(
      `content/documentaries/${slug}.md is missing a required "title" in its frontmatter.`,
    );
  }

  const subject = asString(data.subject);
  if (!subject) {
    throw new Error(
      `content/documentaries/${slug}.md is missing a required "subject" in its frontmatter ` +
        '(the name of the person the film is about).',
    );
  }

  const date = asString(data.date) ?? '';
  const tags = asTagList(data.tags);
  const body = content.trim();
  const videoUrl = asString(data.videoUrl);

  return {
    slug,
    title,
    subject,
    date,
    location: asString(data.location),
    runtime: asString(data.runtime),
    summary: asString(data.summary) ?? toPlainText(body, 220),
    tags,
    tagSlugs: tags.map(slugify),
    videoUrl,
    video: parseVideoSource(videoUrl),
    poster: asString(data.poster),
    credits: asCredits(data.credits),
    featured: data.featured === true,
    draft: data.draft === true,
    body,
  };
}

/* -------------------------------------------------------------------------- */
/* Collection API                                                             */
/* -------------------------------------------------------------------------- */

export function getDocumentarySlugs(): string[] {
  return listMarkdownSlugs(FILMS_DIR);
}

function includeDrafts(): boolean {
  return process.env.NODE_ENV === 'development';
}

function sortFilms(films: DocumentaryMeta[]): DocumentaryMeta[] {
  return [...films].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title);
  });
}

export function getAllDocumentaries(): DocumentaryMeta[] {
  const films = getDocumentarySlugs()
    .map((slug) => readFilmFile(slug))
    .filter((film) => includeDrafts() || !film.draft)
    .map(({ body: _body, ...meta }) => meta);

  return sortFilms(films);
}

export async function getDocumentary(slug: string): Promise<Documentary> {
  const { body, ...meta } = readFilmFile(slug);
  const html = await markdownToHtml(body);
  return { ...meta, body, html, headings: extractHeadings(body) };
}
