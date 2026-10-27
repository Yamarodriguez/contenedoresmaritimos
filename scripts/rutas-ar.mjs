// Las páginas de Argentina se movieron a /ar/ (scripts/mover-argentina.mjs), pero el
// original (referencia/, estructura-viva.json) sigue con las direcciones antiguas.
// Los comprobadores traducen con esto la dirección antigua a la nueva.
import fs from 'node:fs';

const { rutas } = JSON.parse(fs.readFileSync('src/data/rutas-ar.json', 'utf8'));
const inversa = Object.fromEntries(Object.entries(rutas).map(([a, n]) => [n, a]));

// 'salta' → 'ar/salta' (rutas sin barras, como las usan los comprobadores)
export const rutaNueva = (ruta) => (rutas[`/${ruta}/`] ?? `/${ruta}/`).replace(/^\/|\/$/g, '');
// 'ar/salta' → 'salta'
export const rutaVieja = (ruta) => (inversa[`/${ruta}/`] ?? `/${ruta}/`).replace(/^\/|\/$/g, '');
// '/salta/' o '/salta/#x' → '/ar/salta/…' (enlaces ya sin el dominio)
export const enlaceNuevo = (h) => {
  const m = h.match(/^(\/[^/#?]+\/)(.*)$/);
  return m && rutas[m[1]] ? rutas[m[1]] + m[2] : h;
};

// Páginas generales con versión de Argentina (/precios/ → /ar/precios/).
const equivalentes = JSON.parse(fs.readFileSync('src/data/rutas-ar.json', 'utf8')).equivalentes ?? {};
const deAr = Object.fromEntries(Object.entries(equivalentes).map(([g, a]) => [a, g]));
// Para comparar con el original: la versión de Argentina cuenta como la página general.
export const enlaceComparable = (h) => { const n = enlaceNuevo(h); const m = n.match(/^(\/ar\/[^/#?]+\/)(.*)$/); return m && deAr[m[1]] ? deAr[m[1]] + m[2] : n; };
// En un texto (JSON de una página de Argentina): enlaces a la página general → versión de Argentina.
export const aEnlacesAr = (texto) => {
  let t = texto;
  for (const [g, a] of Object.entries(equivalentes)) {
    const v = g.replace(/[.*+?^${}()|[\]\/]/g, '\$&');
    t = t.replace(new RegExp(`(?<=(?:contenedoresmaritimos\.net|"|'))${v}`, 'g'), a);
  }
  return t;
};
