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
