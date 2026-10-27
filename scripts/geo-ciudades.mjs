// Datos geográficos de las páginas de ciudad, provincia o región, para añadirles
// información propia y verificable (sin tocar el texto original):
//  - provincia, comunidad autónoma o provincia argentina (OpenStreetMap / Nominatim),
//  - puerto comercial más cercano y su distancia en línea recta,
//  - otras páginas de la web cercanas (enlaces internos).
// Datos © colaboradores de OpenStreetMap (ODbL). Nominatim: 1 petición por segundo.
//   node scripts/geo-ciudades.mjs          (solo busca las que falten en la caché)
import fs from 'node:fs';

const CACHE = 'src/data/ciudades-osm.json';
const SALIDA = 'src/data/ciudades.json';
const NO_CIUDAD = new Set(['contenedores-maritimos', 'precios', 'medidas', 'venta', 'segunda-mano', 'construcciones-con-contenedores', 'comprar', 'transporte', 'alquiler', 'tipos', 'contacto', 'aviso-legal', 'politica-de-privacidad', 'politica-de-cookies', 'personalizar-cookies', 'casas', 'oficinas', 'sanitarios', 'locales-comerciales', 'de-20-pies', 'de-40-pies', 'open-top', 'flat-rack', 'high-cube', 'refrigerados', 'open-side', 'dry-van', 'cisternas', 'almacenamiento', 'ventilados']);
// Nombre con el que se busca (el original a veces está mal escrito o en castellano antiguo).
const BUSQUEDA = {
  majadahona: 'Majadahonda', villareal: 'Vila-real', guecho: 'Getxo', baracaldo: 'Barakaldo',
  'sardanola-del-valles': 'Cerdanyola del Vallès', 'san-baudilio-de-llobregat': 'Sant Boi de Llobregat',
  'villanueva-y-geltru': 'Vilanova i la Geltrú', compostela: 'Santiago de Compostela', gerona: 'Girona',
  orense: 'Ourense', 'container-valencia': 'Valencia', 'contenedores-alcoy': 'Alcoy', 'mollet-del-valles': 'Mollet del Vallès',
  calvia: 'Calvià', benalmadena: 'Benalmádena', 'la-coruna': 'A Coruña', cataluna: 'Cataluña', parana: 'Paraná, Entre Ríos',
  'rio-grande': 'Río Grande, Tierra del Fuego', 'santa-cruz': 'Provincia de Santa Cruz', 'san-juan': 'San Juan',
  'contenedores-granadilla-de-abona': 'Granadilla de Abona', alava: 'Álava', bizkaia: 'Bizkaia', gipuzkoa: 'Gipuzkoa',
  'la-rioja': 'La Rioja, España', mallorca: 'Mallorca', ibiza: 'Ibiza', tenerife: 'Tenerife', canarias: 'Canarias',
  argentina: 'Argentina', 'la-pampa': 'Provincia de La Pampa', catamarca: 'Provincia de Catamarca', formosa: 'Formosa, Argentina',
  tucuman: 'San Miguel de Tucumán', 'ramos-mejia': 'Ramos Mejía', neuquen: 'Neuquén', 'san-luis': 'San Luis, Argentina',
  'santa-fe': 'Santa Fe, Argentina', bariloche: 'San Carlos de Bariloche', 'mar-del-plata': 'Mar del Plata',
};

// Puertos comerciales (coordenadas aproximadas del recinto portuario).
const PUERTOS = {
  es: [['Algeciras', 36.13, -5.44], ['Valencia', 39.44, -0.32], ['Barcelona', 41.35, 2.16], ['Bilbao', 43.35, -3.05], ['Las Palmas', 28.14, -15.41], ['Santa Cruz de Tenerife', 28.47, -16.24], ['Vigo', 42.24, -8.73], ['Cartagena', 37.58, -0.98], ['Castellón', 39.97, -0.02], ['Tarragona', 41.10, 1.23], ['Málaga', 36.71, -4.42], ['Sevilla', 37.35, -5.99, 'rio'], ['Huelva', 37.20, -6.93], ['A Coruña', 43.36, -8.39], ['Ferrol', 43.47, -8.24], ['Marín', 42.39, -8.70], ['Gijón', 43.56, -5.70], ['Avilés', 43.57, -5.93], ['Santander', 43.44, -3.80], ['Pasaia', 43.32, -1.92], ['Alicante', 38.33, -0.49], ['Almería', 36.83, -2.46], ['Motril', 36.72, -3.52], ['Palma', 39.56, 2.63], ['Ibiza', 38.91, 1.44], ['Cádiz', 36.53, -6.29], ['Arrecife', 28.96, -13.54], ['Ceuta', 35.89, -5.31], ['Melilla', 35.29, -2.93], ['Sagunto', 39.64, -0.21]],
  ar: [['Buenos Aires', -34.58, -58.37, 'rio'], ['Rosario', -32.94, -60.63, 'rio'], ['Zárate', -34.10, -59.03, 'rio'], ['Bahía Blanca', -38.79, -62.27], ['Quequén', -38.57, -58.70], ['Mar del Plata', -38.04, -57.53], ['San Antonio Este', -40.80, -64.88], ['Puerto Madryn', -42.77, -65.03], ['Ushuaia', -54.81, -68.30], ['Santa Fe', -31.65, -60.70, 'rio']],
};

// Las páginas nuevas se llaman como en su H1 (no como en OpenStreetMap: Onteniente, Castro-Urdiales…).
const nom = (slug, def) => JSON.parse(fs.readFileSync('src/data/ciudades-nuevas.json', 'utf8')).ubicaciones.find((u) => u.slug === slug)?.nombre ?? def.replace(/^Municipio de /, '');
const km = (a, b) => {
  const R = 6371, r = (x) => (x * Math.PI) / 180;
  const dLat = r(b[0] - a[0]), dLon = r(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const paginas = fs.readdirSync('src/content/pages').map((f) => JSON.parse(fs.readFileSync(`src/content/pages/${f}`, 'utf8')))
  .filter((p) => (!p.nueva || p.ciudad) && !NO_CIUDAD.has(p.slug));
const nuevas = JSON.parse(fs.readFileSync('src/data/ciudades-nuevas.json', 'utf8')).ubicaciones;
for (const u of nuevas) BUSQUEDA[u.slug] = u.busqueda;

for (const p of paginas) {
  if (cache[p.slug]) continue;
  const pais = p.menu === 'argentina' ? 'ar' : 'es';
  const nombre = BUSQUEDA[p.slug] ?? p.title.replace(/^(Contenedores (Mar[ií]timos )?|Container )/i, '').replace(/ container$/i, '').trim();
  const man = nuevas.find((u) => u.slug === p.slug)?.manual;
  if (man) {
    cache[p.slug] = { busqueda: nombre, pais, lat: man.lat, lon: man.lon, tipo: man.tipo, nombre: nuevas.find((u) => u.slug === p.slug).nombre, direccion: { province: man.provincia, state: man.comunidad } };
    fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1) + '\n');
    continue;
  }
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&accept-language=es&countrycodes=${pais}&q=${encodeURIComponent(nombre)}`;
  const r = await fetch(url, { headers: { 'User-Agent': 'contenedoresmaritimos.net-migracion/1.0' } });
  const j = await r.json();
  cache[p.slug] = j[0] ? { busqueda: nombre, pais, lat: +j[0].lat, lon: +j[0].lon, tipo: j[0].addresstype, nombre: j[0].name, direccion: j[0].address } : { busqueda: nombre, pais, error: 'sin resultado' };
  console.log(p.slug, '→', cache[p.slug].nombre ?? 'SIN RESULTADO', cache[p.slug].tipo ?? '');
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1) + '\n');
  await pausa(2000);
}

// Datos finales por página.
const salida = { _nota: 'Generado por scripts/geo-ciudades.mjs. Datos geográficos © colaboradores de OpenStreetMap (ODbL). Distancias en línea recta, redondeadas.' };
const conGeo = paginas.filter((p) => cache[p.slug]?.lat);
for (const p of conGeo) {
  const c = cache[p.slug];
  const a = c.direccion ?? {};
  const punto = [c.lat, c.lon];
  const puerto = PUERTOS[c.pais].map(([n, la, lo, rio]) => ({ nombre: n, km: km(punto, [la, lo]), mar: rio !== 'rio' })).sort((x, y) => x.km - y.km)[0];
  // Ciudades: las 4 páginas de ciudad más próximas. Provincias y regiones: las
  // ciudades de la web que están dentro de ellas.
  const ZONA = new Set(['state', 'state_district', 'province', 'island', 'archipelago', 'country', 'region']);
  const manual = nuevas.find((u) => u.slug === p.slug)?.manual;
  const esZona = ZONA.has(c.tipo);
  const cercanas = conGeo
    .filter((o) => o.slug !== p.slug && cache[o.slug].pais === c.pais && !ZONA.has(cache[o.slug].tipo) && cache[o.slug].nombre !== c.nombre)
    .filter((o) => !esZona || [cache[o.slug].direccion?.province, cache[o.slug].direccion?.state, cache[o.slug].direccion?.island].includes(c.nombre))
    .map((o) => ({ slug: o.slug, nombre: nom(o.slug, cache[o.slug].nombre), km: Math.round(km(punto, [cache[o.slug].lat, cache[o.slug].lon])) }))
    .filter((o) => esZona || o.km > 2)
    .sort((x, y) => x.km - y.km)
    .filter((o, i, arr) => arr.findIndex((z) => z.nombre === o.nombre) === i)
    .slice(0, esZona ? 6 : 8);
  if (manual?.cercanas) { cercanas.length = 0; for (const sl of manual.cercanas) if (cache[sl]?.lat) cercanas.push({ slug: sl, nombre: nom(sl, cache[sl].nombre), km: Math.round(km(punto, [cache[sl].lat, cache[sl].lon])) }); }
  salida[p.slug] = {
    nombre: nom(p.slug, c.nombre.replace(/^Municipio de /, '')), tipo: c.tipo === 'state_district' ? 'province' : c.tipo, pais: c.pais,
    provincia: a.province ?? (c.pais === 'ar' ? a.state : undefined),
    comunidad: c.pais === 'es' ? a.state : undefined,
    puerto: { nombre: puerto.nombre, km: Math.max(5, Math.round(puerto.km / 5) * 5), mar: puerto.mar },
    cercanas, esZona,
  };
  if (esZona) {
    const ps = cercanas.map((o) => PUERTOS[c.pais].map(([n, la, lo]) => ({ n, d: km([cache[o.slug].lat, cache[o.slug].lon], [la, lo]) })).sort((x, y) => x.d - y.d)[0]).filter((x) => x.d <= 60).map((x) => x.n);
    salida[p.slug].puertosZona = [...new Set(ps)].slice(0, 4);
  }
}
fs.writeFileSync(SALIDA, JSON.stringify(salida, null, 1) + '\n');
console.log(`Ciudades con datos: ${conGeo.length} de ${paginas.length}`);
const sin = paginas.filter((p) => !cache[p.slug]?.lat).map((p) => p.slug);
if (sin.length) console.log('Sin resultado:', sin.join(', '));
