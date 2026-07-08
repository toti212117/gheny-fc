import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public', 'images');

const url = 'https://chipperspubmeadville.com/wp-content/uploads/Chippers-NO-BACKGROUND.png';
const res = await fetch(url);
const buf = Buffer.from(await res.arrayBuffer());
writeFileSync(join(PUBLIC, 'sponsor-chippers.png'), buf);
console.log(`Saved sponsor-chippers.png (${(buf.length/1024).toFixed(0)}KB)`);
