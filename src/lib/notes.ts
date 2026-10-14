import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

import { detectLang } from '@/lib/format';
import { markdownToHtml } from '@/lib/markdown';

import { compareNotes } from '@/lib/note-order';

const NOTES_DIR = path.join(process.cwd(), 'content', 'notes');

export interface Note {
  slug: string;
  /** ISO date, e.g. '2026-09-23'. */
  date: string;
  /** Pinned notes sit above the newest ones. Set `pinned: true` in the file. */
  pinned: boolean;
  body: string;
  html: string;
  /**
   * 'zh' when the note is written in Chinese, so the page can set it with the
   * looser leading Chinese wants. Undefined for English.
   */
  lang?: string;
}

function readNoteFile(slug: string): { date: string; pinned: boolean; body: string } {
  const raw = fs.readFileSync(path.join(NOTES_DIR, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw);
  const body = content.trim();

  if (typeof data.date !== 'string' || !data.date.trim()) {
    throw new Error(`content/notes/${slug}.md is missing a 'date' field.`);
  }

  return { date: data.date.trim(), pinned: data.pinned === true, body };
}

export function getNoteSlugs(): string[] {
  if (!fs.existsSync(NOTES_DIR)) return [];

  return fs
    .readdirSync(NOTES_DIR)
    .filter((file) => file.endsWith('.md') && !file.startsWith('_') && !file.startsWith('.'))
    .map((file) => file.replace(/\.md$/, ''));
}

/** Field notes, pinned first and then newest first. One note is one short observation. */
export async function getAllNotes(): Promise<Note[]> {
  const notes = await Promise.all(
    getNoteSlugs().map(async (slug) => {
      const { date, pinned, body } = readNoteFile(slug);
      return {
        slug,
        date,
        pinned,
        body,
        html: await markdownToHtml(body),
        lang: detectLang(body),
      };
    }),
  );

  return notes.sort(compareNotes);
}
