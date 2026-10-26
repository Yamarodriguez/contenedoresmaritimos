// Reconstruye src/data/menus.json desde el menú principal que pintó WordPress
// (referencia/), con su orden y anidado reales. Hay dos variantes: la de España
// y la de Argentina; cada página usa la suya y se guarda cuál.
import fs from 'node:fs';
import path from 'node:path';

const decode = (s) => s.replace(/&amp;|&#038;/g, '&').replace(/&#8211;/g, '–').replace(/&#039;|&#8217;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const rel = (u) => u.replace(/^https?:\/\/(?:www\.)?contenedoresmaritimos\.net(?=\/)/i, '');

function arbol(nav) {
  const raiz = { hijos: [] }; const pila = [raiz]; let ult = null;
  const re = /<li\b[^>]*>|<\/li>|<ul\b[^>]*>|<\/ul>|<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  for (const m of nav.matchAll(re)) {
    const t = m[0].toLowerCase();
    if (t.startsWith('<li')) { const n = { hijos: [] }; pila[pila.length - 1].hijos.push(n); pila.push(n); ult = n; }
    else if (t.startsWith('</li')) pila.pop();
    else if (t.startsWith('<a')) { const n = pila[pila.length - 1]; if (!n.label) { n.url = rel(m[1]); n.label = decode(m[2].replace(/<[^>]+>/g, '')); } }
  }
  const limpia = (n) => ({ label: n.label, url: n.url, children: n.hijos.filter((h) => h.label).map(limpia) });
  return raiz.hijos.filter((h) => h.label).map(limpia);
}

const variantes = new Map(); const porPagina = {};
for (const f of fs.readdirSync('referencia')) {
  const h = fs.readFileSync(path.join('referencia', f), 'utf8');
  const nav = h.match(/<nav[^>]*id="site-navigation"[\s\S]*?<\/nav>/)?.[0];
  if (!nav) continue;
  const m = arbol(nav); const clave = JSON.stringify(m);
  if (!variantes.has(clave)) variantes.set(clave, { menu: m, paginas: 0 });
  variantes.get(clave).paginas++;
  porPagina[f.replace(/\.html$/, '')] = [...variantes.keys()].indexOf(clave);
}
const lista = [...variantes.values()].sort((a, b) => b.paginas - a.paginas);
console.log('Variantes:', lista.map((v) => `${v.paginas} páginas, ${v.menu.length} entradas arriba`).join(' | '));
const actual = JSON.parse(fs.readFileSync('src/data/menus.json', 'utf8'));
const claves = [...variantes.keys()];
const salida = { ...actual, 'contenedores-maritimos': lista[0].menu, argentina: lista[1]?.menu ?? actual.argentina };
fs.writeFileSync('src/data/menus.json', JSON.stringify(salida, null, 1) + '\n');
// qué menú usa cada página (por huella)
const idx = new Map(lista.map((v, i) => [JSON.stringify(v.menu), i]));
const menuDe = {}; for (const [slug, i] of Object.entries(porPagina)) menuDe[slug] = idx.get(claves[i]) === 0 ? 'contenedores-maritimos' : 'argentina';
fs.writeFileSync('src/data/menu-por-pagina.json', JSON.stringify(menuDe, null, 1) + '\n');
