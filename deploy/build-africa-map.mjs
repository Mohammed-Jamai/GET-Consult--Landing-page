import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const active = new Set(['MA', 'CI', 'SN', 'BJ', 'TG', 'GH', 'ML']);

const raw = fs.readFileSync(path.join(root, 'assets/africa-map-temp.svg'), 'utf8');
const pathRe = /<path[^>]*id="([A-Z]{2})"[^>]*data-name="([^"]+)"[^>]*d="([^"]+)"[^>]*\/>/g;
const paths = [];
let match;
while ((match = pathRe.exec(raw)) !== null) {
  paths.push({ id: match[1], name: match[2], d: match[3] });
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Map paths © Simplemaps.com — MIT License — https://simplemaps.com -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1001" role="img" aria-hidden="true">
${paths
  .map(({ id, name, d }) => {
    const cls = active.has(id) ? 'map-country map-country--active' : 'map-country';
    return `  <path class="${cls}" data-id="${id}" data-name="${name}" d="${d}"/>`;
  })
  .join('\n')}
</svg>
`;

const outDir = path.join(root, 'assets/maps');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'africa-reach.svg'), svg);
console.log(`Wrote africa-reach.svg — ${paths.length} countries, ${active.size} active`);
