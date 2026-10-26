// Migas de pan: Inicio › sección › página. La sección sale de los menús reales
// (Tipos, Argentina) y de los datos de servicios y tipos nuevos.
import menus from '../data/menus.json';
import tiposNuevos from '../data/tipos-nuevos.json';

export type Miga = { nombre: string; url: string };
const DOMINIO = 'https://contenedoresmaritimos.net';
const rel = (u: string) => u.replace(/^https?:\/\/[^/]+/, '');

const tipos = new Set<string>([
  ...((menus as any)['contenedores-maritimos'].find((i: any) => i.label === 'Tipos')?.children ?? []).map((c: any) => rel(c.url)),
  ...tiposNuevos.tipos.map((t) => `/${t.slug}/`),
]);

export function migasDe(data: { slug: string; url: string; title: string; menu?: string; servicio?: boolean; guia?: boolean }, nombre: string): Miga[] {
  const ruta = rel(data.url);
  const inicio = { nombre: 'Inicio', url: `${DOMINIO}/` };
  if (ruta === '/') return [inicio];
  const yo = { nombre, url: data.url };
  if (tipos.has(ruta)) return [inicio, { nombre: 'Tipos de contenedores', url: `${DOMINIO}/tipos/` }, yo];
  if (data.guia) return ruta === '/guias/' ? [inicio, yo] : [inicio, { nombre: 'Guías', url: `${DOMINIO}/guias/` }, yo];
  if (data.servicio) return [inicio, { nombre: 'Servicios', url: `${DOMINIO}/servicios-contenedores-maritimos/` }, yo];
  if (data.menu === 'argentina' && ruta !== '/argentina/') return [inicio, { nombre: 'Argentina', url: `${DOMINIO}/argentina/` }, yo];
  return [inicio, yo];
}
