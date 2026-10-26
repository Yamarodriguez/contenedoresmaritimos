// Crea la página nueva «Servicios para contenedores marítimos» a partir de
// src/data/servicios.json (H2 optimizados para SEO; cada servicio, un H3).
// Para añadir o cambiar un servicio se edita servicios.json y se vuelve a ejecutar:
//   node scripts/nueva-pagina-servicios.mjs
// No se edita a mano el JSON de la página.
import fs from 'node:fs';

const datos = JSON.parse(fs.readFileSync('src/data/servicios.json', 'utf8'));
const dominio = 'https://contenedoresmaritimos.net';
const blocks = [
  { type: 'heading', tag: 'h1', text: datos.h1 },
  { type: 'text', text: datos.entrada, html: `<p>${datos.entrada}</p>`, nuevo: true },
];
for (const seccion of datos.secciones) {
  blocks.push({ type: 'heading', tag: 'h2', text: seccion.h2 });
  if (seccion.texto) blocks.push({ type: 'text', text: seccion.texto, html: `<p>${seccion.texto}</p>`, nuevo: true });
  for (const s of seccion.servicios ?? []) {
    blocks.push({ type: 'heading', tag: 'h3', text: s.h3 });
    blocks.push({ type: 'text', text: s.texto, html: `<p>${s.texto}</p>`, nuevo: true });
  }
}
blocks.push({ type: 'button', text: 'Pide presupuesto', href: `${dominio}/contacto/` });

const pagina = {
  slug: datos.slug,
  title: datos.titulo,
  url: `${dominio}/${datos.slug}/`,
  meta_description: datos.descripcion,
  menu: 'contenedores-maritimos',
  nueva: true,
  blocks,
};
fs.writeFileSync(`src/content/pages/${datos.slug}.json`, JSON.stringify(pagina, null, 1) + '\n');
console.log(`Página nueva: /${datos.slug}/ (${datos.secciones.reduce((n, s) => n + (s.servicios?.length ?? 0), 0)} servicios)`);
