// Quita «Fabricación» y «fabricantes» de la web, a petición de Yama (28-10-2026):
//  - de los títulos (H1, H2, H3): «Álava, Fabricación y venta de…» → «Álava, venta de…»,
//  - de los textos: «nos dedicamos a la fabricación, construcción…» → «a la construcción…»,
//    «Trabajamos con distintos fabricantes de contenedores marítimos, empresas…» → «con empresas…»,
//  - de las descripciones: «Distribuidores y fabricantes de…» → «Distribuidores de…».
// Las reglas están en scripts/erratas.mjs (los comprobadores las aplican también al original).
//   node scripts/quitar-fabricacion.mjs
import fs from 'node:fs';
import { textoSinFabricacion } from './erratas.mjs';

const DIR = 'src/content/pages';
const ficheros = [...fs.readdirSync(DIR).map((f) => `${DIR}/${f}`), 'src/data/seo.json', 'src/data/site.json'];
let cambiados = 0;
for (const f of ficheros) {
  const s = fs.readFileSync(f, 'utf8');
  const t = textoSinFabricacion(s);
  if (t !== s) { fs.writeFileSync(f, t); cambiados++; }
}
console.log(`Ficheros sin «fabricación» ni «fabricantes»: ${cambiados}`);
