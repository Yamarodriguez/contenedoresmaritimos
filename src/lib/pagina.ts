// Arma una página como la ve el visitante, a partir de la lista plana de bloques
// de Elementor. El orden del contenido no cambia; solo se agrupa:
//  - portada: la primera foto y el primer párrafo (antes del primer H2) pasan al héroe;
//  - cada H2 abre una sección (panel) con su foto y todo lo que le sigue;
//  - "¿Tienes una consulta?" + texto + formulario sale como bloque lateral aparte;
//  - las parejas "titular h3 + foto enlazada" (tipos de contenedor) forman una rejilla.
import { conFotosDeSeccion } from './fotos';
import { agrupar, type Bloque, type Trozo } from './agrupar';
import serviciosDatos from '../data/servicios-paginas.json';
import fotos from '../data/fotos-seccion.json';
import { resumenDe, tablaDe } from './fichas';
import { extrasCiudad, textosExtra } from './ciudades';
import { paraPais } from './rutas';
import faqPaginas from '../data/faq-paginas.json';

export type Seccion = { tipo: 'seccion'; titular?: Bloque; imagen?: Bloque; cuerpo: Trozo[] };
export type Consulta = { tipo: 'consulta'; titular: Bloque; texto: Bloque; formulario: Bloque };
export type Resumen = { tipo: 'resumen'; html: string };
export type Elemento = Seccion | Consulta | Resumen;
export type Pagina = { hero: { imagen?: Bloque; texto?: Bloque }; elementos: Elemento[]; conLateral: boolean };

const esH2 = (b?: Bloque) => b?.type === 'heading' && b.tag === 'h2';
const longitud = (t = '') => t.replace(/<[^>]+>/g, '').length;

// Sección «Servicios para tus contenedores marítimos»: tarjetas hacia las páginas
// de servicios. Sale en la portada y en el resto de páginas de contenido.
function seccionServicios(pais: 'es' | 'ar' = 'es'): Seccion {
  const tarjetas = serviciosDatos.servicios.map((s) => ({
    titular: { type: 'heading', tag: 'h3', text: s.nombre, href: `/${s.slug}/` },
    imagen: { type: 'image', src: `/img/servicios/${s.slug}.svg`, alt: s.nombre, href: `/${s.slug}/` },
  }));
  return {
    tipo: 'seccion',
    titular: { type: 'heading', tag: 'h2', text: 'Servicios para tus contenedores marítimos', nuevo: true },
    imagen: { type: 'image', src: fotos.construcc.src, alt: fotos.construcc.alt, nuevo: true },
    cuerpo: [
      { tipo: 'bloque', bloque: { type: 'text', html: '<p>Además de vender, alquilar y transportar contenedores, los acondicionamos para el uso que necesites. Elige un servicio para ver qué incluye.</p>', nuevo: true } },
      { tipo: 'rejilla', tarjetas },
      { tipo: 'bloque', bloque: { type: 'button', text: 'Ver todos los servicios', href: paraPais('/servicios-contenedores-maritimos/', pais) } },
    ],
  };
}

export function armarPagina(bloques: Bloque[], opciones: { servicios?: boolean; slug?: string; ficha?: string; pais?: 'es' | 'ar' } = {}): Pagina {
  const sinH1 = bloques.filter((b) => !(b.type === 'heading' && b.tag === 'h1'));
  const iH2 = sinH1.findIndex(esH2);
  const antes = iH2 < 0 ? [...sinH1] : sinH1.slice(0, iH2);
  const desde = iH2 < 0 ? [] : sinH1.slice(iH2);

  // ¿Hay un bloque de consulta antes del primer H2? Se aparta antes de elegir el héroe.
  const buscarConsulta = (lista: Bloque[]) => lista.findIndex((b, j) => b.type === 'heading' && /consulta/i.test(b.text || '')
    && lista[j + 1]?.type === 'text' && lista[j + 2]?.type === 'contact_form');
  const kAntes = buscarConsulta(antes);
  const consultaAntes = kAntes >= 0 ? antes.splice(kAntes, 3) : null;
  const trasConsulta = consultaAntes ? antes.splice(kAntes) : [];

  // Héroe: solo si la página tiene secciones (las legales, de texto largo, no).
  const hero: Pagina['hero'] = {};
  if (iH2 >= 0) {
    for (const lista of [antes, trasConsulta]) {
      if (!hero.imagen) { const iImg = lista.findIndex((b) => b.type === 'image' && !b.href); if (iImg >= 0) hero.imagen = lista.splice(iImg, 1)[0]; }
      if (!hero.texto) { const iTxt = lista.findIndex((b) => b.type === 'text' && longitud(b.html || b.text) <= 700); if (iTxt >= 0) hero.texto = lista.splice(iTxt, 1)[0]; }
    }
  }

  const elementos: Elemento[] = [];
  if (antes.length) elementos.push({ tipo: 'seccion', cuerpo: agrupar(antes) });
  if (consultaAntes) elementos.push({ tipo: 'consulta', titular: consultaAntes[0], texto: consultaAntes[1], formulario: consultaAntes[2] });
  if (trasConsulta.length) elementos.push({ tipo: 'seccion', cuerpo: agrupar(trasConsulta) });

  // Secciones: cada H2 (con su foto pegada) y su cuerpo.
  const conFotos = conFotosDeSeccion(desde);
  const grupos: { titular: Bloque; imagen?: Bloque; cuerpo: Bloque[] }[] = [];
  for (let i = 0; i < conFotos.length; i++) {
    const b = conFotos[i];
    if (esH2(b)) {
      const sig = conFotos[i + 1];
      const imagen = sig?.type === 'image' && !sig.href ? sig : undefined;
      grupos.push({ titular: b, imagen, cuerpo: [] });
      if (imagen) i++;
    } else grupos[grupos.length - 1].cuerpo.push(b);
  }
  for (const g of grupos) {
    const k = g.cuerpo.findIndex((b, j) => b.type === 'heading' && /consulta/i.test(b.text || '')
      && g.cuerpo[j + 1]?.type === 'text' && g.cuerpo[j + 2]?.type === 'contact_form');
    if (k < 0) {
      elementos.push({ tipo: 'seccion', titular: g.titular, imagen: g.imagen, cuerpo: agrupar(g.cuerpo) });
      continue;
    }
    elementos.push({ tipo: 'seccion', titular: g.titular, imagen: g.imagen, cuerpo: agrupar(g.cuerpo.slice(0, k)) });
    elementos.push({ tipo: 'consulta', titular: g.cuerpo[k], texto: g.cuerpo[k + 1], formulario: g.cuerpo[k + 2] });
    const resto = g.cuerpo.slice(k + 3);
    if (resto.length) elementos.push({ tipo: 'seccion', cuerpo: agrupar(resto) });
  }
  if (opciones.servicios && elementos.some((e) => e.tipo === 'seccion' && e.titular)) {
    const iTipos = elementos.findIndex((e) => e.tipo === 'seccion' && /tipos/i.test(e.titular?.text || ''));
    elementos.splice(iTipos >= 0 ? iTipos + 1 : elementos.length, 0, seccionServicios(opciones.pais));
  }
  // Páginas de ciudad: información propia AÑADIDA al final de algunas secciones
  // (ubicación y ciudades cercanas, puerto y transporte, consejo según la costa,
  // enlace a la provincia). El texto original no se toca.
  const extras = opciones.slug ? extrasCiudad(opciones.slug) : undefined;
  if (extras) {
    const titulos = elementos.filter((e): e is Seccion => e.tipo === 'seccion' && !!e.titular && !e.titular.nuevo);
    const añadir = (sec: Seccion | undefined, html?: string) => {
      if (sec && html) sec.cuerpo.push({ tipo: 'bloque', bloque: { type: 'text', html: `<p>${html}</p>`, nuevo: true } });
    };
    añadir(titulos[0], extras.primera);
    añadir(titulos.find((t) => /transporte/i.test(t.titular?.text || '')), extras.transporte);
    añadir(titulos.find((t) => /construcc/i.test(t.titular?.text || '')), extras.construccion);
    añadir(titulos[titulos.length - 1], extras.ultima);
  }
  if (opciones.slug) {
    const titulos = elementos.filter((e): e is Seccion => e.tipo === 'seccion' && !!e.titular && !e.titular.nuevo);
    for (const t of textosExtra(opciones.slug)) {
      const sec = t.seccion === 'primera' ? titulos[0] : titulos.find((x) => new RegExp(t.seccion, 'i').test(x.titular?.text || ''));
      if (sec) sec.cuerpo.push({ tipo: 'bloque', bloque: { type: 'text', html: `<p>${t.html}</p>`, nuevo: true } });
    }
  }

  // Preguntas frecuentes añadidas al final de las páginas principales (faq-paginas.json).
  // Las versiones de Argentina (ficha = página de España) llevan su mismo resumen, tabla y preguntas.
  const ficha = opciones.ficha ?? opciones.slug;
  const faq = ficha ? (faqPaginas as Record<string, { tema: string; faq: string[][] }>)[ficha] : undefined;
  if (faq) {
    elementos.push({
      tipo: 'seccion',
      titular: { type: 'heading', tag: 'h2', text: `Preguntas frecuentes sobre ${faq.tema}`, nuevo: true },
      imagen: { type: 'image', src: fotos.comprar.src, alt: fotos.comprar.alt, nuevo: true },
      cuerpo: faq.faq.flatMap(([q, a]) => [
        { tipo: 'bloque' as const, bloque: { type: 'heading', tag: 'h3', text: q, nuevo: true } },
        { tipo: 'bloque' as const, bloque: { type: 'text', html: `<p>${a}</p>`, nuevo: true } },
      ]),
    });
  }

  // Respuesta corta y tabla técnica al principio (lo primero que leen Google y las IA).
  if (ficha) {
    const arriba: Elemento[] = [];
    const r = resumenDe(ficha);
    if (r) arriba.push({ tipo: 'resumen', html: r });
    const t = tablaDe(ficha);
    if (t) arriba.push({ tipo: 'seccion', titular: { type: 'heading', tag: 'h2', text: t.h2 }, cuerpo: [{ tipo: 'bloque', bloque: t.bloque }] });
    elementos.unshift(...arriba);
  }
  return { hero, elementos, conLateral: elementos.some((e) => e.tipo === 'consulta') };
}
