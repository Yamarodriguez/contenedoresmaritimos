// Recupera los enlaces que Elementor pone en titulares e imágenes (settings.link.url)
// y que la primera extracción no copió. Empareja por orden dentro de cada página
// y se niega a tocar una página si los recuentos o los textos no cuadran.
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
const sinTags = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
let cambiadas = 0, enlaces = 0; const problemas = [];
for (const f of fs.readdirSync(dir)) {
  const pag = JSON.parse(fs.readFileSync(dir + f, 'utf8'));
  const arbol = porSlug.get(pag.slug);
  if (!arbol) continue;
  const w = [];
  (function walk(a) { for (const e of a) { if (e.elType === 'widget' && ['heading', 'image'].includes(e.widgetType)) w.push(e); if (e.elements) walk(e.elements); } })(arbol);
  const bl = pag.blocks.filter((b) => b.type === 'heading' || b.type === 'image');
  if (w.length !== bl.length || w.some((e, i) => e.widgetType !== bl[i].type)) { problemas.push(`${pag.slug}: no cuadra (${w.length} widgets, ${bl.length} bloques)`); continue; }
  let toco = false;
  w.forEach((e, i) => {
    const url = e.settings.link?.url;
    if (!url || bl[i].href) return;
    if (e.widgetType === 'image' && e.settings.link_to !== 'custom') return;
    bl[i].href = url; toco = true; enlaces++;
  });
  if (toco) { fs.writeFileSync(dir + f, JSON.stringify(pag, null, 1) + '\n'); cambiadas++; }
}
console.log(`Páginas cambiadas: ${cambiadas}. Enlaces recuperados: ${enlaces}. Problemas: ${problemas.length}`);
problemas.slice(0, 10).forEach((p) => console.log('  ' + p));
