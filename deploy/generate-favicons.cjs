#!/usr/bin/env node
'use strict';

const { readFileSync, copyFileSync } = require('fs');
const { join } = require('path');
const sharp = require('sharp');

const root = join(__dirname, '..');
const source = join(root, 'assets', 'favicon-mark.svg');
const svg = readFileSync(source);

async function main() {
  const outputs = [
    { file: join('assets', 'favicon-32.png'), size: 32 },
    { file: join('assets', 'favicon-48.png'), size: 48 },
    { file: join('assets', 'favicon-192.png'), size: 192 },
    { file: join('assets', 'apple-touch-icon.png'), size: 180 },
    { file: join('assets', 'og-image.png'), width: 1200, height: 630, source: join(root, 'assets', 'og-image.svg') },
  ];

  for (const item of outputs) {
    const input = item.source ? readFileSync(item.source) : svg;
    const out = join(root, item.file);
    let pipeline = sharp(input, { density: 300 });

    if (item.height) {
      pipeline = pipeline.resize(item.width, item.height, { fit: 'cover' });
    } else {
      pipeline = pipeline.resize(item.size, item.size, { fit: 'cover' });
    }

    await pipeline.png().toFile(out);
    console.log('Wrote', item.file);
  }

  copyFileSync(join(root, 'assets', 'favicon-48.png'), join(root, 'favicon.ico'));
  console.log('Wrote favicon.ico');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
