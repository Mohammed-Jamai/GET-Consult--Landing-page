import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = path.join(root, 'index.html');
let html = fs.readFileSync(p, 'utf8');

html = html.replace(/\s*<div class="section-footer">[\s\S]*?<\/div>\n/g, '\n');
html = html.replace(/    <section class="section section-future"[\s\S]*?    <\/section>\n\n/, '');
html = html.replace(/      <li><a href="#future"[^<]*<\/a><\/li>\n/, '');
html = html.replace(/data-section-index="11"/g, 'data-section-index="10"');

fs.writeFileSync(p, html);
console.log('Cleaned index.html');
