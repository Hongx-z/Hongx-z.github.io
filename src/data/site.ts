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

/**
 * One way to reach you.
 *
 * A contact is a label plus a destination. `href` makes it a link; `value` is
 * the thing printed beside it (an address, an account name). A WeChat Official
 * Account has no public profile page, so it is a value rather than a link —
 * written in exactly the same form as the email address.
 */
export interface ContactLink {
  /** Shown on the page. */
  label: string;
  /** Profile URL or `mailto:`. Leave it out when there is nothing to link to. */
  href?: string;
  /** The address / account name printed beside the label. */
  value?: string;
}

/**
 * Where to find you. Delete any you do not use.
 *
 * Keep this list short: one way to write, one way to follow, one repository.
 * Replace `朱虹璇` below with the exact name of your Official Account.
 */
export const links: ContactLink[] = [
  { label: 'Email', href: 'mailto:helena_z99@163.com', value: 'helena_z99@163.com' },
  { label: 'WeChat Official Account', value: '朱虹璇' },
  { label: 'GitHub', href: 'https://github.com/Hongx-z', value: '@Hongx-z' },
];

export const site = {
  /** Your name, as you want it to appear. */
  name: 'H. Zhu',

  /** The same name in Chinese, set quietly under it on the home page. */
  nameZh: '朱虹璇',

  /** Derived from `roles` above — edit that array, not this line. */
  tagline: roles.join(' · '),

  /**
   * The same list, for anywhere that wants to render it as separate items.
   */
  roles,

  /** Used for <meta name="description"> and social previews. */
  description:
    'H. Zhu (朱虹璇) is a writer and documentary filmmaker in Nanjing. Writing and films about work, ordinary lives, and places in transition.',

  /**
   * The line that carries the home page. A claim, not a job title: it says what
   * the work is *about* before it says what form the work takes.
   */
  statement: 'Most of my work begins with a job I did not know existed.',

  /**
   * The one concrete sentence under your name. The redesign brief is firm on
   * this: explain first, intrigue second, become poetic third.
   */
  intro: 'I write about people and places. I make films about them.',

  /** The standfirst of the home page, in three figures. Keep it to three. */
  facts: [
    {
      value: 'Ten years',
      label: 'writing about work',
      detail:
        'Reportage, essays and interviews — mostly about people whose jobs are easy to overlook.',
    },
    {
      value: 'Four years',
      label: 'filming it',
      detail:
        'Short observational documentaries, usually shot and cut alone, usually in somebody else’s workplace.',
    },
    {
      value: 'One question',
      label: 'what people actually do all day',
      detail: 'Described without romance and without condescension.',
    },
  ],

  /**
   * The line the home page quotes back. It comes from the About page, where it
   * has a little more room around it.
   */
  quote:
    'I am not interested in the version of a person that exists for an audience. I am interested in the version that exists at 4 a.m. on a Tuesday.',

  /**
   * Base URL of the deployed site. Used for canonical links and absolute
   * social-preview URLs. Update after your first deploy (see the manual).
   */
  url: 'https://hongx-z.github.io',

  /** Shown in the footer and on the about page. */
  email: 'helena_z99@163.com',
  location: 'Nanjing',

  /** Social links — defined at the top of this file, next to `roles`. */
  links,

  /**
   * Primary navigation. Deliberately short — four items, per the redesign
   * brief. Guestbook lives in the footer; Tags are reachable from the
   * writing page.
   */
  nav: [
    { label: 'Writing', href: '/writing' },
    { label: 'Films', href: '/documentaries' },
    { label: 'About', href: '/about' },
    { label: 'Now', href: '/now' },
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
   * The private "note to myself" box at the end of the Field notes list on
   * /now. Unlocked with a GitHub token, it writes straight into the
   * repository: saving a note is a commit to content/notes/, and the site
   * rebuilds itself from it a minute later. Nothing else about it is public —
   * readers see the notes, never the controls.
   *
   * Leave `repo` empty and the box disappears completely.
   */
  editor: {
    /** 'owner/repo' — the repository that publishes this site. */
    repo: 'Hongx-z/Hongx-z.github.io',
    /** The branch commits go to; the deploy workflow watches this one. */
    branch: 'main',
    /** Must match NOTES_DIR in src/lib/notes.ts. */
    notesDir: 'content/notes',
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
