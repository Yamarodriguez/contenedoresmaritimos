// Resúmenes «En resumen» (respuesta corta al principio, para Google y las IA) y
// tablas de medidas / fichas técnicas, desde src/data/fichas.json.
import fichas from '../data/fichas.json';
import type { Bloque } from './agrupar';

type Cont = { nombre: string; ext: number[]; int: number[]; puerta: number[]; volumen: number; tara: number; carga: number; bruto: number };
const conts = fichas.contenedores as Record<string, Cont>;
type TablaLibre = { h2: string; cabecera: string[]; filas: string[][]; nota: string };
const paginas = fichas.paginas as Record<string, { resumen?: string; tabla?: { h2: string; tipos: string[] }; tablaPrecios?: TablaLibre }>;

const m = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const dims = (d: number[]) => d.map(m).join(' × ') + ' m';
const kg = (n: number) => `≈ ${n.toLocaleString('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions)} kg`;
const m3 = (n: number) => `${n.toLocaleString('es-ES', { minimumFractionDigits: 1 })} m³`;
const NOTA = 'Valores habituales según la norma ISO; las medidas y los pesos exactos varían según el fabricante y el año de construcción. Medidas en largo × ancho × alto.';

export function resumenDe(slug: string): string | undefined {
  return paginas[slug]?.resumen;
}

// Sección con la tabla: maestra (varias filas, una por contenedor) o ficha (una
// columna por contenedor, una fila por característica).
export function tablaDe(slug: string): { h2: string; bloque: Bloque } | undefined {
  const libre = paginas[slug]?.tablaPrecios;
  if (libre) return { h2: libre.h2, bloque: { type: 'tabla', nuevo: true, cabecera: libre.cabecera, filas: libre.filas, nota: libre.nota } };
  const t = paginas[slug]?.tabla;
  if (!t) return undefined;
  const lista = t.tipos.map((k) => conts[k]).filter(Boolean);
  if (lista.length > 2) {
    return {
      h2: t.h2,
      bloque: {
        type: 'tabla', nuevo: true, nota: NOTA,
        cabecera: ['Contenedor', 'Exterior', 'Interior', 'Volumen', 'Tara', 'Carga máxima'],
        filas: lista.map((c) => [c.nombre, dims(c.ext), dims(c.int), m3(c.volumen), kg(c.tara), kg(c.carga)]),
      },
    };
  }
  const filas: [string, (c: Cont) => string][] = [
    ['Medidas exteriores', (c) => dims(c.ext)],
    ['Medidas interiores', (c) => dims(c.int)],
    ['Puerta (ancho × alto)', (c) => dims(c.puerta)],
    ['Volumen interior', (c) => m3(c.volumen)],
    ['Tara (peso en vacío)', (c) => kg(c.tara)],
    ['Carga máxima', (c) => kg(c.carga)],
    ['Peso bruto máximo', (c) => kg(c.bruto)],
  ];
  return {
    h2: t.h2,
    bloque: {
      type: 'tabla', nuevo: true, nota: NOTA,
      cabecera: ['Característica', ...lista.map((c) => c.nombre)],
      filas: filas.map(([n, f]) => [n, ...lista.map(f)]),
    },
  };
}
