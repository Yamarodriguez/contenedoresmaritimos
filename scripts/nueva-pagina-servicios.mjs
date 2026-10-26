// Crea las páginas de servicios a partir de los ficheros de datos:
//  - src/data/servicios.json          -> página resumen /servicios-contenedores-maritimos/
//  - src/data/servicios-paginas.json  -> una página por servicio (H1 = palabra clave,
//    H2 SEO, detalles en H3 y preguntas frecuentes con datos estructurados)
//  - una ilustración SVG propia por servicio en public/img/servicios/
// Para cambiar un texto o quitar un servicio se edita el JSON y se vuelve a ejecutar:
//   node scripts/nueva-pagina-servicios.mjs
// No se editan a mano los JSON de las páginas.
import fs from 'node:fs';

const hub = JSON.parse(fs.readFileSync('src/data/servicios.json', 'utf8'));
const { servicios } = JSON.parse(fs.readFileSync('src/data/servicios-paginas.json', 'utf8'));
const fotos = JSON.parse(fs.readFileSync('src/data/fotos-seccion.json', 'utf8'));
const dominio = 'https://contenedoresmaritimos.net';

// Quita las páginas de servicios que ya no estén en los datos.
for (const f of fs.readdirSync('src/content/pages')) {
  const p = JSON.parse(fs.readFileSync(`src/content/pages/${f}`, 'utf8'));
  if (p.servicio && !servicios.some((s) => s.slug === p.slug)) fs.unlinkSync(`src/content/pages/${f}`);
}

// ---- Ilustraciones (mismo estilo del logo: azul marino y amarillo) ----
const iconos = {
  'instalacion-electrica-contenedores-maritimos': '<polygon points="215,70 160,160 195,160 180,235 245,135 208,135" fill="#f2c200" stroke="#0b2a4a" stroke-width="5" stroke-linejoin="round"/>',
  'pintura-contenedores-maritimos': '<rect x="140" y="85" width="120" height="48" rx="8" fill="#f2c200" stroke="#0b2a4a" stroke-width="5"/><path d="M260 109 h24 v40 h-70 v30" fill="none" stroke="#0b2a4a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="198" y="179" width="32" height="56" rx="6" fill="#0b2a4a"/>',
  'aislamiento-contenedores-maritimos': '<rect x="130" y="90" width="140" height="110" rx="6" fill="#fff" stroke="#0b2a4a" stroke-width="5"/><g fill="none" stroke="#0b2a4a" stroke-width="5" stroke-linecap="round"><path d="M150 120 q12 -12 24 0 t24 0 t24 0 t24 0"/><path d="M150 150 q12 -12 24 0 t24 0 t24 0 t24 0"/><path d="M150 180 q12 -12 24 0 t24 0 t24 0 t24 0"/></g><rect x="130" y="90" width="140" height="18" fill="#f2c200" stroke="#0b2a4a" stroke-width="5"/>',
  'ventanas-puertas-contenedores-maritimos': '<rect x="130" y="75" width="140" height="150" rx="6" fill="#bfe0ff" stroke="#0b2a4a" stroke-width="6"/><line x1="200" y1="75" x2="200" y2="225" stroke="#0b2a4a" stroke-width="6"/><line x1="130" y1="150" x2="270" y2="150" stroke="#0b2a4a" stroke-width="6"/><circle cx="187" cy="150" r="5" fill="#f2c200" stroke="#0b2a4a" stroke-width="3"/><circle cx="213" cy="150" r="5" fill="#f2c200" stroke="#0b2a4a" stroke-width="3"/>',
  'climatizacion-contenedores-maritimos': '<g stroke="#0b2a4a" stroke-width="6" stroke-linecap="round"><line x1="200" y1="70" x2="200" y2="230"/><line x1="131" y1="110" x2="269" y2="190"/><line x1="131" y1="190" x2="269" y2="110"/></g><g fill="#f2c200" stroke="#0b2a4a" stroke-width="4"><circle cx="200" cy="150" r="22"/></g><g stroke="#0b2a4a" stroke-width="5" stroke-linecap="round" fill="none"><path d="M185 82 l15 -12 l15 12"/><path d="M185 218 l15 12 l15 -12"/></g>',
  'fontaneria-contenedores-maritimos': '<path d="M200 70 C 200 70, 140 140, 140 180 a60 60 0 0 0 120 0 C 260 140, 200 70, 200 70 Z" fill="#bfe0ff" stroke="#0b2a4a" stroke-width="6" stroke-linejoin="round"/><path d="M170 185 a32 32 0 0 0 28 30" fill="none" stroke="#f2c200" stroke-width="7" stroke-linecap="round"/>',
  'soldadura-reparacion-contenedores-maritimos': '<g fill="#f2c200" stroke="#0b2a4a" stroke-width="5" stroke-linejoin="round"><polygon points="200,70 214,128 270,115 226,152 262,200 205,178 190,235 178,176 122,190 160,148 118,108 176,124"/></g><circle cx="200" cy="150" r="14" fill="#fff" stroke="#0b2a4a" stroke-width="4"/>',
  'cortes-aberturas-contenedores-maritimos': '<rect x="115" y="90" width="170" height="120" rx="6" fill="#f2c200" stroke="#0b2a4a" stroke-width="6"/><rect x="160" y="115" width="80" height="70" rx="4" fill="#eaf1f8" stroke="#0b2a4a" stroke-width="5" stroke-dasharray="12 8"/><path d="M250 225 l22 -22 m-22 0 l22 22" stroke="#0b2a4a" stroke-width="6" stroke-linecap="round"/>',
};
fs.mkdirSync('public/img/servicios', { recursive: true });
for (const s of servicios) {
  const icono = iconos[s.slug] ?? '';
  fs.writeFileSync(`public/img/servicios/${s.slug}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="${s.nombre}">
  <rect width="400" height="300" fill="#eaf1f8"/>
  <circle cx="200" cy="150" r="118" fill="#fff" stroke="#d8e2ec" stroke-width="4"/>
  ${icono}
</svg>
`);
}

const parr = (txt) => ({ type: 'text', text: txt.replace(/<[^>]+>/g, ''), html: `<p>${txt}</p>`, nuevo: true });
const boton = (texto, href) => ({ type: 'button', text: texto, href: `${dominio}${href}` });
const imagenFoto = (clave) => ({ type: 'image', src: fotos[clave].src, alt: fotos[clave].alt, ajuste: fotos[clave].ajuste, nuevo: true });

// ---- Página de cada servicio ----
const pregunta = {
  'ventanas-puertas-contenedores-maritimos': '¿Qué son las',
  'cortes-aberturas-contenedores-maritimos': '¿Qué son los',
  'aislamiento-contenedores-maritimos': '¿Qué es el',
};
const rotacion = ['construcc', 'segunda', 'venta', 'transporte', 'alquiler', 'comprar'];
for (const s of servicios) {
  let r = 0;
  const foto = () => imagenFoto(rotacion[r++ % rotacion.length]);
  const relacionados = servicios.filter((o) => o.slug !== s.slug)
    .map((o) => `<a href="/${o.slug}/">${o.nombre}</a>`).join(' · ');
  const blocks = [
    { type: 'heading', tag: 'h1', text: s.clave.charAt(0).toUpperCase() + s.clave.slice(1) },
    parr(s.intro),
    { type: 'heading', tag: 'h2', text: `${pregunta[s.slug] ?? '¿Qué es la'} ${s.clave}?` },
    { type: 'image', src: `/img/servicios/${s.slug}.svg`, alt: s.nombre, ajuste: 'contain', nuevo: true },
    parr(s.que_es),
    { type: 'heading', tag: 'h2', text: s.incluye_h2 },
    foto(),
    ...s.incluye.flatMap(([h3, t]) => [{ type: 'heading', tag: 'h3', text: h3 }, parr(t)]),
    { type: 'heading', tag: 'h2', text: s.usos_h2 },
    foto(),
    parr(s.usos),
    { type: 'heading', tag: 'h2', text: s.consideraciones_h2 },
    foto(),
    ...s.consideraciones.flatMap(([h3, t]) => [{ type: 'heading', tag: 'h3', text: h3 }, parr(t)]),
    { type: 'heading', tag: 'h2', text: `Preguntas frecuentes sobre ${s.clave}` },
    foto(),
    ...s.faq.flatMap(([q, a]) => [{ type: 'heading', tag: 'h3', text: q }, parr(a)]),
    { type: 'heading', tag: 'h2', text: `Pide presupuesto de ${s.clave}` },
    foto(),
    parr('Cuéntanos qué contenedor tienes o qué necesitas, en qué provincia está y qué servicio buscas. Te respondemos con un presupuesto sin compromiso.'),
    { type: 'button', text: 'Pide presupuesto', href: `${dominio}/contacto/` },
    { type: 'button', text: 'Todos los servicios', href: `${dominio}/${hub.slug}/` },
    parr(`<strong>Otros servicios:</strong> ${relacionados}`),
  ];
  const pagina = {
    slug: s.slug, title: s.titulo, url: `${dominio}/${s.slug}/`, meta_description: s.descripcion,
    menu: 'contenedores-maritimos', nueva: true, servicio: true,
    faq: s.faq.map(([pregunta, respuesta]) => ({ pregunta, respuesta })),
    blocks,
  };
  fs.writeFileSync(`src/content/pages/${s.slug}.json`, JSON.stringify(pagina, null, 1) + '\n');
}

// ---- Página resumen: cada servicio es un H3 con enlace a su página ----
const hubBlocks = [
  { type: 'heading', tag: 'h1', text: hub.h1 },
  parr(hub.entrada),
];
for (const seccion of hub.secciones) {
  hubBlocks.push({ type: 'heading', tag: 'h2', text: seccion.h2 });
  if (seccion.texto) hubBlocks.push(parr(seccion.texto));
  if (seccion.lista) {
    for (const s of servicios) {
      hubBlocks.push({ type: 'heading', tag: 'h3', text: s.clave.charAt(0).toUpperCase() + s.clave.slice(1) });
      hubBlocks.push(parr(`${s.resumen} <a href="/${s.slug}/">Más información sobre ${s.clave}</a>.`));
    }
  }
}
hubBlocks.push({ type: 'button', text: 'Pide presupuesto', href: `${dominio}/contacto/` });
fs.writeFileSync(`src/content/pages/${hub.slug}.json`, JSON.stringify({
  slug: hub.slug, title: hub.titulo, url: `${dominio}/${hub.slug}/`, meta_description: hub.descripcion,
  menu: 'contenedores-maritimos', nueva: true, blocks: hubBlocks,
}, null, 1) + '\n');
console.log(`Servicios: ${servicios.length} páginas + resumen (/${hub.slug}/)`);
