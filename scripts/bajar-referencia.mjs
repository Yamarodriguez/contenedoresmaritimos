// Baja el HTML vivo de cada página a referencia/ (Fase 1, paso 2).
// Despacio a propósito: 2 hilos, 400 ms entre peticiones, reintentos, y se
// descarta lo que mida menos de 5.000 caracteres (WordPress da errores 500
// si se le pide deprisa). No sobrescribe una página buena con una mala.
import fs from 'node:fs';
import path from 'node:path';

const viva = JSON.parse(fs.readFileSync('estructura-viva.json', 'utf8'));
const paginas = Array.isArray(viva) ? viva : Object.values(viva);
const destino = 'referencia';
const MIN = 5000;
fs.mkdirSync(destino, { recursive: true });

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const slugDe = (url) => {
  const p = new URL(url).pathname.replace(/^\/|\/$/g, '');
  return p === '' ? 'index' : p.replace(/\//g, '__');
};

async function bajar(url) {
  for (let intento = 1; intento <= 4; intento++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (migracion)' } });
      const t = await r.text();
      if (r.ok && t.length >= MIN) return t;
    } catch {}
    await pausa(1500 * intento);
  }
  return null;
}

const cola = [...paginas];
const fallos = [];
let hechas = 0;
async function hilo() {
  while (cola.length) {
    const p = cola.shift();
    const fichero = path.join(destino, slugDe(p.url) + '.html');
    if (fs.existsSync(fichero) && fs.statSync(fichero).size >= MIN) { hechas++; continue; }
    const t = await bajar(p.url);
    if (t) fs.writeFileSync(fichero, t);
    else fallos.push(p.url);
    hechas++;
    if (hechas % 20 === 0) console.log(`${hechas}/${paginas.length}`);
    await pausa(400);
  }
}
await Promise.all([hilo(), hilo()]);
fs.mkdirSync('informes', { recursive: true });
fs.writeFileSync('informes/fallos-descarga.json', JSON.stringify(fallos, null, 1));
console.log(`Hecho. Páginas: ${paginas.length - fallos.length}/${paginas.length}. Fallos: ${fallos.length}`);
if (fallos.length) process.exit(1);
