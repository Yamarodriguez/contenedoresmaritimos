// C3: el validador sobre dist/.
import fs from 'node:fs';
import path from 'node:path';

const DOMINIO = 'https://contenedoresmaritimos.net';
const fallos = [];
const avisos = [];

function paginas(dir) {
  const salida = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) salida.push(...paginas(p));
    else if (e.name.endsWith('.html')) salida.push(p);
  }
  return salida;
}

const config = fs.readFileSync('astro.config.mjs', 'utf8');
if (!/trailingSlash:\s*'always'/.test(config)) fallos.push('astro.config.mjs sin trailingSlash: always');
if (!/format:\s*'directory'/.test(config)) fallos.push("astro.config.mjs sin build.format: 'directory'");

const ficheros = paginas('dist');
for (const f of ficheros) {
  const rel = path.relative('dist', f).replace(/\\/g, '/');
  const html = fs.readFileSync(f, 'utf8');
  const es404 = rel === '404.html';
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (!es404 && h1 !== 1) fallos.push(`${rel}: ${h1} H1 (debe haber 1)`);
  const texto = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
  if (/\[[a-z_-]+( [^\]]*)?\]/i.test(texto.replace(/<[^>]+>/g, ' ').replace(/\[Mapa:[^\]]*\]/g, ''))) {
    avisos.push(`${rel}: posible shortcode literal`);
  }
  if (!es404) {
    const url = rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '');
    const esperado = `${DOMINIO}${url}`;
    const m = html.match(/<link rel="canonical" href="([^"]+)"/);
    if (!m) fallos.push(`${rel}: sin canonical`);
    else if (m[1] !== esperado) fallos.push(`${rel}: canonical ${m[1]} (esperado ${esperado})`);
  }
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const src = m[1];
    if (/^https?:\/\//.test(src)) { fallos.push(`${rel}: imagen externa ${src}`); continue; }
    if (!fs.existsSync(path.join('dist', decodeURI(src.split('?')[0])))) fallos.push(`${rel}: falta imagen ${src}`);
  }
  if (/casascontenedores/i.test(html)) {
    // Vale si ya estaba en el original (p. ej. un enlace real al sitio hermano).
    const slug = rel === 'index.html' ? 'index' : rel.replace(/\/index\.html$/, '').replace(/\//g, '__');
    const ref = path.join('referencia', slug + '.html');
    const enOriginal = fs.existsSync(ref) && /casascontenedores/i.test(fs.readFileSync(ref, 'utf8'));
    if (!enOriginal) fallos.push(`${rel}: texto de casascontenedores que no estaba en el original`);
  }
}

fs.mkdirSync('informes', { recursive: true });
fs.writeFileSync('informes/validador.json', JSON.stringify({ paginas: ficheros.length, fallos, avisos }, null, 1));
console.log(`Validador: ${ficheros.length} páginas, ${fallos.length} fallos, ${avisos.length} avisos`);
fallos.slice(0, 15).forEach((x) => console.log('  FALLO ' + x));
avisos.slice(0, 5).forEach((x) => console.log('  AVISO ' + x));
process.exit(fallos.length ? 1 : 0);
