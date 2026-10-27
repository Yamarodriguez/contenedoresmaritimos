// Información propia de cada página de ciudad, provincia o región, para que no
// sean páginas casi idénticas. Solo se AÑADE texto al final de algunas secciones
// (el original no se toca) y todo sale de datos verificables (src/data/ciudades.json):
// ubicación, puerto comercial más cercano con su distancia en línea recta y páginas
// cercanas de la propia web.
import ciudades from '../data/ciudades.json';
import extra from '../data/ciudades-extra.json';
import { rutaDe } from './rutas';

type Ciudad = {
  nombre: string; tipo: string; pais: 'es' | 'ar'; provincia?: string; comunidad?: string;
  puerto: { nombre: string; km: number; mar?: boolean }; cercanas: { slug: string; nombre: string; km: number }[]; esZona?: boolean; puertosZona?: string[];
};
const datos = ciudades as unknown as Record<string, Ciudad>;
const ES_CIUDAD = new Set(['city', 'town', 'village', 'municipality', 'suburb', 'hamlet', 'neighbourhood', 'quarter', 'city_district']);
// Segunda página de una misma ciudad (duplicadas): otra redacción y otras ciudades cercanas.
const VARIANTE_B = new Set<string>(extra.variante_b);
const nf = (n: number) => n.toLocaleString('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions);

const conArticulo = (r: string) => (/^(Comunidad|Región|Ciudad)/.test(r) ? `la ${r}` : /^(Principado|País)/.test(r) ? `el ${r}` : /^Islas/.test(r) ? `las ${r}` : r);
const norm = (t = '') => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/^(provincia de |comunidad (foral )?de |principado de |region de |illes |islas )/, '').replace(/[^a-z]/g, '');

// Página de la web para una provincia o comunidad (si existe), para enlazarla.
function paginaDe(nombre: string | undefined, yo: string): string | undefined {
  const pais = datos[yo]?.pais; // solo páginas del mismo país (Córdoba o La Rioja existen en los dos)
  if (!nombre) return undefined;
  const n = norm(nombre);
  const alias: Record<string, string> = { acoruna: 'la-coruna', lacoruna: 'la-coruna', cataluna: 'cataluna', catalunya: 'cataluna', araba: 'alava', alavaaraba: 'alava', arabaalava: 'alava', vizcaya: 'bizkaia', guipuzcoa: 'gipuzkoa', asturias: 'asturias', canarias: 'canarias', balears: 'mallorca' };
  const slug = (pais === 'es' ? alias[n] : undefined) ?? Object.keys(datos).find((s) => datos[s].pais === pais && norm(datos[s].nombre) === n && !ES_CIUDAD.has(datos[s].tipo));
  return slug && slug !== yo ? slug : undefined;
}

function lugar(c: Ciudad): string | undefined {
  if (/^(Ceuta|Melilla)$/.test(c.nombre)) return `${c.nombre} es una ciudad autónoma de España, en el norte de África.`;
  if (c.pais === 'ar') {
    if (c.nombre === 'Ciudad de Buenos Aires') return 'La Ciudad Autónoma de Buenos Aires (CABA) es la capital de Argentina y no forma parte de ninguna provincia.';
    if (c.tipo === 'country') return undefined;
    if (c.tipo === 'state' || c.tipo === 'province') return `${c.nombre} es una provincia de Argentina.`;
    return c.provincia ? `${c.nombre} se encuentra en la provincia de ${c.provincia.replace(/^Provincia de /, '')}, Argentina.` : undefined;
  }
  if (c.tipo === 'state') return `${c.nombre} es una comunidad autónoma de España.`;
  if (c.comunidad && norm(c.comunidad) === norm(c.nombre)) return `${c.nombre.replace(/^Islas /, 'Las Islas ')} ${/^Islas /.test(c.nombre) ? 'son' : 'es'} una comunidad autónoma de España.`;
  if (c.tipo === 'province') return c.comunidad ? `${c.nombre} es una provincia de ${conArticulo(c.comunidad)}.` : undefined;
  if (c.tipo === 'island' || c.tipo === 'archipelago') return c.comunidad ? `${c.nombre} forma parte de ${conArticulo(c.comunidad)}.` : undefined;
  const prov = c.provincia && c.provincia !== c.comunidad ? `la provincia de ${c.provincia}` : '';
  const com = c.comunidad ? conArticulo(c.comunidad) : '';
  if (!prov && !com) return undefined;
  return `${c.nombre} se encuentra en ${[prov, com].filter(Boolean).join(', en ')}.`;
}

export type ExtrasCiudad = { etiqueta?: string; primera?: string; transporte?: string; construccion?: string; ultima?: string };

export function extrasCiudad(slug: string): ExtrasCiudad | undefined {
  const c = datos[slug];
  if (!c || !c.puerto) return undefined;
  const pais = c.pais === 'ar' ? 'Argentina' : 'España';
  const ciudadAutonoma = /^(Ceuta|Melilla)$/.test(c.nombre);
  const zona = ciudadAutonoma ? undefined : ES_CIUDAD.has(c.tipo) ? (c.provincia ?? c.comunidad) : c.tipo === 'country' ? undefined : c.comunidad;
  const etiqueta = c.tipo === 'country' ? undefined : zona && zona !== c.nombre ? `${c.nombre} · ${zona.replace(/^Provincia de /, '')}` : c.nombre;

  const b = VARIANTE_B.has(slug);
  // Portada de un país (Argentina): enlaza todas sus provincias y ciudades de la web.
  const delPais = c.tipo === 'country'
    ? Object.entries(datos).filter(([s, o]) => s !== slug && o.pais === c.pais && o.tipo !== 'country').sort(([, x], [, y]) => x.nombre.localeCompare(y.nombre, 'es')).map(([s, o]) => `<a href="${rutaDe(s)}">${o.nombre}</a>`)
    : [];
  const cerca = (b ? c.cercanas.slice(3, 6) : c.cercanas.slice(0, c.esZona ? 6 : 3)).map((o) => c.esZona ? `<a href="${rutaDe(o.slug)}">${o.nombre}</a>` : `<a href="${rutaDe(o.slug)}">${o.nombre}</a> (a unos ${nf(o.km)} km)`);
  const listaCerca = cerca.length > 1 ? `${cerca.slice(0, -1).join(', ')} y ${cerca[cerca.length - 1]}` : cerca[0];
  const primera = [lugar(c), delPais.length ? `En ${c.nombre} tienes información de contenedores marítimos por provincia y ciudad: ${delPais.slice(0, -1).join(', ')} y ${delPais[delPais.length - 1]}.` : '', listaCerca ? (b ? `Otras páginas de la zona que pueden interesarte: ${listaCerca}.` : c.esZona ? `En ${c.nombre} también tienes información de contenedores marítimos en ${listaCerca}.` : `Cerca de ${c.nombre} también tienes información de contenedores marítimos en ${listaCerca}.`) : '']
    .filter(Boolean).join(' ');

  const p = c.puerto;
  const camion = b
    ? `El contenedor se entrega en ${c.nombre} por carretera, con un camión grúa o de plataforma; para darte precio necesitamos saber la dirección y cómo es el acceso.`
    : `Para la entrega en ${c.nombre}, el contenedor llega en camión con grúa o con plataforma: indica en tu consulta la dirección exacta y si hay espacio para que el camión maniobre y lo descargue.`;
  let transporte: string;
  let construccion: string | undefined;
  if (c.esZona && !ciudadAutonoma) {
    // Provincias, regiones e islas: no se da una distancia (se mediría desde el centro de la zona).
    const ps = c.puertosZona ?? [];
    const lista = ps.length > 1 ? `${ps.slice(0, -1).join(', ')} y ${ps[ps.length - 1]}` : ps[0];
    transporte = `${lista ? `${ps.length > 1 ? `Los principales puertos comerciales cercanos a las ciudades de ${c.nombre} con página en esta web son los de ${lista}` : `El principal puerto comercial cercano a las ciudades de ${c.nombre} con página en esta web es el de ${lista}`}. ` : ''}${camion}`;
  } else {
    const portuaria = (p.km <= 10 && ciudadAutonoma) || norm(p.nombre) === norm(c.nombre) || (p.km <= 10 && norm(c.nombre).endsWith(norm(p.nombre))) || (p.km <= 10 && p.nombre === c.nombre);
    const puertoTxt = portuaria
      ? `${c.nombre} tiene puerto comercial propio${p.mar === false ? ', de río' : ''}.`
      : b
        ? `A unos ${nf(p.km)} km en línea recta de ${c.nombre} está el puerto de ${p.nombre}, el más próximo entre los principales de ${pais}.`
        : `Entre los principales puertos comerciales de ${pais}, el más cercano a ${c.nombre} es el de ${p.nombre}, a unos ${nf(p.km)} km en línea recta.`;
    transporte = `${puertoTxt} ${camion}`;
    construccion = p.km <= 25 && p.mar !== false
      ? b ? `El aire del mar acelera la corrosión: en ${c.nombre}, una buena <a href="/pintura-contenedores-maritimos/">pintura</a> antioxidante alarga la vida del contenedor.` : `Por la cercanía de ${c.nombre} al mar, conviene proteger bien el contenedor contra la corrosión del salitre con una buena <a href="/pintura-contenedores-maritimos/">pintura</a> y revisar su estado con más frecuencia.`
      : p.km > 60
        ? (b
          ? `En ${c.nombre}, lejos de los grandes puertos, conviene pedir el presupuesto con el transporte ya incluido para comparar bien; y si habrá personas dentro, piensa en el <a href="/aislamiento-contenedores-maritimos/">aislamiento</a>.`
          : `Como ${c.nombre} está lejos de los grandes puertos, el transporte por carretera pesa en el presupuesto: pide el precio con el transporte incluido. Si el contenedor va a usarse con personas dentro, valora también el <a href="/aislamiento-contenedores-maritimos/">aislamiento</a>.`)
        : undefined;
  }

  const prov = paginaDe(c.provincia, slug) ?? paginaDe(c.comunidad, slug);
  const ultima = prov
    ? `Si buscas un contenedor en otra zona de ${datos[prov].nombre}, consulta también nuestra página de <a href="${rutaDe(prov)}">contenedores marítimos en ${datos[prov].nombre}</a>.`
    : c.pais === 'ar' && slug !== 'argentina'
      ? `Consulta también nuestra página de <a href="/ar/">contenedores marítimos en ${pais}</a>.`
      : undefined;

  return { etiqueta, primera: primera || undefined, transporte, construccion, ultima };
}

// Textos añadidos a mano para una página concreta (src/data/ciudades-extra.json).
export function textosExtra(slug: string): { seccion: string; html: string }[] {
  return (extra.textos as Record<string, { seccion: string; html: string }[]>)[slug] ?? [];
}
