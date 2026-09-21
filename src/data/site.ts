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
    'A personal site in two halves: a written record of the work I have done, and a filmed record of other people. Every word and every video is a file in the repository.',

  /** One or two sentences, shown on the home page. */
  intro:
    'The first half is written: what I have done, what I was given for it, and the articles that came out of it. The second half is filmed: short documentaries, one person each. Neither half is meant to be the whole of what I am.',

  /**
   * Base URL of the deployed site. Used for canonical links and absolute
   * social-preview URLs. Update after your first deploy (see the manual).
   */
  url: 'https://username.github.io/personal-site',

  /** Shown in the footer and on the about page. */
  email: 'you@example.com',
  location: 'Your City',

  /** Social links. Delete any you do not use. */
  links: [
    { label: 'GitHub', href: 'https://github.com/username' },
    { label: 'Email', href: 'mailto:you@example.com' },
  ],

  /** Primary navigation. Order matters; labels are yours to change. */
  nav: [
    { label: 'About me', href: '/about' },
    { label: 'Writing', href: '/writing' },
    { label: 'Tags', href: '/tags' },
    { label: 'About others', href: '/documentaries' },
  ],

  /**
   * Set to your video channel URL (YouTube, Vimeo, Bilibili) if you want the
   * films page to link out to it as well. Leave empty to hide the link.
   */
  filmChannelUrl: '',
} as const;
