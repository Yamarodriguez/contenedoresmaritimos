// Arma una página como la ve el visitante, a partir de la lista plana de bloques
// de Elementor. El orden del contenido no cambia; solo se agrupa:
//  - portada: la primera foto y el primer párrafo (antes del primer H2) pasan al héroe;
//  - cada H2 abre una sección (panel) con su foto y todo lo que le sigue;
//  - "¿Tienes una consulta?" + texto + formulario sale como bloque lateral aparte;
//  - las parejas "titular h3 + foto enlazada" (tipos de contenedor) forman una rejilla.
import { conFotosDeSeccion } from './fotos';
import { agrupar, type Bloque, type Trozo } from './agrupar';

export type Seccion = { tipo: 'seccion'; titular?: Bloque; imagen?: Bloque; cuerpo: Trozo[] };
export type Consulta = { tipo: 'consulta'; titular: Bloque; texto: Bloque; formulario: Bloque };
export type Elemento = Seccion | Consulta;
export type Pagina = { hero: { imagen?: Bloque; texto?: Bloque }; elementos: Elemento[]; conLateral: boolean };

const esH2 = (b?: Bloque) => b?.type === 'heading' && b.tag === 'h2';
const longitud = (t = '') => t.replace(/<[^>]+>/g, '').length;

export function armarPagina(bloques: Bloque[]): Pagina {
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
  return { hero, elementos, conLateral: elementos.some((e) => e.tipo === 'consulta') };
}
