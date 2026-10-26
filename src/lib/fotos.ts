// Cada sección (H2) lleva una foto. Si el original ya trae una (justo antes del
// titular, o dentro de la sección, como las tarjetas de tipos), no se toca; si
// no, se añade la foto del tema, que sale de la propia página de servicio.
// Todo lo añadido va marcado con `nuevo: true` (C2 lo acepta).
import fotos from '../data/fotos-seccion.json';
import type { Bloque } from './agrupar';

const plano = (t = '') => t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

function fotoPara(titulo: string) {
  const t = plano(titulo);
  const f = fotos as Record<string, { src: string; alt: string; ajuste?: string }>;
  if (/segunda mano/.test(t)) return f.segunda;
  if (/medidas/.test(t)) return f.medidas;
  if (/construcc/.test(t)) return f.construcc;
  if (/comprar/.test(t)) return f.comprar;
  if (/transporte/.test(t)) return f.transporte;
  if (/alquiler/.test(t)) return f.alquiler;
  if (/\bventa\b/.test(t)) return f.venta;
  return f.general;
}

export function conFotosDeSeccion(bloques: Bloque[]): Bloque[] {
  const salida: Bloque[] = [];
  const esFoto = (b?: Bloque) => b?.type === 'image' && !b.href;
  for (let i = 0; i < bloques.length; i++) {
    const b = bloques[i];
    if (!(b.type === 'heading' && b.tag === 'h2')) { salida.push(b); continue; }
    if (esFoto(bloques[i + 1])) { salida.push(b); continue; } // la foto ya va detrás del titular
    const anterior = salida[salida.length - 1];
    if (esFoto(anterior)) { // la foto iba antes del titular: pasa a su banda
      salida.pop(); salida.push(b, anterior); continue;
    }
    const f = fotoPara(b.text);
    salida.push(b, { type: 'image', src: f.src, alt: f.alt, ajuste: f.ajuste, nuevo: true });
  }
  return salida;
}
