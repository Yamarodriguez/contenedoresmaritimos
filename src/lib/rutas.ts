// Dirección de cada página a partir de su slug. Casi todas cuelgan de la raíz
// (/madrid/), pero las de Argentina están en /ar/ (src/data/rutas-ar.json).
import rutasAr from '../data/rutas-ar.json';

const paginas = import.meta.glob('../content/pages/*.json', { eager: true, import: 'default' }) as Record<string, { slug: string; url: string }>;
const RUTAS: Record<string, string> = Object.fromEntries(Object.values(paginas).map((p) => [p.slug, new URL(p.url).pathname]));
const SLUGS: Record<string, string> = Object.fromEntries(Object.entries(RUTAS).map(([s, r]) => [r, s]));

export const rutaDe = (slug: string) => RUTAS[slug] ?? `/${slug}/`;

// Páginas generales con versión de Argentina (/precios/ → /ar/precios/), más la portada.
const EQUIVALENTES: Record<string, string> = { '/': '/ar/', ...(rutasAr as { equivalentes?: Record<string, string> }).equivalentes };
const DE_AR = Object.fromEntries(Object.entries(EQUIVALENTES).map(([e, a]) => [a, e]));

// Enlace a una página general: en las páginas de Argentina, a su versión de Argentina si la tiene.
export const paraPais = (href: string, pais: 'es' | 'ar' = 'es') => (pais === 'ar' && EQUIVALENTES[href] ? EQUIVALENTES[href] : href);

// hreflang: versión de España y de Argentina de esta página, si existen las dos.
export function alternosDe(slug: string): Record<string, string> | undefined {
  const r = slug === 'contenedores-maritimos' ? '/' : RUTAS[slug];
  const es = EQUIVALENTES[r] ? r : DE_AR[r];
  if (!es || (es !== '/' && !SLUGS[es]) || !SLUGS[EQUIVALENTES[es]]) return undefined;
  return { 'es-ES': es, 'es-AR': EQUIVALENTES[es] };
}
