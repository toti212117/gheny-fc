// Syncs src/data/players.json from the "Gheny FC Roster" Google Sheet.
// The sheet must be shared as "Anyone with the link" for the CSV export to work.
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLAYERS_PATH = join(__dirname, '..', 'src', 'data', 'players.json');

const SHEET_ID = '1rbABawyLBlAeuSa02WQDTZUfsuP63iqUqbZeDCuhMnQ';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

// Minimal CSV parser handling quoted fields and embedded commas/newlines
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      rows.push(row); row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// Turn Google Drive share links into direct image URLs; pass other URLs through
function normalizePhoto(value) {
  const v = value.trim();
  if (!v) return null;
  const driveMatch = v.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/);
  if (driveMatch) return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w600`;
  if (/^https?:\/\//.test(v)) return v;
  return null;
}

const res = await fetch(CSV_URL, { redirect: 'follow' });
if (!res.ok) {
  console.error(`Failed to fetch sheet (HTTP ${res.status}). Is it shared as "Anyone with the link"?`);
  process.exit(1);
}
const body = await res.text();
if (body.trimStart().startsWith('<')) {
  console.error('Got an HTML sign-in page instead of CSV. Share the sheet as "Anyone with the link" first.');
  process.exit(1);
}

const rows = parseCsv(body).filter(r => r.some(c => c.trim() !== ''));
const header = rows[0].map(h => h.trim().toLowerCase());
const col = (name) => header.findIndex(h => h.startsWith(name));
const iName = col('name'), iNumber = col('number'), iPosition = col('position'),
      iWhere = col('where'), iPicture = col('picture');
if (iName < 0) { console.error(`No "Name" column found. Header: ${header.join(', ')}`); process.exit(1); }

const existing = JSON.parse(readFileSync(PLAYERS_PATH, 'utf8'));
const byName = new Map(existing.map(p => [p.name.toLowerCase(), p]));
let nextId = Math.max(0, ...existing.map(p => p.id)) + 1;

const players = [];
for (const r of rows.slice(1)) {
  const name = (r[iName] ?? '').trim();
  if (!name) continue;
  const prev = byName.get(name.toLowerCase());
  const number = parseInt((r[iNumber] ?? '').trim(), 10);
  const position = (r[iPosition] ?? '').trim();
  const where = (r[iWhere] ?? '').trim();
  players.push({
    id: prev?.id ?? nextId++,
    name,
    number: Number.isFinite(number) ? number : prev?.number ?? null,
    highestLevel: where || prev?.highestLevel || '',
    snapchat: prev?.snapchat ?? null,
    photo: normalizePhoto(r[iPicture] ?? '') ?? prev?.photo ?? null,
    position: position || prev?.position || 'Midfielder',
  });
}

if (players.length === 0) { console.error('Sheet parsed but no player rows found — not overwriting.'); process.exit(1); }

writeFileSync(PLAYERS_PATH, JSON.stringify(players, null, 2) + '\n');
console.log(`Updated players.json with ${players.length} players from the roster sheet.`);
