// C1: la secuencia de H1/H2/H3 de cada página en dist/ contra estructura-viva.json.
// Avanza con un puntero (hay títulos repetidos). Regla del H1 (pendiente de que
// el propietario la apruebe): sin H1 explícito en Elementor, el H1 es el título.
import fs from 'node:fs';
import path from 'node:path';
import { rutaNueva, rutaVieja, enlaceNuevo } from './rutas-ar.mjs';
import { sinFabricacion } from './erratas.mjs';

const viva = JSON.parse(fs.readFileSync('estructura-viva.json', 'utf8'));
const paginas = Array.isArray(viva) ? viva : Object.values(viva);
const limpia = (s) =>
  s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

const diferencias = [];
let comparadas = 0;
for (const p of paginas) {
  const ruta = new URL(p.url).pathname.replace(/^\/|\/$/g, '');
  const f = path.join('dist', rutaNueva(ruta), 'index.html'); // Argentina: en /ar/
  if (!fs.existsSync(f)) { diferencias.push(`${p.url}: no existe en dist`); continue; }
  const html = fs.readFileSync(f, 'utf8');
  const nuevos = [...html.matchAll(/<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => [m[1], limpia(m[2])]);
  // Cambio aprobado: «Fabricación» fuera de los títulos (scripts/erratas.mjs).
  let originales = p.headings.filter((h) => /^h[1-3]$/.test(h.tag)).map((h) => [h.tag, sinFabricacion(limpia(h.text))]);
  if (!originales.some(([t]) => t === 'h1')) originales = [['h1', limpia(p.title)], ...originales];
  comparadas++;
  let k = 0;
  for (const [tag, texto] of originales) {
    while (k < nuevos.length && !(nuevos[k][0] === tag && nuevos[k][1] === texto)) k++;
    if (k >= nuevos.length) { diferencias.push(`${p.url}: falta ${tag} «${texto}»`); break; }
    k++;
  }
}

fs.mkdirSync('informes', { recursive: true });
fs.writeFileSync('informes/encabezados.json', JSON.stringify({ comparadas, diferencias }, null, 1));
console.log(`Encabezados: ${comparadas} páginas comparadas, ${diferencias.length} diferencias`);
diferencias.slice(0, 15).forEach((x) => console.log('  ' + x));
process.exit(diferencias.length ? 1 : 0);
