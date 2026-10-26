// Saca el SEO que ya tiene cada página en la web viva (título, descripción,
// imagen para compartir) de referencia/ -> src/data/seo.json. Se conserva tal
// cual: es lo que Google ya conoce de cada URL.
import fs from 'node:fs';
import path from 'node:path';

const decode = (s = '') => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
const meta = (h, attr, nombre) => {
  const m = h.match(new RegExp(`<meta[^>]+${attr}="${nombre}"[^>]*content="([^"]*)"`, 'i'))
    || h.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]*${attr}="${nombre}"`, 'i'));
  return m ? decode(m[1]) : '';
};

const salida = {};
const sinDescripcion = [];
for (const f of fs.readdirSync('referencia').sort()) {
  const h = fs.readFileSync(path.join('referencia', f), 'utf8');
  const slug = f.replace(/\.html$/, '');
  const titulo = decode((h.match(/<title>([^<]*)<\/title>/i) || [])[1]);
  const descripcion = meta(h, 'name', 'description');
  const og = { titulo: meta(h, 'property', 'og:title'), descripcion: meta(h, 'property', 'og:description'), imagen: meta(h, 'property', 'og:image') };
  salida[slug] = { titulo, descripcion, og };
  if (!descripcion) sinDescripcion.push(slug);
}
fs.writeFileSync('src/data/seo.json', JSON.stringify(salida, null, 1) + '\n');
console.log(`SEO: ${Object.keys(salida).length} páginas, ${sinDescripcion.length} sin descripción: ${sinDescripcion.join(', ')}`);
const ej = salida['salta'];
console.log(JSON.stringify(ej).slice(0, 600));
