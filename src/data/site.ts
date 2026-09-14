/**
 * Site-wide configuration.
 * ---------------------------------------------------------------------------
 * Everything you are likely to want to change on day one lives here.
 */

export const site = {
  /** Shown in the browser tab and as the masthead of every page. */
  name: 'Your Name',
  /** Short line under the masthead on the home page. */
  tagline: 'Writer · Documentary Filmmaker',
  /** Used for <meta name="description"> and RSS/social previews. */
  description:
    'A personal site in two halves: a written record of a life in work — a résumé told as a timeline — and a video record of other people, told as short documentaries.',
  /** One sentence, shown on the home page hero. */
  intro:
    'I write about the work I have done and the places it took me. I also point a camera at strangers until they stop being strangers.',

  /**
   * Base URL of the deployed site. Used for canonical links and absolute
   * social-preview images. Update after your first deploy.
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

  /** Primary navigation. Order matters. */
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
