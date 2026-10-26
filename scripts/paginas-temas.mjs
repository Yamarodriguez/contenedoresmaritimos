// Crea las páginas temáticas nuevas (almacenaje, construcción y obras) desde
// src/data/paginas-temas.json, con fotos con nombre del H2, negritas en las palabras
// clave, tabla de volumen (de fichas.json) y preguntas frecuentes con datos estructurados.
//   node scripts/paginas-temas.mjs
// No se editan a mano los JSON de las páginas.
import fs from 'node:fs';
import { crearFotos, negritas, palabrasClave } from './lib-contenido.mjs';

const { paginas } = JSON.parse(fs.readFileSync('src/data/paginas-temas.json', 'utf8'));
const { contenedores } = JSON.parse(fs.readFileSync('src/data/fichas.json', 'utf8'));
const dominio = 'https://contenedoresmaritimos.net';
const { fotoDeH2, ejecutar } = crearFotos();

const num = (n, d) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });
const tabla = (tipos) => ({
  type: 'tabla', nuevo: true,
  nota: 'Valores habituales según la norma ISO; varían según el fabricante. Medidas interiores en largo × ancho × alto.',
  cabecera: ['Contenedor', 'Medidas interiores', 'Volumen interior'],
  filas: tipos.map((k) => contenedores[k]).map((c) => [c.nombre, c.int.map((x) => num(x, 3)).join(' × ') + ' m', `${num(c.volumen, 1)} m³`]),
});

for (const p of paginas) {
  const parr = (txt, h2) => { const html = negritas(txt, palabrasClave(h2 ?? p.h1, p.clave)); return { type: 'text', text: html.replace(/<[^>]+>/g, ''), html: `<p>${html}</p>`, nuevo: true }; };
  const blocks = [
    { type: 'heading', tag: 'h1', text: p.h1 },
    parr(p.intro),
    fotoDeH2(p.slug, p.h1, p.foto_hero),
  ];
  for (const s of p.secciones) {
    blocks.push({ type: 'heading', tag: 'h2', text: s.h2 }, fotoDeH2(p.slug, s.h2, s.foto));
    if (s.texto) blocks.push(parr(s.texto, s.h2));
    if (s.tabla) blocks.push(tabla(s.tabla));
    if (s.despues) blocks.push(parr(s.despues, s.h2));
    for (const [h3, t] of s.lista ?? []) blocks.push({ type: 'heading', tag: 'h3', text: h3 }, parr(t, h3));
  }
  const h2Faq = `Preguntas frecuentes sobre ${p.h1.toLowerCase()}`;
  blocks.push({ type: 'heading', tag: 'h2', text: h2Faq }, fotoDeH2(p.slug, h2Faq, '/img/2022/01/comprar-contenedores-maritimos.jpg'));
  for (const [q, a] of p.faq) blocks.push({ type: 'heading', tag: 'h3', text: q }, parr(a, q));
  const h2Pres = `Pide presupuesto de ${p.h1.toLowerCase()}`;
  blocks.push(
    { type: 'heading', tag: 'h2', text: h2Pres }, fotoDeH2(p.slug, h2Pres, '/img/2022/01/Contenedores-maritimos-venta.jpg'),
    parr('Cuéntanos qué necesitas guardar o para qué obra es, en qué provincia y durante cuánto tiempo. Te respondemos con un presupuesto sin compromiso.', h2Pres),
    { type: 'button', text: 'Pide presupuesto', href: `${dominio}/contacto/` },
    { type: 'button', text: 'Ver precios orientativos', href: `${dominio}/precios/` },
  );
  fs.writeFileSync(`src/content/pages/${p.slug}.json`, JSON.stringify({
    slug: p.slug, title: p.titulo, url: `${dominio}/${p.slug}/`, meta_description: p.descripcion,
    menu: 'contenedores-maritimos', nueva: true,
    faq: p.faq.map(([pregunta, respuesta]) => ({ pregunta, respuesta })),
    blocks,
  }, null, 1) + '\n');
}
const n = await ejecutar(paginas.map((p) => p.slug));
console.log(`Páginas temáticas: ${paginas.map((p) => '/' + p.slug + '/').join(', ')} (${n} fotos con nombre propio)`);
