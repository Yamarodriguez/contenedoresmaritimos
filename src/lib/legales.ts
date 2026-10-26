// Textos de las páginas legales que están vacías en la web original
// (src/data/legales-nuevos.json, generado por scripts/generar-legales.py).
// Los {{marcadores}} se rellenan con los datos de site.json.
import legales from '../data/legales-nuevos.json';
import site from '../data/site.json';

export function textoLegal(slug: string): string | null {
  const t = (legales as Record<string, string>)[slug];
  if (!t || slug.startsWith('_')) return null;
  const datos: Record<string, string> = {
    nombre: site.titular.nombre,
    nif: site.titular.nif,
    direccion: site.titular.direccion,
    correo: site.correo,
    dominio: site.dominio,
    fecha: (legales as Record<string, string>).fecha,
  };
  return t.replace(/\{\{(\w+)\}\}/g, (_m, k) => datos[k] ?? '');
}
