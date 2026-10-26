// Para cada imagen de public/img (jpg/png):
//  - mide su tamaño real -> src/data/imagenes.json (el navegador reserva el hueco justo)
//  - genera versiones webp a 400 y 800 px de ancho (nunca más grandes que el original)
//    junto al fichero, con el sufijo -400.webp / -800.webp. El original se conserva
//    como src del <img> (Fase 6: webp con <picture>, manteniendo el src original).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ANCHOS = [400, 800];
function ficheros(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? ficheros(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const salida = {}; const fallos = []; let creadas = 0;
for (const f of ficheros('public/img')) {
  if (!/\.(jpe?g|png)$/i.test(f)) continue;
  try {
    const m = await sharp(f).metadata();
    const clave = '/' + path.relative('public', f).split(path.sep).join('/');
    const anchos = ANCHOS.filter((a) => a < m.width);
    if (!anchos.length || anchos[anchos.length - 1] < m.width * 0.9) anchos.push(m.width); // la última cubre el original
    const base = f.replace(/\.(jpe?g|png)$/i, '');
    const generadas = [];
    for (const a of anchos) {
      const destino = `${base}-${a}.webp`;
      if (!fs.existsSync(destino) || fs.statSync(destino).mtimeMs < fs.statSync(f).mtimeMs) {
        await sharp(f).resize({ width: a, withoutEnlargement: true }).webp({ quality: 80 }).toFile(destino);
        creadas++;
      }
      generadas.push(a);
    }
    salida[clave] = { w: m.width, h: m.height, ws: generadas };
  } catch (e) { fallos.push(f); }
}
fs.writeFileSync('src/data/imagenes.json', JSON.stringify(salida, null, 1) + '\n');
console.log(`Medidas: ${Object.keys(salida).length} imágenes, ${creadas} webp nuevos, ${fallos.length} sin poder medir`);
fallos.slice(0, 5).forEach((f) => console.log('  ' + f));
process.exit(fallos.length ? 1 : 0);
