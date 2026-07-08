import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public', 'images');

const assets = [
  { id: '1KKRbSjSdF_lOtujCTKnptNcxyZosQ0we', file: 'logo.png' },
  { id: '1BpD2VrToAy0zuo1t2LU8n2-TbIp5o2In', file: 'logo-white.png' },
  { id: '1mUKxKglPTZrS7JP4fz0PerKBJVI4UO5z', file: 'jersey-home.png' },
  { id: '10VvbI2yRwNx4VOiOpcDmjUyrM0pLchde', file: 'jersey-away.jpg' },
  // Match photos
  { id: '1KrurxbYLab2QOUXUK6tdM6b7Ea93WbrM', file: 'slide-1.jpg' },
  { id: '18Onr6OMRBjuHhVMJrxMIgN92mzHG3r1w', file: 'slide-2.jpg' },
  { id: '1pYfiHw4ou0QDVWHYiLOil6Tgh0Ez7E5I', file: 'slide-3.jpg' },
  { id: '1vXYFBzfok3YdAVTsC7qXxhMYMIQGCxyW', file: 'slide-4.jpg' },
  { id: '1z9aFdTvfOmgb10FLyjvQLJM_dgbYfYDL', file: 'slide-5.jpg' },
  { id: '1jSZwOuH2pVM6PGc9q4lTZnHiBL3oiHyK', file: 'slide-6.jpg' },
  { id: '1phdS_X_SJIrve7Tz0FI_Cv4brvKYnd44', file: 'slide-7.jpg' },
  { id: '1qMi8ExYXOSrCXkpb3kC2oIA-oVM7a634', file: 'slide-8.jpg' },
  { id: '1JWouVu6m-Tm_h5YAHiBv8bUKEsc_f46K', file: 'slide-9.jpg' },
  { id: '1CM4PZ6QiBMzC7qhaWgksLqL4WwNX27I7', file: 'slide-10.jpg' },
  { id: '1Wc3iXc7qup2Hes62k5ijhiv-wh3hFjf-', file: 'slide-11.jpg' },
  { id: '1OrT8PpPSU--Jo6X9crZfaDNhlVt5w2b4', file: 'slide-12.jpg' },
  { id: '1Y0sN9sr7-F1hN9uGdcQgcPCesQQ3KLW-', file: 'slide-13.jpg' },
  { id: '1UovlKeYLIlbhUDYLaI1FxMILCNOsGw8d', file: 'slide-14.jpg' },
  { id: '18fVUjLFTT5wC5jGv-PGzSFBPa4i2eO8D', file: 'slide-15.jpg' },
  { id: '1m3BOgWkBR970z246X39Z_OevBWbArMY6', file: 'slide-16.jpg' },
];

for (const { id, file } of assets) {
  const url = `https://drive.usercontent.google.com/download?id=${id}&export=view`;
  process.stdout.write(`Downloading ${file}... `);
  try {
    const res = await fetch(url);
    if (!res.ok) { console.log(`⚠️  HTTP ${res.status}`); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(join(PUBLIC, file), buf);
    console.log(`✅ ${(buf.length / 1024).toFixed(0)}KB`);
  } catch (e) {
    console.log(`❌ ${e.message}`);
  }
}
console.log('\nDone!');
