// Mapa del sitio: todas las páginas de contenido (la 404 no). Las direcciones
// salen del propio contenido, con barra final y el dominio definitivo.
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const paginas = import.meta.glob('../content/pages/*.json', { eager: true });
  const urls = Object.values(paginas)
    .map((m: any) => m.default.url as string)
    .sort();
  const cuerpo = urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${cuerpo}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
