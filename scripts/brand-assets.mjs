// Genera favicon, íconos y las versiones livianas del logo y el pack a partir de public/brand.
// Uso: node scripts/brand-assets.mjs (volver a correrlo cuando llegue el logo en vector)
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const logo = 'public/brand/logo-muucky.png';
const crop = { left: 70, top: 0, width: 366, height: 284 }; // el toro con los cuernos, sin el nombre
const clear = { r: 0, g: 0, b: 0, alpha: 0 };
const head = sharp(logo).extract(crop);

const png = (size) =>
  head.clone().resize(size, size, { fit: 'contain', background: clear }).png({ compressionLevel: 9 }).toBuffer();

// favicon.ico con un PNG de 32 px adentro (formato ICO moderno)
const ico32 = await png(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(ico32.length, 14);
header.writeUInt32LE(22, 18);
await writeFile('src/app/favicon.ico', Buffer.concat([header, ico32]));

await writeFile('src/app/icon.png', await png(192));
await sharp(logo)
  .extract(crop)
  .resize(148, 148, { fit: 'contain', background: '#080808' })
  .extend({ top: 16, bottom: 16, left: 16, right: 16, background: '#080808' })
  .flatten({ background: '#080808' })
  .png()
  .toFile('src/app/apple-icon.png');
await sharp(logo)
  .resize(440, 440, { fit: 'contain', background: '#080808' })
  .extend({ top: 36, bottom: 36, left: 36, right: 36, background: '#080808' })
  .flatten({ background: '#080808' })
  .png({ palette: true })
  .toFile('public/brand/icon-512.png');

// Logo liviano para header y footer (1x y 2x de 56 px)
await sharp(logo).resize({ height: 112 }).webp({ quality: 85 }).toFile('public/brand/logo-muucky-112.webp');
await sharp(logo).resize({ height: 224 }).webp({ quality: 85 }).toFile('public/brand/logo-muucky-224.webp');
// Pack en WebP
await sharp('public/brand/product-pack.png').webp({ quality: 82 }).toFile('public/brand/product-pack.webp');
console.log('listo');
