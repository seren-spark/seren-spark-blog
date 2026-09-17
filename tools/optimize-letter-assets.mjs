import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const sourceRoot = join(process.cwd(), 'assets', 'letters_4k');
const outputRoot = join(process.cwd(), 'public', 'media', 'letters');
const styles = ['图3', '图层0', '图5', '图6', '图2'];
const letters = [...new Set((process.argv[2] || 'SERENSPARK').toUpperCase().replace(/[^A-Z]/g, ''))];

await Promise.all(styles.flatMap((style) => letters.map(async (letter) => {
  const source = join(sourceRoot, style, `${letter}.png`);
  const outputDirectory = join(outputRoot, style);
  const output = join(outputDirectory, `${letter}.webp`);
  await mkdir(outputDirectory, { recursive: true });
  await sharp(source)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize({ width: 720, height: 720, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, alphaQuality: 92, effort: 6 })
    .toFile(output);
}))); 

console.log(`Optimized ${styles.length * letters.length} letter assets for: ${letters.join(' ')}`);
