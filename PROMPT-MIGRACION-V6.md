# Prompt para migrar una web de WordPress a Astro (versión 6)

**Qué cambia frente a la versión 5.** La v5 copiaba la web vieja píxel a píxel
(copia fiel) y después la rediseñaba. Era lo más seguro, pero también lo más
caro: el comparador de marcado, la geometría y la copia exacta del CSS de
Elementor se comían la mitad de las rondas.

La v6 parte directamente del **diseño terminado de casascontenedores.es**
(marcado propio, `kit/web-final/`) y lo **personaliza** para la web nueva:
otros colores, otras letras, otra cabecera y otro carácter, pero la misma
estructura probada. Lo que demuestra que no se pierde nada ya no es el
parecido visual, sino unas comprobaciones de **contenido** (mismo texto,
mismos títulos, mismos enlaces, mismas fotos, mismas URL), que son baratas y
salen a 0 o no salen.

Sale de dos migraciones con OceanWP + Elementor:

| Web | Páginas | Qué aportó |
|---|---|---|
| casascontenedores.es (sep. 2026) | 263 | El diseño base, SEO, formularios, velocidad, DNS sin perder el correo, auditoría |
| renders.studio | 145 | Contraste bien medido, método de rediseño con opciones, inventario de cabeceras |

Cada regla de aquí costó al menos una ronda de prueba y error.

---

## PARA TI, YAMA: cómo se usa

1. Crea una carpeta vacía para la web nueva (por ejemplo `Escritorio\midominio`).
2. Copia dentro el **contenido** del kit: este fichero, la carpeta `kit` y la
   carpeta `analisis`. Si lo descomprimes de un ZIP, Windows crea una
   subcarpeta: lo que va en tu carpeta es lo de **dentro** de esa subcarpeta.
3. Añade el export XML de WordPress y, si lo tienes, el de Search Console.
4. Si tienes el logo en buena calidad (SVG o PNG grande) y fotos propias,
   ponlas en una carpeta `marca/`.
5. Abre Claude Code en esa carpeta y pega el mensaje de abajo, rellenando lo
   que va entre corchetes.

Ten a mano lo de la sección 1 antes de empezar. **Cada dato que falta a mitad
de trabajo es una ronda perdida**, y las rondas son lo que gasta.

### El mensaje para la primera sesión

```
Quiero migrar [DOMINIO] (WordPress con [Elementor / Divi / otro], en vivo en
https://[DOMINIO]) a Astro en Netlify, conservando todas las URL y el
posicionamiento. Soy el propietario y no soy técnico: háblame en castellano
de España, de tú y sin jerga, y hazlo tú.

En esta carpeta tienes:
- PROMPT-MIGRACION-V6.md: el método. Lee las secciones 0, A, B y la Fase 0.
  El resto, cuando llegue su fase.
- kit/: las herramientas y la web terminada de casascontenedores (la base
  del diseño). No la leas entera: usa el mapa de la sección B2.
- analisis/: solo cuando el prompt te mande a ellos.
- [nombre].xml: el export de WordPress.
- [opcional] el export de Search Console. [opcional] marca/: logo y fotos.

Datos: AdSense [ca-pub-… / no], Analytics [G-… / no], WhatsApp [nº],
teléfono [nº], correo [@], horario [..], titular [nombre, NIF, dirección].
Dominio registrado en [OVH / otro]. Formularios con [Web3Forms + clave /
otro]. GitHub: [URL / "créalo tú"]. Netlify: [sitio / "todavía no hay"].
Precios y plazos reales: [pégalos / "te los paso en la fase 4"].

Diseño (ficha de marca, sección 1):
- A qué se dedica y a quién vende: [..]
- Cómo quiero que se sienta: [3 palabras: p. ej. cálido, artesano, fiable]
- Colores: [los del logo / estos: #.. #.. / "propónmelos"]
- Webs que me gustan y por qué: [URL — "me gusta X"]
- Lo que NO quiero: [..]

Decisiones: las de la sección 0 del prompt, salvo: [nada / lo que cambies].

Empieza por la FASE 0. No toques el motor ni el kit hasta que te confirme el
inventario.
```

### El mensaje para las sesiones siguientes

Una sesión por fase. Para empezar cada una basta con:

```
Lee CLAUDE.md y empieza la Fase [N].
```

---

## 0. DECISIONES (con su opción por defecto)

Si no dices otra cosa en el mensaje, se aplica la opción por defecto.

| Decisión | Qué significa para ti | Por defecto | Alternativa |
|---|---|---|---|
| **Dec. 1 — Dónde trabaja Claude** | Si Claude trabaja solo en tu ordenador | Claude Code: ejecuta, compila, comprueba y sube | Sin terminal: tú ejecutas ficheros de doble clic (Anexo 1) |
| **Dec. 2 — Quién sube a main** | Quién publica los cambios | Claude, cuando las comprobaciones salen bien | Tú: Claude te lo deja preparado |
| **Dec. 3 — Punto de partida** | Cómo se pasa la web vieja a la nueva | **Diseño base de casascontenedores personalizado**, con el contenido comprobado al 100 % | Copia fiel exacta y luego rediseño (método v5; más caro, solo si la web vieja tiene que quedar idéntica) |
| **Dec. 4 — Diseño** | Cómo se decide el aspecto | 2 o 3 direcciones en imagen sobre la misma página; eliges una y se prueba en una página antes de extenderla | Que Claude elija una y la aplique |
| **Dec. 5 — DNS** | Dónde se cambia la dirección del dominio | En tu registrador: el correo ni se toca | Pasar los DNS a Netlify, copiando antes todo lo del correo |
| **Dec. 6 — Ancho** | Cómo se ve en pantallas grandes | Caja centrada (como casascontenedores) | A todo lo ancho |
| **Dec. 7 — Lo específico de casascontenedores** | Ciudades, zonas, modelos por m², calculadora de hipoteca, catálogo | No se copia nada de eso salvo que tu web tenga algo equivalente y lo pidas | Reutilizar la pieza que digas |

---

## 1. LO QUE TIENES QUE TENER TÚ (antes de la primera sesión)

**Ficheros**
- [ ] Export XML de WordPress: Herramientas → Exportar → Todo el contenido. Si hay varios, déjalos todos.
- [ ] **La zona DNS completa, tal como está hoy** (captura o copia): MX, SPF, DKIM (`_domainkey`), SRV, autoconfig, autodiscover y TXT. Es lo más importante: sin ella, casascontenedores.es se quedó sin correo.
- [ ] Export de Search Console: Rendimiento → Páginas, últimos 12 meses.

**Ficha de marca** (es lo que hace que el diseño sea tuyo y no una copia; sin
ella Claude tiene que adivinar y se gastan rondas en "no me gusta")
- [ ] Logo en buena calidad. Si solo hay el de la web, vale, pero dilo.
- [ ] A qué te dedicas, a quién vendes y tres palabras de cómo quieres que se sienta la web.
- [ ] Colores, si los tienes. Si no, Claude los saca del logo.
- [ ] Dos o tres webs que te gusten (de cualquier sector) y qué te gusta de cada una.
- [ ] Fotos propias reales (obras, producto, equipo), si las hay. Valen más que cualquier diseño.

**Accesos** (que funcionen, no solo que existan)
- [ ] Registrador del dominio, hosting viejo, GitHub, Netlify, Search Console, Analytics, AdSense y el servicio de formularios (que envíe a un correo que funcione).
- [ ] El hosting viejo no se cancela hasta un mes después del cambio.

**Datos que solo sabes tú** (Claude no puede inventarlos)
- [ ] Precios y plazos reales, con o sin IVA.
- [ ] Servicios y zonas que cubres de verdad.
- [ ] Teléfono, WhatsApp, correo y horario.
- [ ] Datos legales del titular (nombre o razón social, NIF y dirección).
- [ ] Testimonios u obras reales que se puedan publicar.

---

## A. CÓMO TRABAJAMOS

### A1. Comprobar el entorno (lo primero de la Fase 0)

Claude lo comprueba y lo apunta en `informes/inventario.md`:

- este fichero, `kit/` y `analisis/` están en la raíz, no en una subcarpeta;
- Node 22.12 o más (`node --version`). Netlify compila con `NODE_VERSION = "22"`;
- Python 3 con beautifulsoup4 y lxml: `python -c "import bs4, lxml"` (en Windows es `python`, no `python3`);
- git, y `gh` con sesión si Claude va a crear el repositorio;
- un navegador para Playwright: `channel: 'chrome'` o `npx playwright install chromium`;
- que llega al dominio, con una petición de prueba.

Si no puede ejecutar comandos → Anexo 1. Si ejecuta pero no llega al dominio,
las descargas de la Fase 1 las lanza el propietario con ficheros `.cmd`
(Anexo 1) y el resto lo hace Claude.

### A2. El propietario y cómo se le habla

- **No es técnico.** Castellano de España, de tú, sin jerga y sin comandos que tenga que interpretar. El trabajo lo hace Claude.
- **Arreglado no es publicado.** Cada informe termina diciendo en qué estado está el cambio: solo en local / con commit sin subir / en una rama / en main y desplegado (comprobado pidiendo la URL). Lo que falta por subir: `git log origin/main..HEAD`.
- **Dile siempre dónde mirarlo**: la URL de la vista previa de Netlify o `npm run build` + `npm run preview`.

### A3. Las reglas de oro

1. **El contenido original no se toca**: ni un texto, ni un título, ni el nivel de un encabezado, ni un enlace, ni el orden. Única excepción: la regla del H1 aprobada en la Fase 0.
   - Si el propietario pide corregir contenido: regla en un fichero de datos + script que se pueda ejecutar dos veces sin estropear nada + pasada en seco (`--seco`) con recuento y 5 ejemplos + commit propio con "(pedido por el propietario)".
2. **El diseño es libre; el contenido, no.** Cambiar cómo se ve un bloque (colores, letras, tarjetas, espaciado) está permitido. Cambiar qué dice, en qué orden o a dónde enlaza, no.
3. **Lo nuevo se añade alrededor o al final**, desde ficheros de datos (`src/data/`) que el motor pinta al compilar.
4. **No se inventa ningún dato**: ni precios, ni plazos, ni normativa, ni testimonios, ni fotos de "obras" que no son suyas. Todo texto escrito por IA pasa una comprobación de hechos antes de publicarse.
5. **Las URL y las rutas de las fotos no cambian nunca** (están en Google y en Google Imágenes). La `<img src>` sigue apuntando a la foto original; la webp va en `<picture><source type="image/webp">…<img src="ORIGINAL"></picture>`.
6. **Los fallos del original se enseñan y se decide.** Ni se copian ni se arreglan en silencio. Una foto no se sustituye por otra "parecida" sin el visto bueno del propietario, apuntado.
7. **Desde la Fase 2, nada se da por bueno sin `npm run todo` a 0 fallos** (sección C), y desde la Fase 3 también `npm run todo:visual`.

### A4. Gastar menos (tokens y rondas)

Es la parte que más cambia el coste. Por orden de lo que más ahorra:

1. **No leer lo que no toca.** `kit/web-final/` se consulta por el mapa de la sección B2: se abre solo el fichero que se va a adaptar, y de los grandes (`render.js`, `diseno.css`, `global.css`, `[...slug].astro`) solo la parte que se busca, con grep. `analisis/` solo en las líneas que se indican. Nunca los documentos viejos (`GUIA-*`, `PROMPT-*` anteriores, `LEEME*`).
2. **`CLAUDE.md` desde el primer día** (plantilla en G1): lo que se decide se apunta allí y no se vuelve a preguntar ni a deducir. Se actualiza al cerrar cada fase.
3. **Una sesión por fase.** Las conversaciones largas se resumen solas y pierden detalle.
4. **Analizar primero, cambiar después, y preguntar todo junto.** "Analízalo sin tocar nada" → una lista numerada de decisiones → el propietario contesta todas en un solo mensaje ("el 1, el 3 y el 5").
5. **Informes a disco** (`informes/*.md`, fuera de Git). La consola enseña como mucho 30 líneas de resumen; después se busca en el informe con grep sin volver a ejecutar nada.
6. **Nada de listar carpetas enormes** (`public/`, `dist/`, `node_modules/`, `referencia/`, `kit/`): recuentos o patrones.
7. **Una pieza del motor se prueba en una página de cada tipo, no en todas.** Cuando las de muestra salen bien, se compila todo y se pasa `todo`.
8. **Capturas las hace Claude**, de las dos webs, lado a lado. El propietario solo dice qué página y qué ve mal.
9. **Reproducir antes de proponer**: medir o capturar el fallo, arreglar, comprobar que la misma medida da 0.
10. **Cambios masivos, primero en seco** (`aplicar-ampliacion.mjs`, `corregir-erratas.mjs`, `botones-descriptivos.mjs` traen `--seco`; `descargar-fuentes.mjs`, `--ensayo`).
11. **Agentes y workflows solo para trabajos grandes** (auditoría, cientos de páginas). Todo encargo lleva "PROHIBIDO escribir ficheros": el agente devuelve datos y los cambios los aplica la sesión principal.
12. **"Sigue igual" → mirar antes de suponer**, en este orden: `git status` y el diff; la fecha de `dist/`; el servidor de desarrollo con el CSS viejo (se reinicia); dev frente a build; la caché del navegador; el último despliegue. No se le piden errores al propietario antes de haber mirado.
13. **Windows**: el código con `\n`, `\s` o `\b` se escribe en ficheros con las herramientas de edición, nunca con `node -e` ni heredocs.

### A5. Qué sube a Git y qué no

- El `.gitignore` completo existe antes del primer `git add` (G2).
- **Nunca `git add .` ni `git add -A`**: rutas concretas. `package.json` y `package-lock.json`, siempre en el mismo commit.
- **Sí sube**: `src/`, `public/`, `estructura-viva.json` y `legales-vivos.json` (la foto de la web vieja: tras el cambio de DNS ya no se pueden volver a bajar).
- **No sube**: `referencia/`, `informes/`, `capturas*/`, `descargas/`, `dist/`, `node_modules/`, `kit/`, `analisis/`, `marca/` (salvo lo que se use, que se copia a `public/`), registros y exports.
- Antes del primer push se avisa del peso de `public/`.
- **Antes de cada subida que añada ficheros de datos, se compila desde un clon limpio.** En renders.studio faltaba un fichero en Git y Netlify falló con ENOENT dos días después.

---

## B. EL KIT

| Carpeta | Qué es | Cuándo |
|---|---|---|
| `kit/web-final/` | casascontenedores terminado: motor con marcado propio, componentes, formularios AJAX, galería, `netlify.toml`, `_redirects`. **Es la base de la web nueva** | Desde la Fase 0 |
| `kit/scripts/` | Las herramientas en su última versión: descargas, árbol, menús, validador, comparador de encabezados, correcciones | Siempre |
| `kit/extraer.py` | Pasa el XML a un JSON por página. Va primero (`arbol.py` rellena los JSON pero no los crea). **Borra todos los JSON de `src/content/pages/` antes de escribir**: se lanza una sola vez | Fase 0 |
| `kit/copia-fiel/` | Solo si la Dec. 3 elige la copia fiel. Con la opción por defecto **no se abre** | — |

### B0. Cómo se monta el proyecto (Fase 0)

Se monta en la **raíz** de la carpeta, nunca dentro de `kit/` (los scripts
calculan sus rutas desde su propia carpeta).

1. De `kit/web-final/` a la raíz: `src/`, `astro.config.mjs`, `package.json`, `package-lock.json`, `netlify.toml`, `public/_redirects` y `public/robots.txt`. **Nada más de `public/`** (son fotos y verificaciones de casascontenedores).
2. `kit/scripts/` → `scripts/`. `kit/extraer.py` → la raíz.
3. **Se vacía lo que es de casascontenedores**:
   - `src/content/pages/` entero (lo rellena `extraer.py`);
   - `src/data/`: se dejan solo `site.json` (rellenado con los datos nuevos), `menus.json` (lo genera `menus.py`), `erratas.json` vacío (`{"palabras": {}, "frases": []}`), `encabezados.json` vacío (`{}`) y `orden-tipos.json` vacío. El resto (`ciudad-encabezados`, `intro-ciudades`, `intro-libres`, `modelos-m2`, `servicios`, `zonas`, `imagenes`) se borra; si la web nueva necesita algo parecido se crea en la Fase 4 con sus datos;
   - `scripts/extra-imagenes.txt` se vacía.
4. **Se desenchufan las piezas de casascontenedores** (Dec. 7): `ciudad.js`, `comunes.js`, `localidades.js`, `tipos.js`, `renombres.js`, `intro.js`, `CalculadoraHipoteca`, `CatalogoModelos`, `ServiciosContenedores`, `zonas.mjs`, `nueva-pagina-modelo.mjs`, `fotos-servicios.mjs`. Se quitan sus llamadas de `[...slug].astro` y se borran los ficheros. Se busca con grep cualquier texto de casascontenedores que quede ("contenedor", "casascontenedores", el NIF, el teléfono, el `ca-pub`) y tiene que dar 0.
5. `package.json`: versiones **exactas** (sin `^`) y fuera las `@fontsource/*` que no use el diseño nuevo.
6. `kit/` no se modifica: es la copia de consulta.

### B2. Mapa de `kit/web-final/` (para no tener que leerlo)

**Motor**
| Fichero | Qué hace | En la web nueva |
|---|---|---|
| `src/pages/[...slug].astro` | Pinta cada página desde su JSON; aquí se enchufan los añadidos (intro, FAQ, servicios, renombres) | Se adapta: fuera lo de casas (B0.4) |
| `src/utils/render.js` (658 l.) | Pinta el árbol de Elementor con marcado propio: `section.bloque > .bloque-in > .fila > .col > .b`, más `.modelos`, `.etiquetas`, `.col--ventajas`, `.col--foto`, `.bloque--banda`, `.col--formulario` | Se reutiliza; se añaden los widgets nuevos del inventario. **Ojo con los "patrones"** (B1.6) |
| `src/utils/paginas.js` | Campos opcionales de cada JSON que mandan sobre lo deducido | Igual |
| `src/utils/imagenes.js` | `width`/`height` reales y webp | Revisar (B1.5) |
| `src/utils/hero.js` | La foto del héroe, elegida a mano | Se rehace con las fotos de la web nueva |
| `src/utils/site.js` | Datos del negocio desde `site.json` | Igual |
| `src/layouts/Base.astro` | `<head>`, SEO, canonical, Analytics, AdSense; `global.css` + `diseno.css` | Igual, con los datos nuevos |

**Componentes reutilizables**: `Header` (barra fina + fila pegajosa con logo,
menú y botón), `Hero`, `Migas` (BreadcrumbList), `Cierre` (franja final de
llamada a la acción), `Footer`, `Formulario` (reproduce el CF7 de la web
vieja), `FormularioPasos` (presupuesto en 3 pasos), `WhatsApp`.
Scripts del navegador: `formularios.js` (envío AJAX), `galeria.js` (visor).

**Aspecto**
| Fichero | Qué pinta |
|---|---|
| `src/styles/global.css` | El chrome: cabecera, héroe, cierre, pie |
| `src/styles/diseno.css` | El contenido. Todo sale de las variables de `:root` (colores `--ink`, `--texto`, `--verde`, `--corten`…; letras `--titular`, `--cuerpo`, `--mono`; `--radio`, `--sombra`, `--caja`). **Personalizar empieza por aquí** |

**Herramientas útiles en `scripts/`**: `arbol.py`, `menus.py`, `descargar-*`,
`validar.mjs`, `comparar-encabezados.mjs`, `erratas.mjs`,
`corregir-erratas.mjs`, `aplicar-ampliacion.mjs`, `botones-descriptivos.mjs`,
`nueva-pagina.mjs`, `analizar-imagenes.mjs`, `webp.mjs`, `favicons.mjs`,
`capturar.mjs`.
**No hacen falta con la Dec. 3 por defecto**: `css.mjs`, `fuentes-locales.mjs`,
`comparar-visual.mjs`, `capturar-referencia.mjs`, `descargar-muestra.mjs`.

### B1. Fallos conocidos del kit (que afectan a esta vía)

Se apuntan en la Fase 0 y se arreglan, con el visto bueno del propietario,
antes de usar el script afectado. Detalle con fichero y línea en
`analisis/ANALISIS-PROMPT-V4.md`, **solo las líneas 261 a 295**.

1. **Los descargadores salen con código 0 aunque fallen descargas.** Tienen que salir con 1. `descargar-css.mjs` da por buena cualquier respuesta 200 (incluido el error de 196 bytes). `descargar-imagenes.mjs` no coge `uploads/elementor/thumbs/`. `descargar-legales.mjs` y `legales.mjs` no fallan si una legal sale vacía.
2. **`arbol.py` se calla lo que no conoce**: descarta widgets desconocidos (entre ellos `icon`, `icon-box`, `icon-list`, `social-icons`), manda menús desconocidos al de por defecto y deja pasar shortcodes como texto (así se publicó `[modula id=«2806»]`). Tiene que contarlo y fallar.
3. **`arbol.py` no lee la altura de sección** (`height`, `custom_height`, `column_position`) y aplana los contenedores `e-con`. Con marcado propio la altura exacta importa menos, pero una sección "pantalla completa" tiene que seguir pareciéndolo.
4. **`validar.mjs` no comprueba**: shortcodes literales, que existan los fondos del árbol, el canonical exacto. Y recorta la salida. Se completa en la Fase 2 (C3).
5. **`imagenes.js` cambia el `src` por la webp** y tiene una lista de fotos "equivalentes" que sustituye unas por otras: se quitan las dos cosas (A3.5 y A3.6).
6. **Lo que hay que corregir de `kit/web-final/`**:
   - `diseno.css` da color y tamaño a todos los `h1`–`h6` y `<a>` sueltos: cada regla, acotada a su contenedor (`.bloque`, `.b`…);
   - `_redirects` manda todos los `?p=` a la portada: se quita (Fase 7);
   - `render.js` reconoce "patrones" y pinta como tarjetas bloques que no lo son: cada patrón se comprueba con capturas en la web nueva antes de dejarlo activo;
   - la decisión del H1 de casascontenedores viene ya tomada (`extraer.py` sube el primer encabezado, `comparar-encabezados.mjs` acepta ese cambio sin contarlo): se desactiva hasta que el propietario apruebe su regla.
7. **Falta `scripts/todo.mjs`** (sección C). Se escribe en la Fase 1.

---

## C. LAS COMPROBACIONES

| Orden | Qué hace | Navegador |
|---|---|---|
| `npm run todo` | Genera (medidas de imagen), compila, valida (C3) y compara encabezados (C1) y contenido (C2) | No |
| `npm run todo:visual` | Barrido de 404 (C5), contraste (C4) y capturas de cada tipo a 1400 y 390 px | Sí |

- Las lanza `scripts/todo.mjs`, que anuncia `[n/N]` y, si algo falla, dice **"SE HA PARADO EN: <paso>"**. Cada paso escribe su informe en `informes/` y sale con código distinto de 0 si falla.
- Desde la Fase 2, `todo` a 0 antes de subir; desde la Fase 3, también `todo:visual`. Al cerrar la Fase 3 se pone un hook pre-push que lo impone.
- **Cada fallo que el propietario ve a ojo entra ese mismo día como comprobación.**
- **Excepciones**: `src/data/fallos-original.json` (sí sube) lista los fallos del original aprobados por el propietario (un 404 que también da el servidor viejo, un enlace roto que ya estaba…). Salen como AVISO con su número de páginas; todo lo demás es FALLO.

### C1. Encabezados
La secuencia de H1/H2/H3 de cada página, en orden, contra `estructura-viva.json`.
Avanza con un puntero (no `indexOf`: hay títulos repetidos) y compara el nivel
de cada pareja. Excepciones solo en datos (`encabezados.json`, `erratas.json`)
y la regla del H1 aprobada. Objetivo: 100 % idénticas.

### C2. Contenido (lo que sustituye a la copia fiel)
Para cada página, contra su HTML de `referencia/`, con el mismo lector de HTML
para los dos lados:
- **texto visible**: la misma secuencia de párrafos, normalizando espacios y lo que cambia WordPress al publicar (comillas «», `...` → `…`), y quitando lo añadido a propósito (marcado con un atributo `data-nuevo`);
- **enlaces**: los mismos destinos, en el mismo orden;
- **imágenes**: las mismas fotos (por ruta original) y el mismo texto `alt`;
- **visible de verdad**: con Playwright, cada texto del original está en la nueva y se ve (no `display:none`, no opacidad 0, no fuera de pantalla, no del mismo color que el fondo).

Objetivo: 0 diferencias. Es lo que demuestra que no se ha perdido nada aunque el diseño sea otro.

### C3. El validador
- Etiquetas equilibradas; un solo H1 (tras la regla aprobada); ningún bloque generado dentro de otro.
- Existe el fichero de cada imagen, también las de los fondos del árbol y las del CSS propio.
- **FALLO si queda un shortcode literal** (`[nombre …]`).
- Canonical exactamente `https://DOMINIO/ruta/`, con barra final. Canonical y etiquetas sociales en absoluto; el cuerpo, en relativo.
- `astro.config.mjs` con `trailingSlash: 'always'` y `build.format: 'directory'`.
- Ningún texto de casascontenedores (grep de B0.4).

### C4. Contraste
Con el diseño propio es más sencillo que en la v5 (ya no hay capas de Elementor), pero:
- se mide lo que hay **debajo** del texto componiendo el elemento, sus padres y sus `::before`/`::after`, con transparencias;
- texto sobre foto: se mide sobre la zona más clara de la foto que queda debajo; si no llega, se refuerza el velo con un degradado, el texto no se toca;
- si la foto de fondo no cargó, no se arregla nada: se apunta como fichero que falta (C5);
- objetivo WCAG AA: 4,5:1 en texto normal y 3:1 en titulares grandes.

### C5. Barrido de 404
Recorre cada tipo de página entera (para que carguen las perezosas) y lista
los 400/404 separando fotos, tipografías y otros. Tiene que dar 0, salvo las
excepciones.

---

## D. EL PASO A PASO

Nueve fases, en orden. Al cerrar cada una: se cumple su Cierre (desde la Fase 2,
con `todo` a 0; desde la 3, también `todo:visual`), commit, `CLAUDE.md`
actualizado, subida si la Dec. 2 lo permite y estado del cambio (A2).

Orientación: casascontenedores se hizo en 5 días. Con esta vía, las Fases 0 a 3
deberían caber en 2.

### FASE 0 — Reconocimiento
"Sin escribir código" = sin tocar el motor ni el kit. Sí se monta el proyecto, se pasan `extraer.py`, `arbol.py` y `menus.py` y se hacen recuentos.

1. Comprobar el entorno (A1) y crear `CLAUDE.md` (G1) con la ficha de marca del mensaje.
2. Montar el proyecto (B0). Si hay varios XML, se usa el que trae `_elementor_data` y se dice qué trae cada uno.
3. Apuntar los fallos del kit (B1) con la fase en que hace falta arreglar cada uno.
4. **Inventario** en `informes/inventario.md`, resumido en el chat:
   - constructor y campo de la maquetación (en Elementor, `_elementor_data`, nunca `content:encoded`);
   - páginas y **tipos de diseño** (agrupados por la huella de su árbol y su menú, en un solo fichero que leen todos los scripts);
   - **cabeceras distintas** y qué ajuste las elige (`ocean_header_custom_menu`). En renders.studio eran 5 y 82 páginas usaban una que no estaba en la muestra;
   - widgets por tipo, **marcando los que `render.js` no sabe pintar**: cada uno es trabajo de la Fase 2;
   - section/column o container (`e-con`);
   - iconos: SVG en el HTML (`<svg class="e-font-icon-svg">`, se copian tal cual) o tipografía (`<i class="fa…">`);
   - **plugins** (rutas `/wp-content/plugins/NOMBRE`) y **shortcodes**, con su número de páginas. Galerías, formularios, mapas, rejillas y legales no vienen en el export;
   - **H1**: páginas con 0 y con 2 o más. El propietario aprueba una sola regla con la lista delante;
   - enlaces rotos del original (`#`, `#https://…`, vacíos);
   - páginas con tráfico (Search Console);
   - IDs de WordPress (`?p=`, `?page_id=`) con su página.
5. **Lo que se reutiliza y lo que no**: tabla de qué piezas de `kit/web-final/` sirven tal cual, cuáles se adaptan y qué falta (B2), para que el propietario vea el tamaño del trabajo.

**Cierre**: el propietario confirma el inventario y la regla del H1.

### FASE 1 — Bajar todo
Se baja todo ahora, mientras la web vieja sigue en el dominio. **Las páginas HTML, despacio**: 2 hilos, 400 ms entre peticiones, reintentos, y se descarta la página de menos de 5.000 caracteres (WordPress devuelve errores 500 si se le pide deprisa). Ese límite no vale para hojas ni fotos.

1. Arreglar B1.1 y B1.2, con el visto bueno del propietario.
2. El HTML de **todas** las páginas a `referencia/` y `estructura-viva.json` con sus encabezados. Con muestras de 7 y 13 páginas, las dos migraciones tuvieron rondas de "me falta una página con…".
3. Las imágenes, con sus rutas y nombres originales: las del contenido (`src` y `srcset`), las de `uploads/elementor/thumbs/`, las de los fondos del árbol, las de los `url(...)` de las hojas del tema (se bajan las hojas **solo para sacar esas rutas**; no se copian) y las de los plugins (galerías, sliders), diciéndole al propietario cuántas son y cuánto ocupan.
4. Lo que pinta cada plugin, capturado del HTML vivo: galerías (con todas sus fotos), formularios (campos y orden), mapas, rejillas.
5. **Las legales desde la web en vivo** (el export las trae vacías). Nunca se sobrescribe un texto bueno con uno vacío; el script falla si alguna tiene menos de N caracteres.
6. Reescribir las direcciones absolutas al dominio viejo (`https://dominio`, `//dominio`, `https:\/\/dominio`) a relativas. El script falla si queda alguna.
7. `scripts/todo.mjs` con sus primeros pasos: compilar, validar, comparar encabezados.
8. Repositorio y Netlify: si no existen, Claude crea el repositorio con `gh` (o pide la dirección); `.gitignore` completo y primer commit; primer despliegue **con `X-Robots-Tag: noindex`** (G3), compilando antes desde un clon limpio.

**Cierre**: todas las páginas en `referencia/`, legales con texto, imágenes sin fallos de descarga (las que dan 404 también en el servidor viejo, en `fallos-original.json` y enseñadas).

### FASE 2 — El motor con el contenido nuevo (diseño base, sin personalizar)
Primero que todo el contenido salga entero y bien colocado con el aspecto de casascontenedores; el diseño propio llega en la Fase 3. Así, si algo falla, se sabe si es del motor o del diseño.

1. **Primero el comparador de contenido (C2)**, y solo después se toca el motor.
2. Arreglar B1.3 a B1.6 que afecten a esta web.
3. `render.js`: pintar los widgets que el inventario marcó como desconocidos. Cada uno se prueba en una página de cada tipo que lo use (A4.7). Los iconos SVG se copian del HTML vivo con sus trazados.
4. Cabeceras y menús: de `menus.json`, una por cada tipo de cabecera del inventario.
5. Plugins: galería con `galeria.js`, formulario con `Formulario.astro` (mismos campos, mismo orden, mismo botón), mapas, rejillas.
6. Lo que depende del JavaScript en la web vieja (`elementor-invisible`, animaciones, sticky): en marcado propio no hace falta copiarlo, pero **nada puede quedar invisible** (C2 lo comprueba).
7. Legales desde `legales-vivos.json`.
8. Fallos del original en `src/data/fallos-original.json`, enseñados al propietario con el número de páginas: botones a `#`, títulos con otra ciudad (plantillas copiadas), avisos de "próximamente", etc.
9. Completar el validador (C3) y `todo.mjs`.

**Cierre**: `npm run todo` a 0 (encabezados, contenido y validador), y el propietario echa un vistazo a la vista previa de Netlify de un par de páginas.

### FASE 3 — El diseño propio (Dec. 4)
El diseño es un gusto, no una comprobación. **Personalizar no es cambiar el color del botón**: es darle a la web su propio carácter con la misma estructura.

1. **Propuesta de lenguaje visual** a partir de la ficha de marca. Igual que casascontenedores tiene el suyo escrito en la cabecera de `diseno.css` ("ACERO: neutros grises con un punto de frío, como la chapa del contenedor; verde del logo para la acción; óxido corten para antetítulos y datos; Archivo en titulares, IBM Plex Sans en el texto, Plex Mono en cifras"), la web nueva tiene que tener el suyo, con nombre y con el porqué de cada color y cada letra.
2. **Dos o tres direcciones**, cada una con:
   - paleta: fondo, papel, texto, texto suave, línea, un color de acción (botones) y un color de acento (antetítulos, cifras), sacados del logo o de la ficha; los colores de acción con contraste AA sobre blanco;
   - pareja de letras (titular + texto, y una tercera para cifras si encaja), de Fontsource, con versión exacta y solo `latin` y `latin-ext`;
   - cabecera: clara con filete fino, o barra oscura, o transparente sobre el héroe;
   - héroe: foto con velo mínimo, foto a un lado y texto al otro, o color liso;
   - tarjetas y bloques: radio, sombra o filete, densidad (aireado o compacto);
   - un detalle propio (un antetítulo con raya, un número grande en mono, un fondo con textura suave…) que la distinga de casascontenedores.
   
   Se enseñan como **capturas de la misma página** (la de más tráfico) tratada de cada manera, en escritorio y móvil, lado a lado.
3. El propietario elige (o mezcla). Se prueba **en esa página** hasta que diga que sí, en una rama de Git con su vista previa en Netlify.
4. Después, al resto: primero las variables de `:root` de `diseno.css` y `global.css`, luego los componentes (`Header`, `Hero`, `Cierre`, `Footer`), luego los bloques de `render.js` que necesiten otra forma. La cabecera de `diseno.css` se reescribe con el lenguaje visual nuevo.
5. Reglas que funcionaron:
   - **cada regla de color o tamaño, acotada a un contenedor** (`.bloque`, `.b`, el componente). Una regla suelta sobre `span` dejó un menú blanco sobre blanco;
   - sobre una foto manda el peso de la letra: 600, con sombra suave o velo en degradado; nunca una letra fina de 300;
   - la foto principal no se estira si es pequeña, sin rótulos incrustados ni marcas de agua ajenas; en webp a varios tamaños (`srcset`) con `preload`;
   - las letras, solo las que se usan (cada familia de más son decenas de KB por página).
6. Contraste (C4) y barrido de 404 (C5) a 0, y `todo:visual` completo.
7. Capturas lado a lado (vieja y nueva) de cada tipo de diseño, a 1400 y 390 px, para que el propietario lo revise de un vistazo.

**Cierre**: `todo` y `todo:visual` a 0, hook pre-push puesto y el propietario aprueba el diseño en todas las páginas.

### FASE 4 — Contenido nuevo y SEO
Todo sale de ficheros de datos; los JSON de las páginas no se editan a mano.

| Fichero | Qué hace |
|---|---|
| `ampliacion` en el JSON de cada página (`scripts/aplicar-ampliacion.mjs`, con `--seco`) | Secciones SEO y FAQ al final, con su JSON-LD |
| `encabezados.json` | Títulos que cambian a propósito; el comparador los acepta |
| `erratas.json` | Correcciones de texto, con palabras protegidas; el comparador las aplica también a la web vieja |
| Los que haga falta, a imagen de los de casascontenedores | Rejilla de servicios, párrafos de entrada, orden de menús… (ejemplos de formato en `kit/web-final/src/data/`) |

- [ ] Una sola FAQ por página, con su `FAQPage`.
- [ ] Los H2 y H3 nuevos nombran el tema de la página.
- [ ] **Ningún dato inventado y los hechos comprobados.** En casascontenedores, 6 textos decían que sin cédula "no puedes empadronarte", y es falso.
- [ ] Páginas nuevas con `nueva-pagina.mjs`, enlazadas desde el menú, desde una rejilla y desde el texto. Ninguna huérfana.
- [ ] Botones que dicen adónde llevan ("Ver precios"), no "Haz clic aquí" (`botones-descriptivos.mjs`).
- [ ] Correcciones de texto solo con permiso (A3.1), **con reglas que no se puedan aplicar dos veces** (en casascontenedores, "desea" → "deseas" volvió a aplicarse y dio "deseass" 206 veces) y conservando mayúsculas.

**Cierre**: `todo` y `todo:visual` a 0 y el propietario revisa una muestra.

### FASE 5 — Formularios y contacto
- [ ] Envío sin salir de la página (`formularios.js`), con "Mensaje enviado" o el error en el mismo sitio. La redirección de Web3Forms lleva a una página en inglés.
- [ ] El aviso dice de qué página viene cada mensaje y registra un evento de conversión en Analytics.
- [ ] WhatsApp con un mensaje distinto según la familia de páginas.
- [ ] La prueba de envío real la hace el propietario, o Claude con su permiso expreso en ese momento.

**Cierre**: el propietario recibe un envío de prueba.

### FASE 6 — Velocidad
- [ ] Fuera las letras que no se usan; `unicode-range` en las demás.
- [ ] `width` y `height` reales en cada foto.
- [ ] Webp con `<picture>`, manteniendo el `src` original.
- [ ] Sin `loading="lazy"` en las primeras imágenes de cada página ni en una foto repetida que ya salió sin él.
- [ ] Se mide sobre la web compilada (`npm run build` + `preview`), no sobre `npm run dev`, que engaña.

**Cierre**: las capturas de antes y después son iguales y `todo:visual` sigue a 0.

### FASE 7 — Mudanza al dominio (el día del cambio, en este orden)
1. Comprobar que no queda nada por bajar de la web vieja (Fase 1).
2. Tener delante la zona DNS completa (sección 1).
3. En Netlify: añadir el dominio, y que la orden de compilación genere todo lo que no está en Git.
4. En el registrador (Dec. 5): registro A de `@` a la IP de Netlify (75.2.60.5; compruébalo en su panel); `www` con A a la misma IP o CNAME a `sitio.netlify.app`; **borrar los AAAA del hosting viejo**; **no** poner CNAME en el dominio raíz (OVH le añade el dominio detrás); si vuelve la IP vieja, quitar el dominio de Multisitio en el hosting de OVH; **no tocar MX, SPF, DKIM, SRV ni TXT**.
5. Si se pasan los DNS a Netlify: antes, copiar allí todos los registros del correo y los TXT.
6. Comprobar preguntando a los servidores DNS del dominio, no al ordenador. En el PC del propietario: incógnito o `ipconfig /flushdns`.
7. Netlify → HTTPS → Verify DNS configuration.
8. El mismo día: quitar el `noindex` de `netlify.toml` y activar en `_redirects` la redirección de `*.netlify.app` al dominio (desactivada hasta ese día).
9. Correo de prueba y envío del formulario.
10. Redirecciones: las URL de WordPress que desaparecen; **cada `?p=ID` y `?page_id=ID` a su página**, no a la portada (`/  p=123  /ruta/  301!`), comprobando la URL vieja; las páginas renombradas con 301; los enlaces internos, a la dirección final.
11. Caché de un año solo para lo que existe.
12. Cookies: el CMP certificado de AdSense, conectado a Analytics y AdSense antes de que pongan cookies.
13. Search Console: enviar `sitemap-index.xml`, comprobar que todas sus URL dan 200, pedir la indexación de las páginas nuevas y vigilar las que traen tráfico.
14. El hosting viejo, un mes más.

**Cierre**: dominio y www por HTTPS con la web nueva, el correo llega y el sitemap está enviado.

### FASE 8 — Auditoría (solo lee, con workflow)
Entrega una lista y el propietario dice qué se hace: títulos o descripciones con otra ciudad; erratas repetidas; voseo o "usted" mezclados con el tuteo; botones a `#`; "Haz clic aquí"; enlaces internos que pasan por una redirección; páginas huérfanas; precios y plazos que se contradicen; avisos de "próximamente"; FAQ del tipo de página equivocado; migas de pan y datos estructurados.

---

## E. ERRORES QUE YA NOS PASARON

| Qué pasó | Regla |
|---|---|
| Se maquetó desde `content:encoded` y faltaban bloques | Siempre desde el árbol del constructor (`_elementor_data`) |
| 10 fotos de fondo usadas 1.295 veces, sin bajar | Bajar también los fondos del árbol y los `url()` de las hojas; el validador lo exige |
| Faltaba una cabecera en 82 páginas | Fase 0: contar cabeceras |
| Rondas de "me falta una página" | Bajar todas, no una muestra |
| La galería sin sus 58 fotos y `[modula id=«2806»]` publicado como texto | Plugins y shortcodes en la Fase 0; FALLO en el validador |
| Bloques pintados como tarjetas sin serlo | Cada "patrón" de `render.js`, comprobado con capturas |
| Menú blanco sobre blanco | Reglas de color acotadas a un contenedor |
| Titular blanco pasado a negro sobre una foto | Si la foto no cargó, no se arregla el contraste (C4) |
| Hubo que deshacer un rediseño entero | Enseñar opciones y probar en una página (Fase 3) |
| Un paso encadenado falló y nadie se enteró | `todo.mjs` con "SE HA PARADO EN" |
| El rediseño quitado siguió una hora en Netlify | Decir siempre el estado del cambio (A2) |
| "Sigo viendo la web vieja" tras el DNS | Cambios sin guardar en OVH, AAAA viejos, CNAME en la raíz (Fase 7) |
| Se quedó sin correo | DNS en el registrador y la zona DNS a mano (Dec. 5) |
| El formulario llevaba a una página en inglés | Envío AJAX (Fase 5) |
| "deseass" 206 veces | Reglas que no se aplican dos veces (Fase 4) |
| Textos con datos falsos | Nada inventado y comprobación de hechos (A3.4) |
| Un agente cambió ficheros por su cuenta | "PROHIBIDO escribir ficheros" |
| Expresiones regulares rotas | Windows: barras invertidas en ficheros (A4.13) |
| CSS viejo en el navegador de pruebas | Reiniciar el servidor de desarrollo tras cambiar CSS |
| La FAQ desapareció de una página | Probar los casos vacíos |
| Carpetas de pruebas metidas en Git | Nunca `git add .` ni `-A` |
| Netlify falló con ENOENT | Clon limpio antes de subir |
| Restos de la web anterior en la nueva (riesgo nuevo de esta vía) | Grep de B0.4 a 0 en el validador |

---

## F. DETALLES DE ELEMENTOR QUE SIGUEN IMPORTANDO

- `_inline_size` llega unas veces como `{size: 67.28}` y otras como `67.28`.
- El ancho de columna sale de `_column_size`; "ancho completo" es `elementor-section-full_width`.
- La sección con velo lleva un `elementor-background-overlay` **hermano** del contenido: el velo es parte del fondo.
- Contenedor nuevo (`e-con`): `e-con-full` a todo lo ancho, `e-con-boxed` en caja; pinta su fondo en `::before`.
- No se quita el `<style>` de los bloques de texto escritos a mano sin mirar qué pinta: a veces su aspecto vive ahí.
- Los iconos de los widgets son SVG en el HTML: se copian con sus trazados, nunca con la tipografía del tema.
- WordPress al publicar: comillas a «» y ‘’, `...` a `…`; quita el `;` final de los `style`; los enlaces internos `http://` salen en `https://`.

---

## G. PLANTILLAS

### G1. CLAUDE.md (Claude lo crea en la Fase 0)

```markdown
# [DOMINIO] — migración de WordPress a Astro

## Quién manda
[NOMBRE], no técnico: castellano de España, de tú, sin jerga. Lo haces tú.
Cada informe dice el estado del cambio (local / commit / main desplegado).

## Decisiones (sección 0 del prompt)
Dec. 1 [..] · Dec. 2 [..] · Dec. 3 [..] · Dec. 4 [..] · Dec. 5 [..] ·
Dec. 6 [..] · Dec. 7 [..]
Regla del H1 aprobada: [..]

## Marca y diseño
Sector y público: [..] · Tres palabras: [..] · Webs de referencia: [..]
Lenguaje visual aprobado (Fase 3): [nombre, paleta, letras, cabecera, héroe]

## Reglas
- Método: PROMPT-MIGRACION-V6.md. Antes de cada fase, lee esa fase y la
  sección E. kit/web-final se consulta por el mapa B2, no entero.
- Contenido original intocable salvo petición (regla + seco + commit propio).
- Nada inventado. Lo nuevo, desde src/data/.
- Desde la Fase 2: `npm run todo` a 0; desde la 3, también `todo:visual`.
- Informes en informes/; no listar carpetas enormes.
- Windows: código con barras invertidas, en ficheros.
- Agentes: PROHIBIDO escribir ficheros.

## Datos
AdSense · GA4 · WhatsApp · teléfono · correo · horario · formulario ·
DNS en [registrador] · repositorio · sitio de Netlify.
Páginas con tráfico (Search Console): [las 10 primeras].

## Estado (se actualiza al cerrar cada fase)
- Fase actual: [n] — falta: [...]
- Hecho: [fase, fecha y commit]
- Fallos del kit arreglados: [B1.x, ...]
- Pendiente del propietario: [...]
```

### G2. .gitignore

```
node_modules/
dist/
.astro/
*.xml
*.zip
*.log
kit/
analisis/
marca/
referencia/
informes/
capturas*/
descargas/
*-fallidas.txt
```

### G3. netlify.toml: el bloque de la web de pruebas

```toml
# Se QUITA el día del cambio de DNS (Fase 7, paso 8), ni antes ni después.
[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
```

---

## ANEXO 1 — Si Claude NO puede ejecutar comandos (o no llega al dominio)

Solo si la comprobación A1 lo dice.

- El propietario ejecuta; Claude analiza, escribe y decide. Git también lo hace el propietario: cada "ya está" lleva "falta que lo subas tú" y el fichero que lo sube, con rutas concretas.
- Todo se entrega como `.cmd` de doble clic, nunca como comandos para pegar. Cada `.cmd`:
  - empieza con `cd /d "%~dp0"`;
  - comprueba sus requisitos (Node 22.12+, Python con bs4 y lxml, la dependencia clave); si falta algo, avisa, `pause` y sale;
  - anuncia cada paso (`[3/5] Descargando fotos...`) y mira el `errorlevel`; si falla: `SE HA PARADO AQUI: <paso>`;
  - deja el registro en `descargas\log-AAAAMMDD-HHMM.txt`, que Claude lee después;
  - termina con `pause`.
- Tras añadir una dependencia, el siguiente `.cmd` empieza con `npm install`.
- Si dice "sigue igual": listar la carpeta con fecha y tamaño; mirar `.git` (`logs/HEAD` dice los commits; `refs/remotes/origin/main` o `packed-refs`, si se subió); no suponer que el `.cmd` se ejecutó.
- No se le pide al propietario que pegue registros largos: los escribe el `.cmd`.

---

Los porqués de casascontenedores están en `analisis/ANALISIS-MIGRACION.md`. El
método de copia fiel exacta (Dec. 3 alternativa) es `PROMPT-MIGRACION-V5.md`:
solo se usa si se elige esa opción.
