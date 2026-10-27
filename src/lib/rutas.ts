// Dirección de cada página a partir de su slug. Casi todas cuelgan de la raíz
// (/madrid/), pero las de Argentina están en /ar/ (src/data/rutas-ar.json).
const paginas = import.meta.glob('../content/pages/*.json', { eager: true, import: 'default' }) as Record<string, { slug: string; url: string }>;
const RUTAS: Record<string, string> = Object.fromEntries(Object.values(paginas).map((p) => [p.slug, new URL(p.url).pathname]));

export const rutaDe = (slug: string) => RUTAS[slug] ?? `/${slug}/`;

// Páginas con versión de España y de Argentina (hreflang): [España, Argentina].
const EQUIVALENTES: [string, string][] = [['contenedores-maritimos', 'argentina'], ['precios', 'precios-ar'], ['segunda-mano', 'segunda-mano-ar']];

export function alternosDe(slug: string): Record<string, string> | undefined {
  const par = EQUIVALENTES.find((p) => p.includes(slug));
  return par ? { 'es-ES': rutaDe(par[0]), 'es-AR': rutaDe(par[1]) } : undefined;
}
