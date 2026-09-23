# Personal site

A personal site in two halves, plus an account of where I am right now:

- **Writing** — a written record. A résumé told as a timeline (what you did, where, what came of it), the honors you were given, and every article you have written.
- **Films** — a filmed record. Short documentaries about other people, each with its own page and player.
- **Now & field notes** — a small "what I am doing this month" block and short observations, so the site reads as alive rather than finished.

The home page is ordered deliberately: **explain first, intrigue second, become poetic third** —

```
Introduction  →  Stories  →  Films  →  Now  →  Field notes
   who you are     writing     films     what's current   short notes
```

Built with **Next.js (static export)** so it hosts on **GitHub Pages** for free, with no server and no database. All content is Markdown files in the repository.

> **中文详细说明书：[`docs/使用说明书.md`](docs/使用说明书.md)** — 从环境准备、本地运行、生成 `out/` 目录，到内容编辑、改样式、部署上线的完整操作手册。第一次上手建议直接看这份。

---

## Contents

- [Quick start](#quick-start)
- [Where everything lives](#where-everything-lives)
- [Writing an article](#writing-an-article)
- [Adding a documentary](#adding-a-documentary)
- [Adding a field note, and keeping the Now block current](#adding-a-field-note-and-keeping-the-now-block-current)
- [Editing your résumé (timeline & honors)](#editing-your-résumé-timeline--honors)
- [Site-wide settings](#site-wide-settings)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Custom domain](#custom-domain)
- [Troubleshooting](#troubleshooting)

---

## Quick start

Requires **Node.js 20.9 or newer** (22 recommended).

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

To check the exact output GitHub Pages will serve:

```bash
npm run build     # writes a static site to ./out
npm run preview   # serves ./out at http://localhost:3000
```

`npm run build` is the real test: it type-checks everything and prerenders every page. If a Markdown file is malformed, the build fails with the filename in the error.

**Do not open `out/index.html` by double-clicking it.** Asset paths are absolute (`/_next/...`), so over `file://` the browser looks for them at the root of your filesystem and you get an unstyled page. Always use `npm run preview`.

## Starting a new piece of content

`content/articles/_TEMPLATE.md` and `content/documentaries/_TEMPLATE.md` are fully commented templates. Copy one, rename it, fill it in.

Files whose name starts with `_` or `.` are ignored by the build, so templates can live safely inside the content directories.

---

## Where everything lives

```
content/
  articles/          <- one .md file per article; filename = URL slug
  documentaries/     <- one .md file per film; filename = URL slug
  notes/             <- field notes: one short observation per file
  pages/
    about.md         <- the prose on the About page
    now.md           <- "Now" prose, shared by the home block and /now
    colophon.md      <- the quiet "making of" page (/colophon)

src/
  app/               <- pages (Next.js App Router)
    page.tsx             /                 home: intro, stories, films, now, notes
    about/page.tsx       /about            résumé + timeline + honors
    now/page.tsx         /now              the Now block in full + all field notes
    writing/page.tsx     /writing          article list
    writing/[slug]/      /writing/<slug>   article detail
    tags/page.tsx        /tags             all tags
    tags/[tag]/          /tags/<tag>       articles and films under one tag
    documentaries/       /documentaries    film grid
    documentaries/[slug] /documentaries/<slug>
    guestbook/page.tsx   /guestbook        comments via giscus
    colophon/page.tsx    /colophon         the making-of page
    sitemap.ts           /sitemap.xml
    globals.css          all styling
  components/        <- reusable UI pieces (incl. AudioToggle, EasterEgg,
                        ColophonGlyph, PageVeil, ReadingProgress,
                        CopyLinkButton, BackToTop, LiveClock)
  data/
    site.ts          <- name, roles, intro, nav, social links  (start here)
    resume.ts        <- the timeline and honors arrays
  lib/
    articles.ts      <- reads content/articles
    documentaries.ts <- reads content/documentaries
    notes.ts         <- reads content/notes
    pages.ts         <- reads content/pages (about, now, colophon)
    tags.ts          <- the tag index, spanning both collections
    markdown.ts      <- Markdown -> HTML
    format.ts        <- dates, slugs, reading time
    poster.ts        <- procedural placeholder art for films
    base.ts          <- GitHub Pages sub-path helper

public/               <- static files served as-is (images, favicon, .nojekyll)
public/audio/         <- background music goes here (optional; see site.ts)
scripts/serve-out.mjs <- zero-dependency preview server for ./out
docs/使用说明书.md     <- the detailed manual, in Chinese
.github/workflows/    <- the deploy workflow
```

---

## Writing an article

Create `content/articles/my-slug.md`. The filename becomes the URL: `/writing/my-slug/`.

```markdown
---
title: The Last Shift
date: '2025-11-18'
summary: >-
  One or two sentences. Shown in listings, search results and social previews.
tags:
  - Reportage
  - Night Work
# cover: /images/last-shift.jpg     # optional, relative to /public
# draft: true                       # optional, hidden in production builds
---

Opening paragraph. The first letter of a long article is automatically set as a
drop cap.

## A section heading

Headings become anchors and, if you have two or more `##` headings, an
automatically generated table of contents appears in the left margin on wide
screens.

- Lists work
- **Bold**, *italic*, `code`, [links](https://example.com) and > quotes all work
- Tables, task lists and footnotes work too (GitHub-flavoured Markdown)

| Column | Column |
| --- | ---: |
| Left | Right |
```

### Frontmatter reference

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Build fails without it. |
| `date` | yes | `YYYY-MM-DD`. Used for sorting (newest first) and display. |
| `summary` | no | Falls back to the first ~180 characters of the body. |
| `tags` | no | Plain labels. `Night Work` and `night-work` are the same tag. |
| `cover` | no | Path inside `/public`, e.g. `/images/foo.jpg`. |
| `draft` | no | `true` hides the article from production builds; still visible in `npm run dev`. |

### Tags

Tags are derived from the content itself — there is no separate list to maintain, and the same vocabulary covers both halves of the site. An article tagged `Night Work` and a film tagged `Night Work` both appear on `/tags/night-work/`, which is how a reader gets from the writing to the films about the same subject.

The tag slug is the label lower-cased with spaces turned into hyphens, so `Field Notes` becomes `/tags/field-notes/`. Rename a tag everywhere and the tag page follows.

---

## Adding a documentary

Create `content/documentaries/my-film.md`.

```markdown
---
title: The Water Reader
subject: Idris                 # the person the film is about — required
date: '2025-07-12'
location: An upland catchment
runtime: 22 min
summary: >-
  One or two sentences, shown on the card and the film page.
tags:
  - Portrait
  - Water
featured: true                 # optional: pins the film to the top of the grid
videoUrl: https://vimeo.com/123456789
# poster: /images/water-reader.jpg
credits:
  Director & Camera: Your Name
  Sound: A Collaborator
  Editor: Someone Else
---

## Director's note

The body of the file is rendered as long-form Markdown underneath the player.
Use it for a director's note, production history, or a transcript summary.
```

### `videoUrl` — supported formats

The site works out how to embed the video from the URL. Anything it does not recognise falls back to a clearly-labelled placeholder frame rather than a broken player, so it is safe to add films before they are finished.

| You paste | You get |
| --- | --- |
| `https://www.youtube.com/watch?v=ABC123` | YouTube embed (privacy-enhanced `youtube-nocookie` domain) |
| `https://youtu.be/ABC123` | same |
| `https://vimeo.com/123456789` | Vimeo player |
| `https://www.bilibili.com/video/BV1xx411c7mD` | Bilibili player, danmaku off |
| `https://example.com/film.mp4` | native `<video>` player, streaming the file |
| anything else, or omitted | styled placeholder with instructions |

For self-hosted files, drop the file in `public/videos/` and use `videoUrl: /videos/film.mp4`. Be aware that **GitHub Pages has a soft 1 GB repository limit and no CDN** — for anything longer than a couple of minutes, a YouTube/Vimeo/Bilibili link is a better choice.

### `poster`

If you omit `poster`, the card and the player frame get a procedurally generated two-tone wash derived from the film's slug, so the grid still reads as a contact sheet. Add a real still at `public/images/...` when you have one; 16:9 crops look best.

---

## Adding a field note, and keeping the Now block current

Two small content types exist so that not every thought has to become a finished essay.

**Field notes** live in `content/notes/`, one file per observation, 50–150 words:

```markdown
---
date: '2026-09-23'
---

A cleaner told me that the fastest part of cleaning a room is not the
cleaning. It's knowing what you don't need to look at.
```

The home page shows the newest two, with a day-level date; `/now` shows all of them. To hide one, prefix the filename with an underscore. Delete the folder and the section disappears from both pages.

**The Now block** is `content/pages/now.md` — a few bullets about what you are actually doing this month. It appears twice: as the short block on the home page, and as the top half of `/now` (which then continues into the full list of field notes). Edit the file once and both follow.

```markdown
---
title: Now
month: September 2026
updated: 23 September 2026
---

- Learning Spanish.
- Making a film about my grandmother's farming life.
```

Delete the file and the block is skipped on the home page and omitted from `/now`; the page itself survives, showing only the field notes. Update the `updated` line whenever you edit it — that date is the whole point of the block.

---

## Editing your résumé (timeline & honors)

Two arrays in **`src/data/resume.ts`**.

### `timeline` — what you have done

```ts
{
  id: 'staff-writer',                 // any unique string
  kind: 'work',                       // 'work' | 'education' | 'project'
  start: '2019-03',                   // 'YYYY-MM' or 'YYYY'
  end: '2022-03',                     // omit entirely to mean "Present"
  title: 'Staff Writer',
  org: 'A Publication',
  location: 'Somewhere',
  summary: 'One or two sentences.',
  highlights: ['Concrete outcome', 'Another one'],   // optional bullets
  tags: ['essay', 'reportage'],                       // optional; links to /tags
}
```

Entries are listed in the order you write them — put the newest first.

### `honors` — what you were given

```ts
{
  id: 'grant-2024',
  year: '2024',
  title: 'Documentary Production Grant',
  issuer: 'An Arts Foundation',
  note: 'Optional detail.',
  href: 'https://...',   // optional proof link
}
```

Honors are sorted by year automatically, newest first.

The prose at the top of the About page lives separately, in **`content/pages/about.md`**. Its frontmatter controls the headline, location, email, an optional portrait (`portrait: /images/me.jpg`), and the little status pills.

---

## Site-wide settings

**`src/data/site.ts`** — the first file to edit. It controls:

- `roles` — how you introduce yourself. A list, not a sentence: add a line when your work takes a new shape and the masthead, page titles and social previews follow automatically.
- `name`, `description`, `intro`
- `email`, `location`
- `links` — the footer/nav social links
- `nav` — the top navigation
- `url` — the deployed base URL, used for canonical links
- `filmChannelUrl` — optional; if set, a "subscribe to the channel" link appears on the films page

### Optional extras

Each of these hides itself completely until you configure it in `src/data/site.ts`:

- **Guestbook** (`giscus.*`) — comments stored in your repo's GitHub Discussions via [giscus](https://giscus.app). Fill in `repo`, `repoId`, `category`, `categoryId`; until then `/guestbook` shows setup instructions instead.
- **Background sound** (`audio.*`) — drop an `.mp3` into `public/audio/` and set `audio.url`. A small "Sound" toggle appears bottom-right on every page. Off by default, never autoplays, choice remembered.
- **Footer clock** (`timeZone`) — a live "It is 09:13 where H. Zhu is." line in the footer. Empty string hides it.
- **Easter egg** (`dedication`) — a hidden line shown to readers who enter the Konami code (↑↑↓↓←→←→BA). Empty string disables it.
- **Colophon** (`content/pages/colophon.md`) — a quiet "making of" page linked from the footer, covering type, stack and one secret.

Always-on, zero-config: a reading-progress hairline on articles and films, a "Copy link" button on articles, a back-to-top control, and the blank-page glyph.

The **glyph** (the small ❋ at the end of the footer) is the other quiet joke. Untouched, it fades out and returns at random. Clicked, it does the same thing to the page itself: everything fades and you are left with an empty sheet; click anywhere — or press Escape — and the page comes back exactly as it was, keeping its scroll position and focus. Nothing is stored. It lives in `src/components/ColophonGlyph.tsx` (the trigger) and `src/components/PageVeil.tsx` (the blank sheet); removing the single `<ColophonGlyph />` line from `SiteFooter.tsx` turns it off.

Styling is one file: **`src/app/globals.css`**. Colours, fonts, spacing and the reading measure are all CSS custom properties at the top under `:root` — change `--accent` and the whole site follows. There is no Tailwind and no CSS-in-JS.

---

## Deploying to GitHub Pages

The workflow at `.github/workflows/deploy.yml` builds the site and publishes it on every push to `main`. You do not need to build locally.

### 1. Create the repository and push

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Turn on Pages

In the repository: **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.

That is the only setting. Do not pick "Deploy from a branch" — the workflow does the work.

### 3. Watch the first deploy

Open the **Actions** tab. The first run takes a minute or two. When it finishes, the site is at:

| Repository name | URL |
| --- | --- |
| `personal-site` | `https://<username>.github.io/personal-site/` |
| `<username>.github.io` | `https://<username>.github.io/` |

The workflow detects which of the two you have and sets the build's base path automatically — this is the step most static-site setups get wrong, and it is why styles sometimes 404 on project sites.

### 4. Update `site.url`

Set `url` in `src/data/site.ts` to the URL from step 3 and push again. This only affects canonical link tags and social previews, but it is worth doing.

### Making a change later

```bash
git add .
git commit -m "New article"
git push
```

That is the whole loop. To write without pushing, run `npm run dev` and check `http://localhost:3000` first.

---

## Custom domain

1. Add a file `public/CNAME` containing exactly your domain, e.g. `www.example.com`.
2. In **Settings → Pages → Custom domain**, enter the same domain.
3. At your DNS provider, point the domain at GitHub Pages (`A` records to GitHub's IPs for an apex domain, or a `CNAME` record for a subdomain).
4. Set `url` in `src/data/site.ts` to `https://www.example.com` and remove any `BASE_PATH` thinking — a custom domain is always served from the root, so no base path is needed.

---

## Troubleshooting

**Styles and images are missing after deploying, but it looks fine locally.**
The base path is wrong. This happens when the site is served from `/<repo>/` but was built for `/`. Check the "Work out the base path" step in the Actions log — it should print `/your-repo` for a project site, and nothing for a `<username>.github.io` repository.

**A page 404s on GitHub Pages but works locally.**
GitHub Pages is case-sensitive and the local Windows filesystem is often not. Check that link casing matches the filename exactly.

**The build fails with `is missing a required "title"`.**
A Markdown file in `content/` is missing frontmatter. The error names the file.

**A new article does not appear.**
Check the filename ends in `.md`, that it is in `content/articles/` (not `content/pages/`), that `date` is present and valid, and that `draft` is not `true`. Note that files whose name starts with `_` are ignored on purpose.

**Everything is unstyled after opening `out/index.html` directly.**
Expected. Asset paths are absolute; over `file://` the browser cannot resolve them. Use `npm run preview`.

**`npm run build` complains about a lockfile in the home directory.**
Already handled — `next.config.mjs` scopes Turbopack to the project root.

**I want to upgrade Next.js.**
```bash
npm install next@latest react@latest react-dom@latest
npm run build
```
This project targets Next.js 16 with the App Router. `params` is awaited as a Promise in dynamic routes, which is the Next 15+ convention.

---

## Licence

The code is yours to do whatever you like with. The sample articles and film notes are placeholder text — replace them before publishing.
