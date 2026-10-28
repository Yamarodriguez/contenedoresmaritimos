// Quita «Fabricación» de los títulos (H1, H2, H3) de todas las páginas, a petición de
// Yama (28-10-2026). Solo los titulares: el texto de los párrafos no se toca.
//   node scripts/quitar-fabricacion.mjs
import fs from 'node:fs';
import { sinFabricacion } from './erratas.mjs';

const DIR = 'src/content/pages';
let titulos = 0, paginas = 0;
for (const f of fs.readdirSync(DIR)) {
  const p = JSON.parse(fs.readFileSync(`${DIR}/${f}`, 'utf8'));
  let cambios = 0;
  for (const b of p.blocks) {
    if (b.type !== 'heading' || !b.text) continue;
    const t = sinFabricacion(b.text);
    if (t !== b.text) { b.text = t; cambios++; }
  }
  if (cambios) { fs.writeFileSync(`${DIR}/${f}`, JSON.stringify(p, null, 1) + '\n'); titulos += cambios; paginas++; }
}
console.log(`Títulos sin «Fabricación»: ${titulos} en ${paginas} páginas`);
