import fs from 'node:fs';
import path from 'node:path';

/**
 * List the Markdown files in a content directory as URL slugs.
 *
 * Files whose name starts with `_` or `.` are skipped, so a `_TEMPLATE.md`
 * can sit next to real content without being published.
 */
export function listMarkdownSlugs(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.md') && !/^[_.]/.test(file))
    .map((file) => path.basename(file, '.md'))
    .sort();
}
