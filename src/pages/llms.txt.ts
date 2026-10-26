// /llms.txt: resumen del sitio en texto plano para los buscadores con IA
// (formato de llmstxt.org). Sale de los mismos datos que la web: si cambia un
// resumen o una página, cambia aquí también.
import type { APIRoute } from 'astro';
import site from '../data/site.json';
import fichas from '../data/fichas.json';
import servicios from '../data/servicios-paginas.json';
import tiposNuevos from '../data/tipos-nuevos.json';

const D = `https://${site.dominio}`;
const res = (slug: string) => (fichas.paginas as Record<string, { resumen?: string }>)[slug]?.resumen ?? '';

export const GET: APIRoute = () => {
  const l: string[] = [];
  l.push(`# ${site.nombre}`, '', `> ${res('index')}`, '');
  l.push(`Contacto: ${site.correo}${site.telefono ? ` · Teléfono: ${site.telefono}` : ''} · Formulario: ${D}/contacto/`, '');
  l.push('## Guías principales', '');
  l.push(`- [Medidas de los contenedores marítimos](${D}/medidas/): ${res('medidas')}`);
  l.push(`- [Precios de los contenedores marítimos](${D}/precios/): ${res('precios')}`);
  l.push(`- [Tipos de contenedores marítimos](${D}/tipos/): ${res('tipos')}`);
  l.push(`- [Contenedores para almacenaje](${D}/contenedores-para-almacenaje/): ${res('contenedores-para-almacenaje')}`);
  l.push(`- [Contenedores para construcción y obras](${D}/contenedores-para-construccion/): ${res('contenedores-para-construccion')}`, '');
  l.push('## Guías', '');
  for (const [slug, nombre] of [['contenedor-maritimo-nuevo-o-usado', '¿Contenedor marítimo nuevo o usado?'], ['que-revisar-contenedor-usado', 'Qué revisar al comprar un contenedor usado'], ['grados-contenedor-usado-certificado-csc', 'Grados de un contenedor usado y certificado CSC'], ['permiso-poner-contenedor-terreno', '¿Necesito permiso para poner un contenedor en mi terreno?']]) l.push(`- [${nombre}](${D}/${slug}/): ${res(slug)}`);
  l.push('');
  l.push('## Tipos de contenedor', '');
  for (const [slug, nombre] of [['de-10-pies', 'Contenedor de 10 pies'], ['de-20-pies', 'Contenedor de 20 pies'], ['de-40-pies', 'Contenedor de 40 pies'], ['de-45-pies', 'Contenedor de 45 pies'], ['high-cube', 'High Cube'], ['refrigerados', 'Refrigerados'], ['open-top', 'Open top'], ['dry-van', 'Dry van']]) {
    if (slug.startsWith('de-') && slug !== 'de-20-pies' && slug !== 'de-40-pies' && !tiposNuevos.tipos.some((t) => t.slug === slug)) continue;
    l.push(`- [${nombre}](${D}/${slug}/): ${res(slug)}`);
  }
  l.push('', '## Servicios', '');
  l.push(`- [Todos los servicios para contenedores](${D}/servicios-contenedores-maritimos/)`);
  for (const s of servicios.servicios) l.push(`- [${s.clave.charAt(0).toUpperCase() + s.clave.slice(1)}](${D}/${s.slug}/): ${s.resumen}`);
  l.push('', '## Venta, alquiler y transporte', '');
  for (const [slug, nombre] of [['venta', 'Venta de contenedores'], ['segunda-mano', 'Contenedores de segunda mano'], ['alquiler', 'Alquiler de contenedores'], ['transporte', 'Transporte de contenedores'], ['construcciones-con-contenedores', 'Construcciones con contenedores']]) l.push(`- [${nombre}](${D}/${slug}/)`);
  l.push('', '## Dónde', '', `- [España](${D}/): páginas por provincia y ciudad.`, `- [Argentina](${D}/argentina/): páginas por provincia y ciudad.`, '');
  l.push('## Opcional', '', `- [Aviso legal](${D}/aviso-legal/)`, `- [Política de privacidad](${D}/politica-de-privacidad/)`, `- [Mapa del sitio](${D}/sitemap.xml)`, '');
  return new Response(l.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
