// Crea las páginas de ubicaciones nuevas (src/data/ciudades-nuevas.json) y la página
// /ubicaciones/ con todas las ciudades de la web. Cada página lleva la misma estructura
// que las demás (portada con foto, secciones con foto, formulario, tipos, precios…),
// con la foto principal y las de cada H2 con la palabra clave en el nombre y en el alt.
// La información propia (puerto, cercanas…) la añade src/lib/ciudades.ts con los datos
// de scripts/geo-ciudades.mjs. Orden: node scripts/ciudades-nuevas.mjs && node scripts/geo-ciudades.mjs
import fs from 'node:fs';
import { crearFotos, negritas } from './lib-contenido.mjs';

const { ubicaciones } = JSON.parse(fs.readFileSync('src/data/ciudades-nuevas.json', 'utf8'));
const fotos = JSON.parse(fs.readFileSync('src/data/fotos-seccion.json', 'utf8'));
const madrid = JSON.parse(fs.readFileSync('src/content/pages/madrid.json', 'utf8'));
const dominio = 'https://contenedoresmaritimos.net';
const { fotoDeH2, ejecutar } = crearFotos();

// Rejilla de tipos de contenedor, la misma que el resto de ciudades.
const b = madrid.blocks;
const ini = b.findIndex((x) => x.type === 'heading' && x.tag === 'h3');
let fin = ini; while (b[fin] && ((b[fin].type === 'heading' && b[fin].tag === 'h3') || b[fin].type === 'image')) fin++;
const tipos = b.slice(ini, fin);

const heroes = [fotos.venta.src, '/img/2023/09/container-argentina.jpg', fotos.segunda.src, fotos.transporte.src];
const PRECIOS = '/img/2021/12/Precios-contenedores-maritimos.jpg';
const link = (href, t) => `<a href="${href}">${t}</a>`;

const carpetas = [];
for (const [i, u] of ubicaciones.entries()) {
  const n = u.nombre;
  const ar = u.pais === 'ar'; // Argentina: en /ar/, menú de Argentina y precios en dólares
  const ruta = ar ? `/ar/${u.ruta ?? u.slug}/` : `/${u.slug}/`;
  const dir = `/img/ubicaciones/${u.slug}`; carpetas.push(dir);
  const t = (txt) => ({ type: 'text', text: txt.replace(/<[^>]+>/g, ''), html: `<p>${negritas(txt, [`contenedores marítimos en ${n}`, `contenedores marítimos`, `contenedor marítimo`, n])}</p>`, nuevo: true });
  const h = (texto, foto, ajuste) => [{ type: 'heading', tag: 'h2', text: texto }, fotoDeH2(dir, texto, foto, ajuste)];
  const h1 = `Contenedores marítimos en ${n}`;
  const blocks = [
    { type: 'heading', tag: 'h1', text: h1 },
    t(`En ${n} puedes comprar o alquilar contenedores marítimos nuevos y de segunda mano, con transporte hasta tu dirección y servicios para adaptarlos. Consulta los tipos, las medidas y los precios orientativos, y pide presupuesto sin compromiso.`),
    fotoDeH2(dir, h1, ar ? '/img/2023/09/container-argentina.jpg' : heroes[i % heroes.length]),
    ...h(`Contenedores marítimos en ${n}`, fotos.general.src),
    t(`Si buscas un contenedor marítimo en ${n}, te asesoramos con el tamaño, el tipo y el estado que mejor se ajusten a tu uso: almacenaje, obra, ${link('/oficinas/', 'oficina')}, ${link('/locales-comerciales/', 'local')} o ${link('/casas/', 'vivienda')}.`),
    { type: 'heading', tag: 'p', text: '¿Tienes una consulta?' },
    { type: 'text', text: `Si estás pensando en obtener un contenedor marítimo en ${n} o realizar una construcción con containers, ponte en contacto y te informaremos de precios y disponibilidad`, html: `<p>Si estás pensando en obtener un contenedor marítimo en ${n} o realizar una construcción con containers, ponte en contacto y te informaremos de precios y disponibilidad</p>`, nuevo: true },
    { type: 'contact_form', form_id: '', text: '' },
    ...h(`Tipos de contenedores marítimos en ${n}`, '/img/2022/01/tipos-de-contenedores-maritimos.jpg'),
    t(`Estos son los tipos de contenedores marítimos que puedes pedir para ${n}, nuevos y de segunda mano. Elige uno para ver sus medidas y sus usos.`),
    ...tipos,
    { type: 'button', text: 'Todos los modelos de contenedores', href: `${dominio}/tipos/` },
    ...h(`Precios de contenedores marítimos en ${n}`, PRECIOS),
    ar
      // Precios en dólares: las mismas cifras orientativas que ya dan las demás páginas de Argentina de la web.
      ? t(`El precio de un contenedor marítimo en ${n} depende del tamaño, de si es nuevo o usado y del flete. Como referencia, un contenedor de 20 pies usado ronda entre 1000 y 2500 dólares y uno de 40 pies usado entre 1500 y 3500 dólares; nuevos, de 1500 a 3000 dólares el de 20 pies y de 1700 a 4000 dólares el de 40 pies. Pide presupuesto con la dirección de entrega para tener el precio cerrado.`)
      : t(`El precio de un contenedor marítimo en ${n} depende del tamaño, de si es nuevo o usado y del transporte. Mira la ${link('/precios/', 'tabla de precios orientativos')} y pide presupuesto con la dirección de entrega para tener el precio cerrado.`),
    { type: 'button', text: 'Precios', href: `${dominio}/precios/` },
    ...h(`Medidas de contenedores marítimos en ${n}`, fotos.medidas.src, fotos.medidas.ajuste),
    t(`Los contenedores de 20 y 40 pies son los más habituales en ${n}; hay también de 10 y 45 pies. Consulta la ${link('/medidas/', 'tabla de medidas')} para elegir el tamaño que cabe en tu terreno.`),
    { type: 'button', text: 'Medidas', href: `${dominio}/medidas/` },
    ...h(`Venta de contenedores marítimos en ${n}`, fotos.venta.src),
    t(`Vendemos contenedores marítimos nuevos y de segunda mano para ${n}. Si tienes un contenedor y quieres venderlo, ${link('/venta/', 'contacta con nosotros')}.`),
    { type: 'button', text: 'Venta', href: `${dominio}/venta/` },
    ...h(`Contenedores marítimos de segunda mano en ${n}`, fotos.segunda.src),
    t(`Un contenedor de segunda mano es la opción más económica. Antes de comprarlo, lee ${link('/que-revisar-contenedor-usado/', 'qué revisar en un contenedor usado')} y mira los ${link('/segunda-mano/', 'contenedores de segunda mano')}.`),
    { type: 'button', text: 'Segunda mano', href: `${dominio}/segunda-mano/` },
    ...h(`Construcciones con contenedores en ${n}`, fotos.construcc.src),
    t(`Con contenedores marítimos se construyen casas, oficinas y locales. Mira nuestras ${link('/construcciones-con-contenedores/', 'construcciones con contenedores')} y los ${link('/servicios-contenedores-maritimos/', 'servicios de acondicionamiento')}.`),
    { type: 'button', text: 'Construcción', href: `${dominio}/construcciones-con-contenedores/` },
    ...h(`Comprar contenedor marítimo en ${n}, presupuestos`, fotos.comprar.src),
    t(`¿Quieres comprar un contenedor marítimo en ${n}? Contáctanos y te asesoramos con precios, modelos, disponibilidad y transporte.`),
    { type: 'button', text: 'Presupuesto', href: `${dominio}/contacto/` },
    ...h(`Transporte de contenedores marítimos a ${n}`, fotos.transporte.src),
    t(`Transportamos contenedores marítimos hasta ${n}, tanto si compras el contenedor aquí como si ya tienes uno. Indica la dirección y el acceso para darte el precio completo.`),
    { type: 'button', text: 'Transporte', href: `${dominio}/transporte/` },
    ...h(`Alquiler de contenedores marítimos en ${n}`, fotos.alquiler.src),
    t(`Alquila un contenedor marítimo en ${n} para eventos, almacenaje u obras. Mira los ${link('/contenedores-para-almacenaje/', 'contenedores para almacenaje')} y los ${link('/contenedores-para-construccion/', 'contenedores para obras')}.`),
    { type: 'button', text: 'Alquiler', href: `${dominio}/alquiler/` },
  ];
  const titulo = `Contenedores marítimos en ${n}${u.extra ? ` (${u.extra})` : ar ? ' (Argentina)' : ''} | Venta, alquiler y transporte`;
  fs.writeFileSync(`src/content/pages/${u.slug}.json`, JSON.stringify({
    slug: u.slug, title: titulo, url: `${dominio}${ruta}`,
    meta_description: `Contenedores marítimos en ${n}: venta, alquiler y transporte de contenedores nuevos y de segunda mano. Medidas, precios orientativos y presupuesto sin compromiso.`,
    menu: ar ? 'argentina' : 'contenedores-maritimos', nueva: true, ciudad: true, blocks,
  }, null, 1) + '\n');
}

// Página con todas las ubicaciones (enlazado interno hacia todas las ciudades).
const todas = fs.readdirSync('src/content/pages').map((f) => JSON.parse(fs.readFileSync(`src/content/pages/${f}`, 'utf8')));
const ciudadesPag = todas.filter((p) => !p.servicio && !p.guia && (p.ciudad || (!p.nueva && JSON.parse(fs.readFileSync('src/data/ciudades.json', 'utf8'))[p.slug])));
const limpio = (p) => p.title.replace(/^(Contenedores marítimos en |Contenedores (Mar[ií]timos )?|Container )/i, '').replace(/ \(.*$| \|.*$| container$/i, '').trim();
const lista = (arr) => arr.sort((x, y) => limpio(x).localeCompare(limpio(y), 'es')).map((p) => `<a href="${new URL(p.url).pathname}">${limpio(p)}</a>`).join('<br>');
const es = ciudadesPag.filter((p) => p.menu !== 'argentina'), ar = ciudadesPag.filter((p) => p.menu === 'argentina');
const dirU = '/img/ubicaciones/todas'; carpetas.push(dirU);
const h1U = 'Ubicaciones: contenedores marítimos en España y Argentina';
fs.writeFileSync('src/content/pages/ubicaciones.json', JSON.stringify({
  slug: 'ubicaciones', title: 'Ubicaciones: contenedores marítimos en España y Argentina', url: `${dominio}/ubicaciones/`,
  meta_description: 'Todas las ubicaciones donde ofrecemos contenedores marítimos: ciudades y provincias de España y Argentina. Venta, alquiler y transporte.',
  menu: 'contenedores-maritimos', nueva: true, guia: false,
  blocks: [
    { type: 'heading', tag: 'h1', text: h1U },
    { type: 'text', text: 'Elige tu ciudad o provincia.', html: '<p>Elige tu <strong>ciudad o provincia</strong> para ver información de <strong>contenedores marítimos</strong>: venta, alquiler, transporte y servicios.</p>', nuevo: true },
    fotoDeH2(dirU, h1U, fotos.general.src),
    { type: 'heading', tag: 'h2', text: 'Contenedores marítimos en España' }, fotoDeH2(dirU, 'Contenedores marítimos en España', fotos.venta.src),
    { type: 'text', text: '', html: `<p>${lista(es)}</p>`, nuevo: true },
    { type: 'heading', tag: 'h2', text: 'Contenedores marítimos en Argentina' }, fotoDeH2(dirU, 'Contenedores marítimos en Argentina', '/img/2023/09/container-argentina.jpg'),
    { type: 'text', text: '', html: `<p>${lista(ar)}</p>`, nuevo: true },
  ],
}, null, 1) + '\n');
const n = await ejecutar(carpetas);
console.log(`Ubicaciones nuevas: ${ubicaciones.length}; en /ubicaciones/: ${es.length} de España y ${ar.length} de Argentina; ${n} fotos con nombre propio`);
