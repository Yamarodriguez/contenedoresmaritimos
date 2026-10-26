// Medidas reales de cada imagen de public/img -> src/data/imagenes.json
// (así el navegador reserva el hueco justo y no hay saltos al cargar).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

function ficheros(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? ficheros(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const salida = {}; const fallos = [];
for (const f of ficheros('public/img')) {
  try {
    const m = await sharp(f).metadata();
    salida['/' + path.relative('public', f).split(path.sep).join('/')] = { w: m.width, h: m.height };
  } catch (e) { fallos.push(f); }
}
fs.writeFileSync('src/data/imagenes.json', JSON.stringify(salida, null, 1) + '\n');
console.log(`Medidas: ${Object.keys(salida).length} imágenes, ${fallos.length} sin poder medir`);
fallos.slice(0, 5).forEach((f) => console.log('  ' + f));
