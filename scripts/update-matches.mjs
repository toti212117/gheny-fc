/**
 * Gheny FC — Daily match updater
 * 1. Fetches the team schedule from TeamPass
 * 2. Detects any new scores/results
 * 3. For every completed match, launches Puppeteer to scrape goal scorers & assists
 * 4. Updates src/data/matches.json, upcoming.json, fixtures.json
 *
 * Run: node scripts/update-matches.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const require = createRequire(import.meta.url);
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const TEAM_URL = 'https://app.teampass.com/PAWest/GPSLO19/Team/137146';
const TEAM_ID  = '137146'; // Gheny FC's TeamPass ID

// Map TeamPass event IDs → our internal match IDs + known fixture info
const EVENTS = {
  '300257_23D910CDAA7217F27C6FDAB9C61B5828': { id: 'match-001', date: '2026-05-17', kickoffTime: '9:00 PM',  opponent: 'Dukes of Hazard',   homeAway: 'Home', venue: 'Russellton Soccer Field #2' },
  '300263_CA643C122A95F7868F7DFC3EE985EF8F': { id: 'match-002', date: '2026-05-31', kickoffTime: '7:00 PM',  opponent: 'Giggle Gang FC',    homeAway: 'Home', venue: 'Russellton Soccer Field #2' },
  '300269_CFA2B1FAF2953D9161D2E07C821EBBA4': { id: 'match-003', date: '2026-06-07', kickoffTime: '8:00 PM',  opponent: 'Football Team FC',  homeAway: 'Home', venue: 'Russellton Soccer Field #2' },
  '300275_968D82DD12BE8C7B9308C7D6E20F3228': { id: 'match-004', date: '2026-06-14', kickoffTime: '8:00 PM',  opponent: 'Helltown FC',       homeAway: 'Home', venue: 'Russellton Soccer Field #2' },
  '300255_1ECE4CE8FFAAFED7D180A92969C82CEE': { id: 'match-005', date: '2026-06-21', kickoffTime: '2:00 PM',  opponent: 'The Sailles SC',    homeAway: 'Away', venue: 'The Sailles SC Home Field' },
  '300281_6AC36128B56E79E975ED375A8C7F2711': { id: 'match-006', date: '2026-06-28', kickoffTime: '12:00 PM', opponent: 'MLSA Juniors',      homeAway: 'Away', venue: 'Mt Lebanon High School — Upper Practice Field (Rockpile)' },
  '300249_C812D6A8BFE665BBF81C3081BBCFE138': { id: 'match-007', date: '2026-07-07', kickoffTime: '6:00 PM',  opponent: 'Three Rivers FC',   homeAway: 'Away', venue: 'Hamilton Park' },
  '300286_8F3A570F399AAA88E9FF323809601328': { id: 'match-008', date: '2026-07-12', kickoffTime: '6:00 PM',  opponent: 'Sonder FC',         homeAway: 'Away', venue: 'North Strabane Park Soccer Field' },
  '300290_BF0186541993C0807D22E3E867564F96': { id: 'match-009', date: '2026-07-19', kickoffTime: '2:00 PM',  opponent: 'Plum Mustangs 2',   homeAway: 'Away', venue: 'Plum High School Turf Field' },
  '300295_02186A1F9F8BDB511C5DA858F26D8197': { id: 'match-010', date: '2026-07-26', kickoffTime: '6:00 PM',  opponent: 'Sonder FC',         homeAway: 'Home', venue: 'Russellton Soccer Field #2' },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseResultText(text, homeAway) {
  // TeamPass: "Win (homeScore - awayScore)"
  const m = text.match(/(Win|Loss|Draw|Tie)\s*\((\d+)\s*[-–]\s*(\d+)\)/i);
  if (!m) return null;
  const [, outcome, home, away] = m;
  const goalsFor     = homeAway === 'Away' ? parseInt(away) : parseInt(home);
  const goalsAgainst = homeAway === 'Away' ? parseInt(home) : parseInt(away);
  const result = /^w/i.test(outcome) ? 'W' : /^l/i.test(outcome) ? 'L' : 'D';
  return { goalsFor, goalsAgainst, result };
}

function normalizeName(raw) {
  // TeamPass stores "Last, First" — convert to "First Last"
  const parts = raw.trim().split(',');
  if (parts.length === 2) return `${parts[1].trim()} ${parts[0].trim()}`;
  return raw.trim();
}

// ─── Puppeteer: scrape a single match page ──────────────────────────────────

async function scrapeMatchEvents(browser, eventId) {
  const url = `https://app.teampass.com/PAWest/GPSLO19/Event/${eventId}`;
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000)); // let lazy JS settle

    const data = await page.evaluate((teamId) => {
      const goalScorers = [];
      const assists = [];

      // Each player is a <tr>. Gheny FC rows have a hidden input with value=teamId
      document.querySelectorAll('tr').forEach(row => {
        const hidden = row.querySelector(`input[value="${teamId}"]`);
        if (!hidden) return; // not our team's row

        // Player name: first bold div text
        const nameEl = row.querySelector('td:first-child div[style*="font-weight:bold"]');
        if (!nameEl) return;
        const name = nameEl.innerText.trim().split('\n')[0].trim();
        if (!name) return;

        // Columns: td[0]=name, td[1]=jersey, td[2]=starter, td[3]=sub, td[4]=G, td[5]=A
        const cells = row.querySelectorAll('td');
        const goalsRaw   = cells[4]?.innerText?.trim() ?? '';
        const assistsRaw = cells[5]?.innerText?.trim() ?? '';

        const goals   = parseInt(goalsRaw)   || 0;
        const assts   = parseInt(assistsRaw) || 0;

        for (let i = 0; i < goals;  i++) goalScorers.push(name);
        for (let i = 0; i < assts;  i++) assists.push(name);
      });

      return { goalScorers, assists };
    }, TEAM_ID);

    return data;
  } catch (err) {
    console.warn(`  ⚠️  Failed to scrape ${eventId}: ${err.message}`);
    return { goalScorers: [], assists: [] };
  } finally {
    await page.close();
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔄  Fetching Gheny FC schedule from TeamPass...');

  // Step 1: fetch schedule page (light — no Puppeteer needed)
  const res = await fetch(TEAM_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const $    = cheerio.load(html);

  const matchesPath  = join(ROOT, 'src/data/matches.json');
  const upcomingPath = join(ROOT, 'src/data/upcoming.json');
  const fixturesPath = join(ROOT, 'src/data/fixtures.json');

  const existing     = JSON.parse(readFileSync(matchesPath, 'utf8'));
  const existingMap  = Object.fromEntries(existing.map(m => [m.id, m]));

  // Step 2: parse every row in the schedule
  const completedEvents = []; // { eventId, fixture, parsed }
  const upcomingList    = [];

  $('a[href*="/Event/"]').each((_, el) => {
    const href    = $(el).attr('href') || '';
    const eventId = href.split('/Event/')[1]?.split('"')[0]?.trim();
    if (!eventId || !EVENTS[eventId]) return;

    const fixture  = EVENTS[eventId];
    const rowText  = $(el).closest('tr').text();
    const resultRx = /(Win|Loss|Draw|Tie)\s*\(\d+\s*[-–]\s*\d+\)/i;

    if (resultRx.test(rowText)) {
      const parsed = parseResultText(rowText.match(resultRx)[0], fixture.homeAway);
      if (parsed) completedEvents.push({ eventId, fixture, parsed });
    } else {
      upcomingList.push(fixture);
    }
  });

  // Deduplicate (anchor tags can appear multiple times per row)
  const seenEvents = new Set();
  const uniqueCompleted = completedEvents.filter(e => {
    if (seenEvents.has(e.eventId)) return false;
    seenEvents.add(e.eventId);
    return true;
  });

  // Step 3: for completed matches, check if we need to scrape scorers
  const needsScraping = uniqueCompleted.filter(e => {
    const cur = existingMap[e.fixture.id];
    const scoreChanged = !cur ||
      cur.goalsFor !== e.parsed.goalsFor ||
      cur.goalsAgainst !== e.parsed.goalsAgainst;
    const noScorers = !cur || cur.goalScorers.length === 0;
    return scoreChanged || noScorers;
  });

  let browser;
  if (needsScraping.length > 0) {
    console.log(`🌐  Opening browser to scrape ${needsScraping.length} match page(s)...`);
    browser = await puppeteer.launch({ headless: true });
  }

  let newCount = 0;
  let updatedCount = 0;

  for (const { eventId, fixture, parsed } of uniqueCompleted) {
    const cur = existingMap[fixture.id];
    const needsScrape = needsScraping.some(e => e.eventId === eventId);

    let goalScorers = cur?.goalScorers ?? [];
    let assists     = cur?.assists     ?? [];

    if (needsScrape && browser) {
      console.log(`  📋  Scraping ${fixture.opponent}...`);
      const events = await scrapeMatchEvents(browser, eventId);

      goalScorers = events.goalScorers.map(name => ({
        playerId: 0,
        name: normalizeName(name),
        minute: 0,
      }));
      assists = events.assists.map(name => ({
        playerId: 0,
        name: normalizeName(name),
        minute: 0,
      }));
    }

    const updated = {
      id:            fixture.id,
      date:          fixture.date,
      kickoffTime:   fixture.kickoffTime,
      opponent:      fixture.opponent,
      homeAway:      fixture.homeAway,
      venue:         fixture.venue,
      competition:   'GPSLO19 Regular Season',
      goalsFor:      parsed.goalsFor,
      goalsAgainst:  parsed.goalsAgainst,
      result:        parsed.result,
      goalScorers,
      assists,
      yellowCards:   cur?.yellowCards ?? [],
      redCards:      cur?.redCards    ?? [],
      notes:         cur?.notes       ?? '',
    };

    if (!cur) {
      existingMap[fixture.id] = updated;
      newCount++;
      console.log(`✅  New result: ${fixture.opponent} ${parsed.goalsFor}–${parsed.goalsAgainst} (${parsed.result})`);
    } else {
      existingMap[fixture.id] = updated;
      if (needsScrape) {
        updatedCount++;
        console.log(`✏️   Updated: ${fixture.opponent} — ${goalScorers.map(g => g.name).join(', ') || 'no scorers'}`);
      }
    }
  }

  if (browser) await browser.close();

  // Step 4: write files
  const sortedMatches = Object.values(existingMap).sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  writeFileSync(matchesPath, JSON.stringify(sortedMatches, null, 2));

  const today = new Date().toISOString().split('T')[0];
  const futureFixtures = upcomingList
    .filter(f => f.date >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  writeFileSync(fixturesPath, JSON.stringify(futureFixtures, null, 2));

  if (futureFixtures.length > 0) {
    const next = futureFixtures[0];
    writeFileSync(upcomingPath, JSON.stringify(next, null, 2));
    console.log(`📅  Next match: ${next.opponent} on ${next.date} at ${next.kickoffTime}`);
  }

  if (newCount === 0 && updatedCount === 0) {
    console.log('✓  Everything is already up to date.');
  } else {
    console.log(`\n✓  Done — ${newCount} new result(s), ${updatedCount} updated.`);
  }
}

main().catch(err => {
  console.error('❌  Update failed:', err.message);
  process.exit(1);
});
