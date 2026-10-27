// Dirección de cada página a partir de su slug. Casi todas cuelgan de la raíz
// (/madrid/), pero las de Argentina están en /ar/ (src/data/rutas-ar.json).
const paginas = import.meta.glob('../content/pages/*.json', { eager: true, import: 'default' }) as Record<string, { slug: string; url: string }>;
const RUTAS: Record<string, string> = Object.fromEntries(Object.values(paginas).map((p) => [p.slug, new URL(p.url).pathname]));

export const rutaDe = (slug: string) => RUTAS[slug] ?? `/${slug}/`;

// Versiones equivalentes para hreflang: la portada de España y la de Argentina.
export const PORTADAS = { es: '/', ar: '/ar/' };
