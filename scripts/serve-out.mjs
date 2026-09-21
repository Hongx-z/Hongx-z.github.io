#!/usr/bin/env node
/**
 * A zero-dependency static file server for the built site in ./out.
 *
 * Why this exists: `npm run build` produces plain HTML, CSS and JS files, and
 * the only honest way to check them is to serve them over HTTP. Opening
 * out/index.html directly with a double-click does NOT work correctly — asset
 * paths are absolute (/_next/...), so the browser looks for them at the root of
 * your filesystem and everything comes out unstyled.
 *
 * Usage:
 *   node scripts/serve-out.mjs               # http://localhost:3000
 *   node scripts/serve-out.mjs --port 4000
 *   PORT=4000 node scripts/serve-out.mjs
 *
 * If you built with BASE_PATH set (see the manual), export the same value so
 * this server strips the prefix:
 *   BASE_PATH=/personal-site node scripts/serve-out.mjs
 */

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve(process.cwd(), 'out');

const portArgIndex = process.argv.indexOf('--port');
const PORT = Number(
  portArgIndex !== -1 ? process.argv[portArgIndex + 1] : process.env.PORT ?? 3000,
);

const BASE_PATH = (process.env.BASE_PATH ?? '').replace(/\/$/, '');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
};

if (!existsSync(ROOT)) {
  console.error('\n  No ./out directory found.\n');
  console.error('  Run `npm run build` first — that is what creates it.\n');
  process.exit(1);
}

/**
 * Map a request path to a file on disk, the same way GitHub Pages does:
 * directory -> index.html, extensionless -> .html, otherwise 404.
 */
function resolveRequestPath(urlPath) {
  let pathname = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);

  if (pathname.startsWith(BASE_PATH)) {
    pathname = pathname.slice(BASE_PATH.length) || '/';
  }

  // Normalise and refuse to escape the output directory.
  const safe = normalize(pathname).replace(/^([.][.](\/|\\|$))+/, '');
  let target = join(ROOT, safe);

  if (!target.startsWith(ROOT + sep) && target !== ROOT) {
    return { file: join(ROOT, '404.html'), status: 404 };
  }

  if (existsSync(target) && statSync(target).isDirectory()) {
    target = join(target, 'index.html');
  }

  if (!existsSync(target) && existsSync(`${target}.html`)) {
    target = `${target}.html`;
  }

  if (!existsSync(target) && existsSync(join(target, 'index.html'))) {
    target = join(target, 'index.html');
  }

  if (!existsSync(target) || statSync(target).isDirectory()) {
    return { file: join(ROOT, '404.html'), status: 404 };
  }

  return { file: target, status: 200 };
}

const server = createServer((request, response) => {
  const { file, status } = resolveRequestPath(request.url ?? '/');
  const type = MIME_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream';

  response.writeHead(status, {
    'Content-Type': type,
    // No caching, so rebuilding and refreshing always shows the new build.
    'Cache-Control': 'no-store',
  });

  if (status === 404) {
    console.log(`  404  ${request.url}`);
  } else {
    console.log(`  200  ${request.url}`);
  }

  createReadStream(file).pipe(response);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n  Port ${PORT} is already in use.`);
    console.error(`  Try: node scripts/serve-out.mjs --port ${PORT + 1}\n`);
    process.exit(1);
  }
  throw error;
});

server.listen(PORT, () => {
  console.log('');
  console.log(`  Serving ./out at http://localhost:${PORT}`);
  if (BASE_PATH) console.log(`  Stripping base path: ${BASE_PATH}`);
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});
