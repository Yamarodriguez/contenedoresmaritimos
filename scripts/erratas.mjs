// Cambios del original aprobados por Yama (src/data/fallos-original.json).
// Los comprobadores los aplican al original antes de comparar.

// «Fabricación» fuera de los títulos (28-10-2026): «Álava, Fabricación y venta de…» → «Álava, venta de…».
const FAB = '[Ff]abricaci(?:ó|&oacute;|&#243;|&#xf3;)n';
export const sinFabricacion = (t) => t
  .replace(new RegExp(`,\\s*${FAB} containers`, 'g'), '')
  .replace(new RegExp(`(,\\s*)?${FAB} y `, 'g'), (m, coma) => (coma ? ', ' : ''));

// Solo dentro de los titulares (h1-h6) de un HTML: el texto de los párrafos no cambia.
export const titularesSinFabricacion = (html) => html.replace(/<(h[1-6])\b[^>]*>[\s\S]*?<\/\1>/g, (m) => sinFabricacion(m));

// «Fabricación» y «fabricantes» fuera también de los textos y las descripciones (28-10-2026).
const ETQ = '(?:<[^>]+>|\\s)*'; // etiquetas (<strong>…) o espacios entre palabras
export const textoSinFabricacion = (t) => sinFabricacion(t)
  .replace(new RegExp(`[Dd]istribuidores y fabricantes de`, 'g'), (m) => `${m[0]}istribuidores de`)
  .replace(new RegExp(`a la ${FAB},${ETQ}construcci`, 'g'), (m) => m.replace(new RegExp(`${FAB},\\s*`), ''))
  .replace(new RegExp(`distintos fabricantes de${ETQ}(?:contenedores|containers?|Container)${ETQ}mar(?:í|&iacute;)timos${ETQ},\\s*`, 'g'), '')
  .replace(/,\s*fabricantes de casas con contenedores/g, '');
// Se quedan las menciones técnicas al fabricante del contenedor («varían según el fabricante»,
// la placa CSC, «recién fabricado», «prefabricada»): no dicen que la empresa fabrique.
