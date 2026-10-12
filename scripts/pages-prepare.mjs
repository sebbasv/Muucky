// Adapta el código para la exportación estática de GitHub Pages. Lo corre el workflow
// .github/workflows/pages.yml sobre su propia copia del repo, antes de `next build`: no se usa en local.
//
// Pages solo sirve archivos, así que:
// - se quitan las rutas /api (los formularios no tienen servidor al que mandar los datos);
// - el build va sin Cache Components (la exportación no lo admite en sitemap, robots, manifest ni
//   imágenes OG), por eso se quita `instant` y esas rutas se marcan como estáticas.
import { appendFileSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

rmSync('src/app/api', { recursive: true, force: true });

const pagePath = 'src/app/productos/[slug]/page.tsx';
writeFileSync(pagePath, readFileSync(pagePath, 'utf8').replace(/^export const instant = .*$/m, ''));

for (const file of [
  'src/app/sitemap.ts',
  'src/app/robots.ts',
  'src/app/manifest.ts',
  'src/app/opengraph-image.tsx',
  'src/app/productos/[slug]/opengraph-image.tsx',
]) {
  appendFileSync(file, "\nexport const dynamic = 'force-static';\n");
}
