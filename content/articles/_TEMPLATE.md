---
# ===========================================================================
# ARTICLE TEMPLATE
# ===========================================================================
# Files starting with "_" are ignored by the site, so this one is safe to keep
# as a reference. To publish an article:
#
#   1. Copy this file to content/articles/<your-slug>.md
#      The filename becomes the URL: content/articles/my-piece.md -> /writing/my-piece/
#   2. Fill in the frontmatter below (delete the "#" to uncomment optional lines)
#   3. Write the body in Markdown
#
# Required: title, date.  Everything else is optional.
# ===========================================================================

title: Your title goes here
date: '2026-01-01'                     # YYYY-MM-DD. Controls ordering (newest first).
summary: >-
  One or two sentences. Shown in lists, in search results and in social
  previews. If you leave this out, the first ~180 characters of the body are
  used instead.
tags:
  - Essay                              # Your own words. "Field Notes" and
  - Craft                              # "field-notes" are the same tag.
# cover: /images/your-image.jpg        # optional; file goes in public/images/
# draft: true                          # optional; hides it from the built site
---

Opening paragraph. On an article this is set as a drop cap, so lead with
something worth setting large.

## A section heading

Two or more `##` headings and an automatic table of contents appears in the
left margin on wide screens. Headings also get anchor links.

Body text is serif, sized for reading. Everything below works:

- **bold**, *italic*, `inline code`, [links](https://example.com)
- numbered lists, nested lists
- > blockquotes, with a rule on the left

1. Numbered
2. Lists

> A pull quote, if you have one good enough to earn it.

### A sub-heading

| Column | Value |
| --- | ---: |
| Left-aligned | Right-aligned |

```js
// Code blocks get a monospace face and a scroll container.
const hello = 'world';
```

An image, if you have one in `public/images/`:

![Describe the image for screen readers](/images/your-image.jpg)

---

A horizontal rule is a good way to close a piece.
