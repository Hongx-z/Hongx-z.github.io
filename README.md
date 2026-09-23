# H. Zhu — personal site

A personal site in two halves, plus a running account of the present.

- **Writing** — the written record: a résumé told as a timeline, the honors, and the articles.
- **Films** — the filmed record: short documentaries about other people, each with its own page and player.
- **Now & field notes** — what is going on this month, and short observations that never needed to become essays.

Built as a static site (**Next.js export → GitHub Pages**): no server, no database, no tracking. Every word, film and note is a file in this repository.

> 中文详细说明书：[`docs/使用说明书.md`](docs/使用说明书.md)
>
> This README is deliberately a summary — it describes what the site is, not how to change it. Editing, styling, configuration and deployment are all documented in the Chinese manual, which is the file kept up to date. This page does not change when the details do.

---

## What is on the site

| Section | URL | Holds |
| --- | --- | --- |
| Introduction / home | `/` | Intro, latest stories, the featured film, Now, the newest field notes |
| Writing | `/writing` | Article list; each piece at `/writing/<slug>` |
| Films | `/documentaries` | Film grid; each film at `/documentaries/<slug>` |
| Tags | `/tags` | Articles and films under one tag |
| About | `/about` | Bio, timeline, honors |
| Now | `/now` | The Now block in full, plus every field note |
| Guestbook | `/guestbook` | Reader comments, kept in this repository's Discussions |
| Colophon | `/colophon` | Type, stack, and the small things worth explaining |

**Content is files.** Articles, films, field notes and page prose are Markdown under `content/`; the timeline, honors, and site-wide settings are two TypeScript arrays in `src/data/`. There is no CMS and no admin panel.

## Repository layout

```
content/            everything written: articles, documentaries, notes, pages
src/app/            the pages themselves
src/components/     reusable UI pieces
src/data/           site settings and résumé data
src/lib/            the code that reads the Markdown
public/             static files served as-is
docs/               使用说明书.md — the full manual (Chinese)
scripts/            zero-dependency preview server
```

## Quick start

Requires **Node.js 20.9 or newer** (22 recommended).

```bash
npm install
npm run dev       # http://localhost:3000, live reload
```

To check exactly what GitHub Pages will serve:

```bash
npm run build     # type-checks everything, writes the static site to ./out
npm run preview   # serves ./out
```

`npm run build` is the real test: if a Markdown file is malformed, it fails and names the file.

## Deploying

Pushing to `main` is enough. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it. Only source files are committed — `out/` and `.next/` are generated in the cloud and ignored here.

## Licence

The code is yours to do whatever you like with. The sample articles and film notes are placeholder text — replace them before publishing.
