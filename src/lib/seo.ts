// SEO que ya tenía cada página en la web viva (src/data/seo.json, sacado de
// referencia/ con scripts/seo-desde-referencia.mjs). La imagen para compartir
// apuntaba a wp-content: se cambia por la copia propia si existe.
import seo from '../data/seo.json';
import imagenes from '../data/imagenes.json';

export function seoDe(slug: string) {
  const s = (seo as Record<string, any>)[slug] ?? {};
  let imagen = '';
  const og = s.og?.imagen as string | undefined;
  if (og) {
    const ruta = og.replace(/^https?:\/\/[^/]+\/wp-content\/uploads\//, '/img/');
    if ((imagenes as Record<string, unknown>)[ruta]) imagen = ruta;
  }
  return {
    titulo: s.titulo as string | undefined,
    descripcion: s.descripcion as string | undefined,
    ogTitulo: (s.og?.titulo as string) || undefined,
    ogDescripcion: (s.og?.descripcion as string) || undefined,
    imagen,
  };
}
