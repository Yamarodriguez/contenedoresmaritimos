// Crea los tipos de contenedor nuevos de src/data/tipos-nuevos.json:
//  - una ilustración SVG propia por tipo (proporcional a su largo en pies),
//  - una página por tipo en src/content/pages/.
// Las tarjetas en la rejilla de «Tipos» las añade el código al pintar
// (src/lib/pagina.ts), no se tocan los JSON del resto de páginas.
import fs from 'node:fs';
import { crearFotos, negritas, palabrasClave } from './lib-contenido.mjs';

const datos = JSON.parse(fs.readFileSync('src/data/tipos-nuevos.json', 'utf8'));
const dominio = 'https://contenedoresmaritimos.net';
const { fotoDeH2, ejecutar } = crearFotos();
const fotos = JSON.parse(fs.readFileSync('src/data/fotos-seccion.json', 'utf8'));

function svg(pies) {
  // Mismo estilo que el logo: contenedor amarillo con costillas, sobre fondo azul claro.
  const largo = Math.round(70 + pies * 5.2);           // 10 pies ≈ 122, 45 pies ≈ 304
  const x = Math.round((400 - largo - 38) / 2), y = 120, alto = 92, prof = 38;
  const costillas = [];
  for (let cx = x + 12; cx < x + largo - 8; cx += 14) costillas.push(`<line x1="${cx}" y1="${y + 10}" x2="${cx}" y2="${y + alto - 10}"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="Contenedor de ${pies} pies">
  <rect width="400" height="300" fill="#eaf1f8"/>
  <rect y="238" width="400" height="62" fill="#d8e2ec"/>
  <ellipse cx="${x + (largo + prof) / 2}" cy="244" rx="${(largo + prof) / 2 + 12}" ry="9" fill="#0b2a4a" opacity="0.12"/>
  <polygon points="${x},${y} ${x + prof},${y - prof} ${x + largo + prof},${y - prof} ${x + largo},${y}" fill="#ffe27a"/>
  <polygon points="${x + largo},${y} ${x + largo + prof},${y - prof} ${x + largo + prof},${y + alto - prof} ${x + largo},${y + alto}" fill="#c99a00"/>
  <rect x="${x}" y="${y}" width="${largo}" height="${alto}" rx="2" fill="#f2c200"/>
  <g stroke="#c99a00" stroke-width="2.4" stroke-linecap="round">${costillas.join('')}</g>
  <rect x="${x}" y="${y}" width="${largo}" height="${alto}" rx="2" fill="none" stroke="#0b2a4a" stroke-width="3"/>
  <text x="200" y="272" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#0b2a4a">${pies} pies</text>
</svg>
`;
}

fs.mkdirSync('public/img/tipos', { recursive: true });
for (const t of datos.tipos) {
  fs.writeFileSync(`public/img/tipos/${t.slug}.svg`, svg(t.pies));
  const nombre = t.nombre;
  const base = [nombre.toLowerCase(), `contenedor de ${t.pies} pies`, 'contenedores marítimos', 'contenedor marítimo'];
  const parr = (txt, h2) => { const html = negritas(txt, [...base, ...(h2 ? palabrasClave(h2) : [])]); return { type: 'text', text: html.replace(/<[^>]+>/g, ''), html: `<p>${html}</p>`, nuevo: true }; };
  const h2Med = `Medidas de los ${nombre.toLowerCase()}`;
  const h2Usos = `Usos de los ${nombre.toLowerCase()}`;
  const h2Comp = `Comprar o alquilar ${nombre.toLowerCase()}`;
  const blocks = [
    { type: 'heading', tag: 'h1', text: nombre },
    parr(`En esta página encontrarás las medidas y los usos de los ${nombre.toLowerCase()}. Si quieres comprar o alquilar uno, pide presupuesto y te asesoramos sin compromiso.`),
    { type: 'heading', tag: 'h2', text: h2Med },
    fotoDeH2(t.slug, h2Med, `/img/tipos/${t.slug}.svg`, 'contain'),
    parr(`Las medidas exteriores habituales de un contenedor de ${t.pies} pies son ${t.medidas}. Son medidas orientativas: pueden variar ligeramente según el fabricante.`, h2Med),
    { type: 'heading', tag: 'h2', text: h2Usos },
    fotoDeH2(t.slug, h2Usos, fotos.general.src),
    parr(t.usos, h2Usos),
    { type: 'heading', tag: 'h2', text: h2Comp },
    fotoDeH2(t.slug, h2Comp, fotos.comprar.src),
    parr('Consúltanos disponibilidad, precio y transporte hasta tu provincia. Mira también los precios y las medidas de todos los modelos.', h2Comp),
    { type: 'button', text: 'Pide presupuesto', href: `${dominio}/contacto/` },
    { type: 'button', text: 'Todos los tipos de contenedores', href: `${dominio}/tipos/` },
  ];
  const pagina = { slug: t.slug, title: nombre, url: `${dominio}/${t.slug}/`, meta_description: t.descripcion, menu: 'contenedores-maritimos', nueva: true, blocks };
  fs.writeFileSync(`src/content/pages/${t.slug}.json`, JSON.stringify(pagina, null, 1) + '\n');
}
const hechas = await ejecutar(datos.tipos.map((x) => x.slug));
console.log(`Tipos nuevos (${hechas} fotos con nombre propio): ${datos.tipos.map((t) => t.slug).join(', ')}`);
