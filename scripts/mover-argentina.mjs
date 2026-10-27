// Mueve las páginas de Argentina (menú «argentina») a la sección /ar/ (27-10-2026, a
// petición de Yama): /argentina/ pasa a /ar/ y /salta/ a /ar/salta/, etc.
//  - cambia la dirección (url) de cada página,
//  - cambia los enlaces internos que apuntaban a las direcciones antiguas (páginas y datos),
//  - guarda en src/data/rutas-ar.json la lista antigua → nueva, que usan las
//    redirecciones 301 de netlify.toml y los comprobadores (el original sigue con las antiguas).
// Se puede ejecutar varias veces: solo mueve lo que aún no está en /ar/.
import fs from 'node:fs';

const dominio = 'https://contenedoresmaritimos.net';
const DIR = 'src/content/pages';
const SALIDA = 'src/data/rutas-ar.json';
const previo = fs.existsSync(SALIDA) ? JSON.parse(fs.readFileSync(SALIDA, 'utf8')).rutas : {};

const paginas = fs.readdirSync(DIR).map((f) => ({ f, p: JSON.parse(fs.readFileSync(`${DIR}/${f}`, 'utf8')) }));
const rutas = { ...previo };
for (const { p } of paginas) {
  if (p.menu !== 'argentina') continue;
  const vieja = new URL(p.url).pathname;
  if (vieja.startsWith('/ar/')) continue;
  rutas[vieja] = p.slug === 'argentina' ? '/ar/' : `/ar/${p.slug}/`;
}

// Enlace a una dirección antigua: con el dominio delante, o justo tras una comilla (también escapada en JSON).
const cambiar = (texto) => {
  let t = texto;
  for (const [vieja, nueva] of Object.entries(rutas)) {
    const v = vieja.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    t = t.replace(new RegExp(`(?<=(?:contenedoresmaritimos\\.net|"|'))${v}`, 'g'), nueva);
  }
  return t;
};

let ficheros = 0;
const datos = fs.readdirSync('src/data').filter((f) => f.endsWith('.json') && !/^(rutas-ar|ciudades|ciudades-osm|fallos-original|contenido-vivo|estructura-viva|menus-raw|legales-vivos|seo)\.json$/.test(f)).map((f) => `src/data/${f}`);
for (const ruta of [...paginas.map(({ f }) => `${DIR}/${f}`), ...datos]) {
  const s = fs.readFileSync(ruta, 'utf8');
  const t = cambiar(s);
  if (t !== s) { fs.writeFileSync(ruta, t); ficheros++; }
}

fs.writeFileSync(SALIDA, JSON.stringify({
  _nota: 'Direcciones antiguas de las páginas de Argentina y su dirección nueva en /ar/ (scripts/mover-argentina.mjs). Las usan las redirecciones 301 de netlify.toml y los comprobadores, porque el original (referencia/) sigue con las antiguas.',
  rutas,
}, null, 1) + '\n');
console.log(`Páginas de Argentina en /ar/: ${Object.keys(rutas).length}; ficheros con enlaces cambiados: ${ficheros}`);
