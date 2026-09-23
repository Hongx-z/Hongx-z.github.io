/**
 * Site-wide configuration.
 * ---------------------------------------------------------------------------
 * This is the first file to open. Everything you are likely to want to change
 * on day one lives here.
 */

/**
 * How you introduce yourself.
 *
 * Deliberately a list, not a sentence: add a line whenever your work takes a
 * new shape, remove one when it stops being true. It flows through the
 * masthead, the browser tab and every social preview automatically.
 *
 * @example ['Writer', 'Documentary filmmaker', 'Radio producer']
 */
export const roles: string[] = ['Writer', 'Documentary filmmaker'];

export const site = {
  /** Your name, as you want it to appear. */
  name: 'H. Zhu',

  /** Derived from `roles` above — edit that array, not this line. */
  tagline: roles.join(' · '),

  /**
   * The same list, for anywhere that wants to render it as separate items.
   */
  roles,

  /** Used for <meta name="description"> and social previews. */
  description:
    'I write about people and places. I make films about them. Stories about work, ordinary lives, and places in transition — every word and every video is a file in the repository.',

  /**
   * The one concrete sentence under your name. The redesign brief is firm on
   * this: explain first, intrigue second, become poetic third.
   */
  intro: 'I write about people and places. I make films about them.',

  /**
   * The quiet line that follows the concrete introduction — the part that is
   * allowed to be a little poetic. Kept separate so the first thing a visitor
   * reads is never the poetry.
   */
  introNote: 'Neither half is meant to be the whole of what I am.',

  /** The one-line promise under the name, above the intro. */
  positioning: 'Stories about people, work, and places.',

  /**
   * Base URL of the deployed site. Used for canonical links and absolute
   * social-preview URLs. Update after your first deploy (see the manual).
   */
  url: 'https://hongx-z.github.io',

  /** Shown in the footer and on the about page. */
  email: 'helena_z99@163.com',
  location: 'Nanjing',

  /** Social links. Delete any you do not use. */
  links: [
    { label: 'GitHub', href: 'https://github.com/Hongx-z' },
    { label: 'Email', href: 'mailto:helena_z99@163.com' },
  ],

  /**
   * Primary navigation. Deliberately short — four items, per the redesign
   * brief. Guestbook lives in the footer; Tags are reachable from the
   * writing page.
   */
  nav: [
    { label: 'Writing', href: '/writing' },
    { label: 'Films', href: '/documentaries' },
    { label: 'About', href: '/about' },
    { label: 'Now', href: '/#now' },
  ],

  /**
   * Set to your video channel URL (YouTube, Vimeo, Bilibili) if you want the
   * films page to link out to it as well. Leave empty to hide the link.
   */
  filmChannelUrl: '',

  /**
   * Background music — completely optional.
   *
   * Drop an .mp3 into public/audio/ and set `url` to its path (e.g.
   * '/audio/ambient.mp3'). A small "Sound" toggle then appears in the
   * bottom-right corner of every page. It never autoplays on its own: the
   * reader has to switch it on, and their choice is remembered.
   *
   * Leave `url` empty and the toggle does not render at all.
   */
  audio: {
    /** Path inside /public, e.g. '/audio/ambient.mp3'. Empty = feature off. */
    url: '',
    /** Accessibility label / tooltip. */
    title: 'Background sound',
    /** 0–1. Background music should sit well under the reading voice. */
    volume: 0.4,
  },

  /**
   * Guestbook. Runs on GitHub Discussions via giscus — no server, no
   * database, and every comment is one you can moderate from your repo.
   *
   * To switch it on, fill in all four fields. The manual (chapter on the
   * guestbook) walks through where each value comes from; the short version
   * is: enable Discussions on the repo, install the giscus app, then read
   * the values off https://giscus.app after entering your repo name.
   *
   * While any field is empty, the guestbook page shows setup instructions
   * instead of the comment box.
   */
  giscus: {
    /** e.g. 'h-zhu/personal-site' */
    repo: "Hongx-z/Hongx-z.github.io",
    repoId: "R_kgDOxxxxxx",
    category: "General",
    categoryId: "DIC_kwDOxxxxxx",
  },

  /**
   * A hidden line, shown to readers who enter the Konami code on any page
   * (↑ ↑ ↓ ↓ ← → ← → B A). Use it for whatever should only reach the people
   * who go looking. Leave empty to disable the easter egg.
   */
  dedication: 'For the people who let me point a camera at them.',

  /**
   * Your IANA time zone, for the live clock in the footer — so readers know
   * what time it is where you are. Find yours at
   * https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   * Leave empty to hide the clock.
   */
  timeZone: 'Asia/Shanghai',
} as const;
