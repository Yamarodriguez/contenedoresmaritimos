// Agrupa bloques seguidos para pintarlos: las parejas "titular h3 + foto enlazada"
// (las tarjetas de tipos de contenedor) pasan a una rejilla; el resto sigue en su
// orden. El orden del HTML no cambia.
export type Bloque = Record<string, any>;
export type Trozo =
  | { tipo: 'bloque'; bloque: Bloque }
  | { tipo: 'rejilla'; tarjetas: { titular: Bloque; imagen: Bloque }[] };

const esTitularTarjeta = (b?: Bloque) => b?.type === 'heading' && b.tag === 'h3' && b.href;
const esFotoTarjeta = (b?: Bloque) => b?.type === 'image' && b.href;

export function agrupar(bloques: Bloque[]): Trozo[] {
  const salida: Trozo[] = [];
  let i = 0;
  while (i < bloques.length) {
    const tarjetas: { titular: Bloque; imagen: Bloque }[] = [];
    let j = i;
    while (esTitularTarjeta(bloques[j]) && esFotoTarjeta(bloques[j + 1])) {
      tarjetas.push({ titular: bloques[j], imagen: bloques[j + 1] });
      j += 2;
    }
    if (tarjetas.length >= 3) {
      salida.push({ tipo: 'rejilla', tarjetas });
      i = j;
    } else {
      salida.push({ tipo: 'bloque', bloque: bloques[i] });
      i++;
    }
  }
  return salida;
}
