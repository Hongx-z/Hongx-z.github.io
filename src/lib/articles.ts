import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

import { readingTime, slugify } from '@/lib/format';
import { extractHeadings, markdownToHtml, toPlainText, type Heading } from '@/lib/markdown';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

export interface ArticleMeta {
  slug: string;
  title: string;
  /** ISO date, "YYYY-MM-DD". */
  date: string;
  summary: string;
  tags: string[];
  tagSlugs: string[];
  cover?: string;
  draft: boolean;
  readingTime: string;
}

export interface Article extends ArticleMeta {
  /** Raw Markdown body, without frontmatter. */
  body: string;
  /** Rendered HTML. */
  html: string;
  headings: Heading[];
}

/* -------------------------------------------------------------------------- */
/* Frontmatter parsing                                                        */
/* -------------------------------------------------------------------------- */

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function asTagList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function readArticleFile(slug: string): ArticleMeta & { body: string } {
  const fullPath = path.join(ARTICLES_DIR, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(
      `Article "${slug}" not found. Expected a Markdown file at content/articles/${slug}.md`,
    );
  }

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  const title = asString(data.title);
  if (!title) {
    throw new Error(`content/articles/${slug}.md is missing a required "title" in its frontmatter.`);
  }

  const date = asString(data.date);
  if (!date) {
    throw new Error(`content/articles/${slug}.md is missing a required "date" in its frontmatter.`);
  }

  const tags = asTagList(data.tags);
  const body = content.trim();

  return {
    slug,
    title,
    date,
    summary: asString(data.summary) || toPlainText(body, 180),
    tags,
    tagSlugs: tags.map(slugify),
    cover: asString(data.cover) || undefined,
    draft: data.draft === true,
    readingTime: readingTime(body),
    body,
  };
}

/* -------------------------------------------------------------------------- */
/* Collection API                                                             */
/* -------------------------------------------------------------------------- */

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

/** Drafts are visible while running `npm run dev`, hidden in production builds. */
function includeDrafts(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function getAllArticles(): ArticleMeta[] {
  return getArticleSlugs()
    .map((slug) => readArticleFile(slug))
    .filter((article) => includeDrafts() || !article.draft)
    .map(({ body: _body, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}

export async function getArticle(slug: string): Promise<Article> {
  const { body, ...meta } = readArticleFile(slug);
  const html = await markdownToHtml(body);
  return { ...meta, body, html, headings: extractHeadings(body) };
}

/* -------------------------------------------------------------------------- */
/* Relations                                                                  */
/* -------------------------------------------------------------------------- */

/** Articles sharing the most tags with the given one, newest first. */
export function getRelatedArticles(article: ArticleMeta, limit = 3): ArticleMeta[] {
  return getAllArticles()
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => ({
      candidate,
      shared: candidate.tagSlugs.filter((tag) => article.tagSlugs.includes(tag)).length,
    }))
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => b.shared - a.shared || (a.candidate.date < b.candidate.date ? 1 : -1))
    .slice(0, limit)
    .map((entry) => entry.candidate);
}
