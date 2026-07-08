import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer');

const FOLDER_URL = 'https://drive.google.com/drive/folders/19FFqxzkK9VZuQqOUHAKNgSUfyGx2v-Lq';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(FOLDER_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));

  const files = await page.evaluate(() => {
    const results = [];
    const seen = new Set();

    // Google Drive file items have aria-label with filename on the list items
    document.querySelectorAll('[data-id]').forEach(el => {
      const id = el.getAttribute('data-id');
      if (!id || id.length < 15 || seen.has(id)) return;
      seen.add(id);

      // Try various name sources
      const label = el.getAttribute('aria-label') ||
                    el.querySelector('[aria-label]')?.getAttribute('aria-label') ||
                    el.querySelector('.KL4NAf')?.textContent ||
                    el.querySelector('div > div > div')?.textContent ||
                    '';

      const name = label.replace(/\s+/g, ' ').trim().split(',')[0].trim();
      if (name && name.length < 100) {
        results.push({ id, name });
      }
    });

    return results;
  });

  console.log(JSON.stringify(files, null, 2));
  await browser.close();
})();
