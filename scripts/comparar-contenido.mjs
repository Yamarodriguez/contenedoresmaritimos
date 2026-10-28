// C2: el texto visible de cada página en referencia/ (HTML vivo de WordPress)
// contra dist/. Cada párrafo, titular y botón del original tiene que estar en
// la nueva, en el mismo orden. Lo que WordPress cambia al publicar (comillas
// «», … ) se normaliza. Los enlaces se comparan por destino y orden.
import fs from 'node:fs';
import path from 'node:path';
import { rutaNueva, rutaVieja, enlaceComparable } from './rutas-ar.mjs';
import { textoSinFabricacion } from './erratas.mjs';

const viva = JSON.parse(fs.readFileSync('estructura-viva.json', 'utf8'));
const paginas = Array.isArray(viva) ? viva : Object.values(viva);

const norm = (s) =>
  s.replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&quot;/g, '"')
    .replace(/[«»“”„"]/g, '"').replace(/[‘’´`]/g, "'").replace(/…/g, '...').replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ').trim().toLowerCase();

// Zona de contenido: en la web vieja, el <article>; en la nueva, desde el héroe al pie.
function zona(html) {
  const a = html.match(/<article class="single-page-article[\s\S]*?<\/article>/i);
  if (a) return a[0];
  const m = html.match(/<section class="heroe">[\s\S]*?<footer/i);
  return m ? m[0] : html;
}
function bloquesDe(html) {
  const cuerpo = zona(html).replace(/<form[\s\S]*?<\/form>/gi, '').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/g, '');
  return [...cuerpo.matchAll(/<(p|h[1-6]|li|a)\b[^>]*>([\s\S]*?)<\/\1>/g)]
    .map((x) => norm(x[2])).filter((t) => t.length > 1);
}
const enlacesDe = (html) => {
  return [...zona(html).matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((x) => {
    const h = x[1]
      .replace(/^https?:\/\/(?:www\.)?contenedoresmaritimos\.net(?=[a-z0-9])/, 'https://contenedoresmaritimos.net/') // errata aprobada: falta la barra
      .replace(/^https?:\/\/(?:www\.)?contenedoresmaritimos\.net(?=\/)/, '');
    // errata aprobada: el botón «Precios» del original llevaba a /tipos/ (ahora lleva a /precios/)
    const t = norm(x[2]);
    if (h === '/comprar/' && t === 'presupuesto') return '/contacto/'; // errata aprobada: botón «Presupuesto» unificado a /contacto/
    // aprobado: las páginas de Argentina se movieron a /ar/
    // y las versiones de Argentina (/ar/precios/) cuentan como la página general
    return enlaceComparable(h === '/tipos/' && t === 'precios' ? '/precios/' : h);
  }).filter((h) => !h.startsWith('#'));
};

// El formulario se compara aparte: mismos campos (textos de las etiquetas) y mismo orden.
const camposDe = (html) => {
  const f = zona(html).match(/<form[\s\S]*?<\/form>/i);
  if (!f) return [];
  return [norm(f[0].replace(/<input[^>]*>/gi, ' ').replace(/<button[\s\S]*?<\/button>/gi, ' '))];
};

// Imágenes: mismas fotos (por nombre de fichero) y mismo texto alternativo, en orden.
const imagenesDe = (html) => [...zona(html).matchAll(/<img\b[^>]*>/gi)].map((m) => {
  const src = (m[0].match(/\src="([^"]+)"/i) || [])[1] || '';
  const alt = (m[0].match(/\alt="([^"]*)"/i) || [])[1] || '';
  return decodeURI(src.split('?')[0].split('/').pop()) + ' | ' + alt;
});

// Mapas: misma búsqueda y mismo título.
const mapasDe = (html) => [...zona(html).matchAll(/<iframe\b[^>]*>/gi)].map((m) => {
  const q = (m[0].match(/maps\?q=([^&"]+)/i) || [])[1] || '';
  const t = (m[0].match(/title="([^"]*)"/i) || [])[1] || '';
  return decodeURIComponent(q.replace(/\+/g, ' ')) + ' | ' + t;
});

// Menú principal: mismas entradas, mismo texto y mismo orden.
const menuDe = (html) => {
  const n = html.match(/<nav[^>]*id="(?:site-navigation|menu-principal)"[\s\S]*?<\/nav>/)?.[0] || '';
  // El botón «Pide presupuesto» de dentro del menú móvil se añadió a propósito.
  const sinCta = n.replace(/<li class="solo-movil">[\s\S]*?<\/li>/g, '');
  return [...sinCta.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((m) => enlaceComparable(rel(m[1])) + ' | ' + norm(m[2]));
};
const rel = (u) => u.replace(/^https?:\/\/(?:www\.)?contenedoresmaritimos\.net(?=\/)/i, '');

const dif = [];
let comparadas = 0;
for (const p of paginas) {
  const ruta = new URL(p.url).pathname.replace(/^\/|\/$/g, '');
  const ref = path.join('referencia', (ruta === '' ? 'index' : ruta.replace(/\//g, '__')) + '.html');
  const nueva = path.join('dist', rutaNueva(ruta), 'index.html'); // Argentina: en /ar/
  if (!fs.existsSync(ref) || !fs.existsSync(nueva)) { dif.push(`${p.url}: falta ${!fs.existsSync(ref) ? 'referencia' : 'dist'}`); continue; }
  comparadas++;
  // errata aprobada: en las páginas de Argentina, los precios del original en euros pasan a dólares
  // y «en alguna provincia de España» pasa a «de Argentina»
  const refTexto = (rutaNueva(ruta) === 'ar' || rutaNueva(ruta).startsWith('ar/'))
    ? fs.readFileSync(ref, 'utf8').replace(/\beuros\b/g, 'dólares').replace(/provincia de España/g, 'provincia de Argentina')
    : fs.readFileSync(ref, 'utf8');
  const a = bloquesDe(textoSinFabricacion(refTexto)); // cambio aprobado: sin «fabricación» ni «fabricantes»
  const nuevoHtml = fs.readFileSync(nueva, 'utf8');
  const b = bloquesDe(nuevoHtml).join(' | ');
  let pos = 0;
  for (const t of a) {
    const i = b.indexOf(t, pos);
    if (i < 0) { dif.push(`${p.url}: falta texto «${t.slice(0, 80)}»`); } else pos = i + t.length;
  }
  const ca = camposDe(fs.readFileSync(ref, 'utf8')), cb = camposDe(nuevoHtml);
  if (JSON.stringify(ca) !== JSON.stringify(cb)) dif.push(`${p.url}: formulario distinto (${ca.join(' / ')}) vs (${cb.join(' / ')})`);
  const ia = imagenesDe(fs.readFileSync(ref, 'utf8')), ib = imagenesDe(nuevoHtml);
  let q = 0;
  for (const im of ia) { const i = ib.indexOf(im, q); if (i < 0) dif.push(`${p.url}: falta imagen ${im}`); else q = i + 1; }
  const na = menuDe(fs.readFileSync(ref, 'utf8')), nb = menuDe(nuevoHtml);
  // Todas las entradas del menú original, en el mismo orden (se pueden añadir entradas nuevas, p. ej. las provincias de Argentina).
  { let k = 0; const falta = na.find((e) => { const x = nb.indexOf(e, k); if (x < 0) return true; k = x + 1; return false; }); if (falta) dif.push(`${p.url}: menú distinto: falta «${falta}»`); }
  const ma = mapasDe(fs.readFileSync(ref, 'utf8')), mb = mapasDe(nuevoHtml);
  if (JSON.stringify(ma) !== JSON.stringify(mb)) dif.push(`${p.url}: mapa distinto (${ma}) vs (${mb})`);
  const ea = enlacesDe(fs.readFileSync(ref, 'utf8')), eb = enlacesDe(nuevoHtml);
  let k = 0;
  for (const h of ea) { const i = eb.indexOf(h, k); if (i < 0) dif.push(`${p.url}: falta enlace ${h}`); else k = i + 1; }
}
fs.mkdirSync('informes', { recursive: true });
fs.writeFileSync('informes/contenido.json', JSON.stringify({ comparadas, diferencias: dif }, null, 1));
console.log(`Contenido: ${comparadas} páginas comparadas, ${dif.length} diferencias`);
dif.slice(0, 15).forEach((x) => console.log('  ' + x));
process.exit(dif.length ? 1 : 0);
