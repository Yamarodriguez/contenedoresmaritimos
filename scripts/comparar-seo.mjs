// SEO: título y descripción de cada página nueva contra la web viva (referencia/),
// etiquetas para compartir presentes, y un mapa del sitio que lista todas las URL.
import fs from 'node:fs';
import path from 'node:path';
import { rutaNueva, rutaVieja, enlaceNuevo } from './rutas-ar.mjs';
import { textoSinFabricacion } from './erratas.mjs';

const decode = (s = '') => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
const titulo = (h) => decode((h.match(/<title>([^<]*)<\/title>/i) || [])[1]);
const descripcion = (h) => decode((h.match(/<meta name="description" content="([^"]*)"/i) || [])[1]);

const viva = JSON.parse(fs.readFileSync('estructura-viva.json', 'utf8'));
const paginas = Array.isArray(viva) ? viva : Object.values(viva);
const dif = [];
let comparadas = 0;
for (const p of paginas) {
  const ruta = new URL(p.url).pathname.replace(/^\/|\/$/g, '');
  const ref = path.join('referencia', (ruta === '' ? 'index' : ruta.replace(/\//g, '__')) + '.html');
  const nueva = path.join('dist', rutaNueva(ruta), 'index.html'); // Argentina: en /ar/
  if (!fs.existsSync(ref) || !fs.existsSync(nueva)) { dif.push(`${p.url}: falta ${!fs.existsSync(ref) ? 'referencia' : 'dist'}`); continue; }
  comparadas++;
  const a = fs.readFileSync(ref, 'utf8'), b = fs.readFileSync(nueva, 'utf8');
  if (titulo(a) !== titulo(b)) dif.push(`${p.url}: título «${titulo(b)}» (original «${titulo(a)}»)`);
  // Cambio aprobado: sin «fabricantes» en las descripciones (scripts/erratas.mjs).
  if (textoSinFabricacion(descripcion(a)) !== descripcion(b)) dif.push(`${p.url}: descripción distinta`);
  for (const t of ['og:title', 'og:url', 'og:type']) if (!b.includes(`property="${t}"`)) dif.push(`${p.url}: falta ${t}`);
}
// Mapa del sitio: una entrada por página de contenido.
const mapa = fs.readFileSync('dist/sitemap.xml', 'utf8');
const enMapa = [...mapa.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const p of paginas) if (!enMapa.includes(`https://contenedoresmaritimos.net/${rutaNueva(new URL(p.url).pathname.replace(/^\/|\/$/g, ''))}/`.replace(/\/\/$/, '/'))) dif.push(`${p.url}: no está en sitemap.xml`);
fs.mkdirSync('informes', { recursive: true });
fs.writeFileSync('informes/seo.json', JSON.stringify({ comparadas, enMapa: enMapa.length, diferencias: dif }, null, 1));
console.log(`SEO: ${comparadas} páginas comparadas, ${enMapa.length} en el mapa, ${dif.length} diferencias`);
dif.slice(0, 12).forEach((x) => console.log('  ' + x));
process.exit(dif.length ? 1 : 0);
