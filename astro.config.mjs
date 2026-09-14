// @ts-check
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://morlandappraisals.org';

/**
 * `lastmod` for a sitemap entry, taken from the last commit that touched the
 * page's source file. A shallow CI clone can leave `git log` with nothing to
 * report, so fall back to the build time rather than omitting the field.
 */
const buildDate = new Date().toISOString();
const lastmodOf = (url) => {
  const route = url.replace(SITE, '').replace(/\/$/, '');
  const src = fileURLToPath(new URL(`./src/pages${route === '' ? '/index' : route}.astro`, import.meta.url));
  if (!existsSync(src)) return buildDate;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', src], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out ? new Date(out).toISOString() : buildDate;
  } catch {
    return buildDate;
  }
};

// Vercel serves these pages without a trailing slash (vercel.json strips it), so
// canonicals, internal links and the sitemap all use the bare `/about-us` form.
export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you'),
      serialize: (item) => {
        const url = item.url.replace(/(?<!\/)\/$/, '');
        return { ...item, url, lastmod: lastmodOf(url) };
      },
    }),
  ],
});
