// Versión de Argentina (/ar/…) de las páginas generales (27-10-2026, a petición de Yama):
// medidas, tipos, venta, alquiler, transporte, construcciones, comprar y servicios.
// Cada una parte del contenido de la página de España, con:
//  - su propio H1, título y descripción para Argentina,
//  - los precios en dólares (el original da las mismas cifras en euros en España y en dólares en Argentina),
//  - la foto principal con el H1 en el nombre y las fotos de cada H2 con su H2,
//  - el menú de Argentina y los enlaces a las versiones de Argentina (rutas-ar.json, «equivalentes»).
// Las dos versiones llevan hreflang (src/lib/rutas.ts). Después: node scripts/mover-argentina.mjs
//   node scripts/argentina-equivalentes.mjs
import fs from 'node:fs';
import { crearFotos } from './lib-contenido.mjs';
import { aEnlacesAr } from './rutas-ar.mjs';

const dominio = 'https://contenedoresmaritimos.net';
const PAGINAS = {
  medidas: { h1: 'Medidas de contenedores marítimos en Argentina', titulo: 'Medidas de contenedores marítimos en Argentina | 20 y 40 pies', descripcion: 'Medidas de los contenedores marítimos en Argentina: largo, ancho, alto y volumen de los de 20 y 40 pies, high cube y otros tipos. Pide presupuesto con el flete.' },
  tipos: { h1: 'Tipos de contenedores marítimos en Argentina', titulo: 'Tipos de contenedores marítimos en Argentina | Modelos y usos', descripcion: 'Tipos de contenedores marítimos en Argentina: 20 y 40 pies, high cube, refrigerados, open top, flat rack, open side y más. Usos, medidas y presupuesto.' },
  venta: { h1: 'Venta de contenedores marítimos en Argentina', titulo: 'Venta de contenedores marítimos en Argentina | Nuevos y usados', descripcion: 'Venta de contenedores marítimos en Argentina, nuevos y usados, de 20 y 40 pies. Precios orientativos en dólares y presupuesto con el flete hasta tu dirección.' },
  alquiler: { h1: 'Alquiler de contenedores marítimos en Argentina', titulo: 'Alquiler de contenedores marítimos en Argentina | Obras y almacenaje', descripcion: 'Alquiler de contenedores marítimos en Argentina para obras, almacenaje y eventos. Indica la dirección y el tiempo que lo necesitas y te pasamos presupuesto.' },
  transporte: { h1: 'Transporte de contenedores marítimos en Argentina', titulo: 'Transporte y flete de contenedores marítimos en Argentina', descripcion: 'Transporte y flete de contenedores marítimos en Argentina, en camión con grúa o con plataforma, hasta tu dirección. Pide presupuesto con el flete incluido.' },
  'construcciones-con-contenedores': { h1: 'Construcciones con contenedores en Argentina', titulo: 'Construcciones con contenedores en Argentina | Casas, oficinas y locales', descripcion: 'Construcciones con contenedores marítimos en Argentina: casas, oficinas, locales y módulos sanitarios. Te asesoramos y te pasamos presupuesto.' },
  comprar: { h1: 'Comprar contenedores marítimos en Argentina', titulo: 'Comprar contenedores marítimos en Argentina | Precios en dólares', descripcion: 'Comprar un contenedor marítimo en Argentina: tamaños, nuevos o usados, precios orientativos en dólares y presupuesto con el flete hasta tu dirección.' },
  'servicios-contenedores-maritimos': { h1: 'Servicios para contenedores marítimos en Argentina', titulo: 'Servicios para contenedores marítimos en Argentina: electricidad, pintura y más', descripcion: 'Servicios para contenedores marítimos en Argentina: instalación eléctrica, pintura, aislamiento, ventanas, fontanería y más para adaptar tu contenedor.' },
};

// Tipos de contenedor y contacto: mismo patrón de H1, título y descripción.
const TIPOS = {
  'de-20-pies': 'Contenedores marítimos de 20 pies', 'de-40-pies': 'Contenedores marítimos de 40 pies', 'high-cube': 'Contenedores high cube',
  refrigerados: 'Contenedores refrigerados', 'open-top': 'Contenedores open top', 'flat-rack': 'Contenedores flat rack', 'open-side': 'Contenedores open side',
  'dry-van': 'Contenedores dry van', cisternas: 'Contenedores cisterna', almacenamiento: 'Contenedores de almacenamiento', ventilados: 'Contenedores ventilados',
  casas: 'Casas contenedores', oficinas: 'Oficinas con contenedores', sanitarios: 'Contenedores sanitarios', 'locales-comerciales': 'Locales comerciales con contenedores',
};
for (const [slug, nombre] of Object.entries(TIPOS)) {
  const h1 = `${nombre} en Argentina`;
  PAGINAS[slug] = { h1, titulo: `${h1} | Venta, alquiler y flete`, descripcion: `${h1}: nuevos y usados, medidas, usos y precios orientativos en dólares. Pide presupuesto con el flete hasta tu dirección.` };
}
PAGINAS.contacto = { h1: 'Contacto: contenedores marítimos en Argentina', titulo: 'Contacto y presupuesto de contenedores marítimos en Argentina', descripcion: 'Pide presupuesto de contenedores marítimos en Argentina: cuéntanos el tamaño, el uso y la dirección de entrega y te respondemos sin compromiso.' };

const { fotoDeH2, ejecutar } = crearFotos();
const fotos = JSON.parse(fs.readFileSync('src/data/fotos-seccion.json', 'utf8'));
const fotoPara = (t) => {
  t = t.toLowerCase();
  if (/segunda mano/.test(t)) return fotos.segunda;
  if (/medidas/.test(t)) return fotos.medidas;
  if (/construcc/.test(t)) return fotos.construcc;
  if (/comprar/.test(t)) return fotos.comprar;
  if (/transporte/.test(t)) return fotos.transporte;
  if (/alquiler/.test(t)) return fotos.alquiler;
  if (/\bventa\b/.test(t)) return fotos.venta;
  return fotos.general;
};
const sinHtml = (t = '') => t.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
// Precios del original en euros → en dólares, como en el resto de páginas de Argentina.
// y «en alguna provincia de España» → «de Argentina», como dicen las páginas de Argentina del original.
const enDolares = (t) => t.replace(/provincia de España/g, 'provincia de Argentina').replace(/los 1000 e y 2500/g, 'los 1000 y 2500').replace(/\beuros\b/g, 'dólares').replace(/\beuro\b/g, 'dólar');

// Listas de enlaces a provincias de España (como en la página de 20 pies): en la versión de
// Argentina se cambian por la lista de provincias de Argentina.
const ciudades = JSON.parse(fs.readFileSync('src/data/ciudades.json', 'utf8'));
const deEspana = new Set(Object.keys(ciudades).filter((s) => ciudades[s].pais === 'es'));
const urlDe = (s) => JSON.parse(fs.readFileSync(`src/content/pages/${s}.json`, 'utf8')).url;
const provinciasAr = Object.keys(ciudades).filter((s) => ciudades[s].pais === 'ar' && ciudades[s].tipo === 'state')
  .sort((a, b) => ciudades[a].nombre.localeCompare(ciudades[b].nombre, 'es'));
const listaAr = {
  type: 'text', nuevo: true,
  text: provinciasAr.map((s) => `Contenedores marítimos ${ciudades[s].nombre}`).join(' '),
  html: `<p>${provinciasAr.map((s) => `<a href="${urlDe(s)}">Contenedores marítimos ${ciudades[s].nombre}</a>`).join('<br />')}</p>`,
};
const enlacesEspana = (b) => [...(b.html ?? '').matchAll(/contenedoresmaritimos\.net\/([a-z0-9-]+)\//g)].filter((m) => deEspana.has(m[1])).length;

const carpetas = [];
for (const [slug, d] of Object.entries(PAGINAS)) {
  const o = JSON.parse(fs.readFileSync(`src/content/pages/${slug}.json`, 'utf8'));
  const dir = `/img/ar/${slug}`; carpetas.push(dir);
  // Foto principal con el H1 en el nombre; cada H2, su foto con el H2 en el nombre (la del
  // original si la trae justo detrás; si no, la del tema, como hace src/lib/fotos.ts).
  const blocks = [{ type: 'heading', tag: 'h1', text: d.h1 }];
  const orig = o.blocks.filter((b) => !(b.type === 'heading' && b.tag === 'h1'));
  const esFoto = (b) => b?.type === 'image' && !b.href && b.src;
  let principal = true;
  for (let i = 0; i < orig.length; i++) {
    const b = orig[i];
    if (b.type === 'heading' && b.tag === 'h2') {
      principal = false;
      const h2 = sinHtml(b.text);
      blocks.push(b);
      if (esFoto(orig[i + 1])) { blocks.push(fotoDeH2(dir, h2, orig[i + 1].src, orig[i + 1].ajuste)); i++; }
      else { const f = fotoPara(h2); blocks.push(fotoDeH2(dir, h2, f.src, f.ajuste)); }
      continue;
    }
    if (principal && esFoto(b)) { blocks.push(fotoDeH2(dir, d.h1, b.src, b.ajuste)); principal = false; continue; }
    if (b.type === 'text' && enlacesEspana(b) >= 5) { if (!blocks.includes(listaAr)) blocks.push(listaAr); continue; }
    blocks.push(b);
  }
  const { slug: _s, title: _t, url: _u, meta_description: _m, menu: _me, blocks: _b, ...resto } = o;
  const json = JSON.stringify({
    ...resto, slug: `${slug}-ar`, title: d.titulo, url: `${dominio}/ar/${slug}/`, meta_description: d.descripcion,
    menu: 'argentina', nueva: true, ar_de: slug, blocks,
  }, null, 1) + '\n';
  fs.writeFileSync(`src/content/pages/${slug}-ar.json`, aEnlacesAr(enDolares(json)));
}
const n = await ejecutar(carpetas);
console.log(`Versiones de Argentina: ${Object.keys(PAGINAS).map((s) => `/ar/${s}/`).join(', ')} (${n} fotos con nombre propio)`);
