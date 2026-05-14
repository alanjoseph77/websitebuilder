/**
 * Pre-deploy script: Updates sitemap.xml lastmod to today's date.
 * Run automatically before each deploy via `npm run deploy`.
 */

const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

let content = fs.readFileSync(sitemapPath, 'utf-8');
content = content.replace(
  /<lastmod>[\d-]+<\/lastmod>/g,
  `<lastmod>${today}</lastmod>`
);

fs.writeFileSync(sitemapPath, content, 'utf-8');
console.log(`✅ Sitemap lastmod updated to ${today}`);
