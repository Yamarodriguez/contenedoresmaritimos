// Utilidades comunes de los generadores de páginas nuevas (servicios, tipos):
//  - nombres de foto sacados del H2 y copia reducida con ese nombre,
//  - negritas en las palabras clave relacionadas con el H2.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

export const sinSigno = (t) => t.replace(/[¿?¡!]/g, '').trim();

export function slugify(t, max = 80) {
  let s = t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (s.length > max) s = s.slice(0, max).replace(/-[^-]*$/, '');
  return s;
}

// Fotos: cada H2 recibe una copia de su foto con un nombre propio y un alt descriptivo.
export function crearFotos() {
  const trabajos = [];
  return {
    fotoDeH2(carpeta, h2, origen, ajuste) {
      const esSvg = origen.endsWith('.svg');
      const base = carpeta.startsWith('/') ? carpeta : `/img/servicios/${carpeta}`;
      const destino = `${base}/${slugify(h2)}.${esSvg ? 'svg' : 'jpg'}`;
      trabajos.push({ de: `public${origen}`, a: `public${destino}`, esSvg });
      return { type: 'image', src: destino, alt: sinSigno(h2), ajuste, nuevo: true };
    },
    async ejecutar(carpetasALimpiar = []) {
      for (const c of carpetasALimpiar) fs.rmSync(c.startsWith('/') ? `public${c}` : `public/img/servicios/${c}`, { recursive: true, force: true });
      for (const t of trabajos) {
        fs.mkdirSync(path.dirname(t.a), { recursive: true });
        if (t.esSvg) fs.copyFileSync(t.de, t.a);
        else await sharp(t.de).resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 80 }).toFile(t.a);
      }
      return trabajos.length;
    },
  };
}

// Negritas: envuelve en <strong> la primera aparición de cada término en el texto
// (sin tocar enlaces ni etiquetas existentes). Los términos más largos van primero.
const PARADA = new Set('de la el los las un una unos unas en para que qué y o a se con por sobre antes uso usos tener cuenta cuándo cuando dónde donde cómo como del al es son hay más mas su sus lo tu tus'.split(' '));
export function palabrasClave(h2, extra = []) {
  const palabras = sinSigno(h2).toLowerCase().split(/\s+/)
    .filter((p) => p.length >= 6 && !PARADA.has(p) && !/^contenedor/.test(p) && !/^mar[ií]tim/.test(p));
  return [...new Set([...extra, ...palabras])];
}
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function negritas(html, terminos) {
  const lista = [...new Set(terminos.filter(Boolean))].sort((a, b) => b.length - a.length);
  const hechos = new Set();
  const partes = html.split(/(<[^>]+>)/);
  let enlace = 0, fuerte = 0;
  return partes.map((p) => {
    if (p.startsWith('<')) {
      if (/^<a[\s>]/i.test(p)) enlace++; else if (/^<\/a>/i.test(p)) enlace--;
      if (/^<(strong|b)[\s>]/i.test(p)) fuerte++; else if (/^<\/(strong|b)>/i.test(p)) fuerte--;
      return p;
    }
    if (enlace > 0 || fuerte > 0) return p;
    let t = p;
    for (const term of lista) {
      if (hechos.has(term)) continue;
      const re = new RegExp(`(^|[^\\p{L}])(${esc(term)})(?![\\p{L}])`, 'iu');
      // solo fuera de lo ya puesto en negrita (evita <strong> dentro de <strong>)
      const trozos = t.split(/(<strong>[\s\S]*?<\/strong>)/);
      for (let i = 0; i < trozos.length; i += 2) {
        if (re.test(trozos[i])) { trozos[i] = trozos[i].replace(re, (m, a, b) => `${a}<strong>${b}</strong>`); hechos.add(term); break; }
      }
      t = trozos.join('');
    }
    return t;
  }).join('');
}
