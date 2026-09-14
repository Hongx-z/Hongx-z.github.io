import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import GithubSlugger from 'github-slugger';

export interface Heading {
  depth: number;
  text: string;
  id: string;
}

/** Render a Markdown string to sanitised-enough HTML for a static site. */
export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: { className: ['heading-anchor'] },
    })
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

/**
 * Pull `##`/`###` headings out of Markdown for a table of contents.
 * Slug generation mirrors rehype-slug (both use github-slugger), so the ids
 * produced here match the ids in the rendered HTML.
 */
export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();
    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!match) continue;

    // Strip inline markdown emphasis / code / links for the label.
    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`~]/g, '')
      .trim();

    headings.push({
      depth: match[1].length,
      text,
      id: slugger.slug(text),
    });
  }

  return headings;
}

/** Flatten Markdown down to a one-line plain-text excerpt. */
export function toPlainText(markdown: string, maxLength = 200): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength).trimEnd()}…`;
}
