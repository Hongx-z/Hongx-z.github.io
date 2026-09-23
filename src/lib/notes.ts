import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

import { markdownToHtml } from '@/lib/markdown';

const NOTES_DIR = path.join(process.cwd(), 'content', 'notes');

export interface Note {
  slug: string;
  /** ISO date, e.g. '2026-09-23'. */
  date: string;
  body: string;
  html: string;
}

function readNoteFile(slug: string): { date: string; body: string } {
  const raw = fs.readFileSync(path.join(NOTES_DIR, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw);
  const body = content.trim();

  if (typeof data.date !== 'string' || !data.date.trim()) {
    throw new Error(`content/notes/${slug}.md is missing a 'date' field.`);
  }

  return { date: data.date.trim(), body };
}

export function getNoteSlugs(): string[] {
  if (!fs.existsSync(NOTES_DIR)) return [];

  return fs
    .readdirSync(NOTES_DIR)
    .filter((file) => file.endsWith('.md') && !file.startsWith('_') && !file.startsWith('.'))
    .map((file) => file.replace(/\.md$/, ''));
}

/** Field notes, newest first. A note is one short observation — 50–150 words. */
export async function getAllNotes(): Promise<Note[]> {
  const notes = await Promise.all(
    getNoteSlugs().map(async (slug) => {
      const { date, body } = readNoteFile(slug);
      return { slug, date, body, html: await markdownToHtml(body) };
    }),
  );

  return notes.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}
