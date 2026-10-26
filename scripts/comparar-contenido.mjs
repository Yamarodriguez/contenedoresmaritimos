// C2: el texto visible de cada página en referencia/ (HTML vivo de WordPress)
// contra dist/. Cada párrafo, titular y botón del original tiene que estar en
// la nueva, en el mismo orden. Lo que WordPress cambia al publicar (comillas
// «», … ) se normaliza. Los enlaces se comparan por destino y orden.
import fs from 'node:fs';
import path from 'node:path';

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
  const a = html.match(/<article[\s\S]*?<\/article>/i);
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
  return [...zona(html).matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((x) => x[1]
    .replace(/^https?:\/\/(?:www\.)?contenedoresmaritimos\.net(?=\/)/, '')).filter((h) => !h.startsWith('#'));
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

const dif = [];
let comparadas = 0;
for (const p of paginas) {
  const ruta = new URL(p.url).pathname.replace(/^\/|\/$/g, '');
  const ref = path.join('referencia', (ruta === '' ? 'index' : ruta.replace(/\//g, '__')) + '.html');
  const nueva = path.join('dist', ruta, 'index.html');
  if (!fs.existsSync(ref) || !fs.existsSync(nueva)) { dif.push(`${p.url}: falta ${!fs.existsSync(ref) ? 'referencia' : 'dist'}`); continue; }
  comparadas++;
  const a = bloquesDe(fs.readFileSync(ref, 'utf8'));
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
  const ea = enlacesDe(fs.readFileSync(ref, 'utf8')), eb = enlacesDe(nuevoHtml);
  let k = 0;
  for (const h of ea) { const i = eb.indexOf(h, k); if (i < 0) dif.push(`${p.url}: falta enlace ${h}`); else k = i + 1; }
}
fs.mkdirSync('informes', { recursive: true });
fs.writeFileSync('informes/contenido.json', JSON.stringify({ comparadas, diferencias: dif }, null, 1));
console.log(`Contenido: ${comparadas} páginas comparadas, ${dif.length} diferencias`);
dif.slice(0, 15).forEach((x) => console.log('  ' + x));
process.exit(dif.length ? 1 : 0);
