/** @type {import('next').NextConfig} */

/**
 * GitHub Pages deployment notes
 * ---------------------------------------------------------------------------
 * Two flavours of GitHub Pages site exist:
 *
 *  1. User/Org site  ->  repo named  <username>.github.io
 *      The site lives at https://<username>.github.io/  =>  BASE_PATH = ""
 *
 *  2. Project site   ->  any other repo name, e.g. "personal-site"
 *      The site lives at https://<username>.github.io/personal-site/
 *      =>  BASE_PATH = "/personal-site"
 *
 * The deploy workflow sets BASE_PATH automatically. For local development you
 * can leave it unset. To preview the production build under a sub-path:
 *   BASE_PATH=/personal-site npm run build
 */
const basePath = (process.env.BASE_PATH || '').replace(/\/$/, '');

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    // GitHub Pages serves static files only — no Image Optimization server.
    unoptimized: true,
  },
  // Keep Turbopack scoped to this project rather than walking up to a
  // lockfile somewhere in the home directory.
  turbopack: {
    root: import.meta.dirname,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
