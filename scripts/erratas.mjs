// Cambios del original aprobados por Yama que afectan a los títulos (src/data/fallos-original.json).
// Los comprobadores los aplican al original antes de comparar.

// «Fabricación» fuera de los títulos (28-10-2026): «Álava, Fabricación y venta de…» → «Álava, venta de…».
const FAB = '[Ff]abricaci(?:ó|&oacute;|&#243;|&#xf3;)n';
export const sinFabricacion = (t) => t
  .replace(new RegExp(`,\\s*${FAB} containers`, 'g'), '')
  .replace(new RegExp(`(,\\s*)?${FAB} y `, 'g'), (m, coma) => (coma ? ', ' : ''));

// Solo dentro de los titulares (h1-h6) de un HTML: el texto de los párrafos no cambia.
export const titularesSinFabricacion = (html) => html.replace(/<(h[1-6])\b[^>]*>[\s\S]*?<\/\1>/g, (m) => sinFabricacion(m));
