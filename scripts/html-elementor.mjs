// Recupera el HTML de los widgets de texto de Elementor (enlaces, listas,
// negritas) que la primera extracción aplanó a texto plano. Empareja por orden
// y se niega a tocar una página si los recuentos no cuadran.
import fs from 'node:fs';

const xml = fs.readFileSync('contenedoresmaritimos.WordPress.2026-10-25.xml', 'utf8');
const porSlug = new Map();
for (const item of xml.split('<item>').slice(1)) {
  const slug = item.match(/<wp:post_name><!\[CDATA\[([^\]]*)\]\]>/)?.[1];
  const tipo = item.match(/<wp:post_type><!\[CDATA\[([^\]]*)\]\]>/)?.[1];
  const m = item.match(/<wp:meta_key><!\[CDATA\[_elementor_data\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>/);
  if (slug && tipo === 'page' && m) porSlug.set(slug, JSON.parse(m[1]));
}
const dir = 'src/content/pages/';
let cambiadas = 0, textos = 0; const problemas = [];
for (const f of fs.readdirSync(dir)) {
  const pag = JSON.parse(fs.readFileSync(dir + f, 'utf8'));
  const arbol = porSlug.get(pag.slug);
  if (!arbol) continue;
  const w = [];
  (function walk(a) { for (const e of a) { if (e.elType === 'widget' && e.widgetType === 'text-editor' && (e.settings.editor || '').replace(/<[^>]+>|&nbsp;|\s/g, '')) w.push(e); if (e.elements) walk(e.elements); } })(arbol);
  const bl = pag.blocks.filter((b) => b.type === 'text');
  if (w.length !== bl.length) { problemas.push(`${pag.slug}: ${w.length} widgets, ${bl.length} bloques`); continue; }
  w.forEach((e, i) => { bl[i].html = e.settings.editor || ''; textos++; });
  fs.writeFileSync(dir + f, JSON.stringify(pag, null, 1) + '\n'); cambiadas++;
}
console.log(`Páginas: ${cambiadas}. Textos con HTML: ${textos}. Problemas: ${problemas.length}`);
problemas.slice(0, 10).forEach((p) => console.log('  ' + p));
