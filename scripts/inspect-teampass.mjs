/**
 * One-time inspector — dumps the full rendered HTML of a TeamPass match page
 * so we can identify the correct selectors for goal scorers, assists, cards.
 * Run: node scripts/inspect-teampass.mjs
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer');
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use match-001 (Dukes of Hazard — Loss 1-2) which already has a known result
const URL = 'https://app.teampass.com/PAWest/GPSLO19/Event/300257_23D910CDAA7217F27C6FDAB9C61B5828';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait a bit more for any lazy JS to finish
  await new Promise(r => setTimeout(r, 3000));

  const html = await page.content();
  const outPath = join(__dirname, 'teampass-page.html');
  writeFileSync(outPath, html);
  console.log(`Saved ${html.length} bytes to scripts/teampass-page.html`);

  // Also dump just the text so we can read it
  const text = await page.evaluate(() => document.body.innerText);
  writeFileSync(join(__dirname, 'teampass-page.txt'), text);
  console.log('Text dump saved to scripts/teampass-page.txt');

  await browser.close();
})();
