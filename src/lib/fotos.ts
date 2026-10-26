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
  bloques.forEach((b, i) => {
    salida.push(b);
    if (!(b.type === 'heading' && b.tag === 'h2')) return;
    const anterior = bloques[i - 1];
    if (anterior?.type === 'image') return; // la foto ya iba antes del titular
    // ¿hay una imagen en la propia sección (hasta el siguiente H2)?
    for (let j = i + 1; j < bloques.length; j++) {
      const s = bloques[j];
      if (s.type === 'heading' && s.tag === 'h2') break;
      if (s.type === 'image') return;
    }
    const f = fotoPara(b.text);
    salida.push({ type: 'image', src: f.src, alt: f.alt, ajuste: f.ajuste, nuevo: true });
  });
  return salida;
}
