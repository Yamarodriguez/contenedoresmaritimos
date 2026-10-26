# Inventario — contenedoresmaritimos.net (Fase 0)

Generado a partir de `contenedoresmaritimos.WordPress.2026-10-25.xml` (el export
"Todo el contenido"; los otros XML de la carpeta son exports parciales:
solo-páginas, solo-adjuntos, el formulario de Contact Form 7 y taxonomías
vacías — no hace falta usarlos).

## Constructor y campo de la maquetación
- Elementor. El campo correcto es `_elementor_data` (NO `content:encoded`).
- 192 de 195 páginas tienen `_elementor_data`.
- 3 páginas sin Elementor (HTML/texto plano del tema): `politica-de-privacidad`,
  `politica-de-cookies`, `personalizar-cookies`.

## Páginas y estructura
- 195 páginas, todas publicadas (`publish`).
- 1 plantilla de página: `default` (192) + 3 sin plantilla (las legales).
- La web tiene dos mercados: España y Argentina. Ejemplos de slugs: ciudades
  españolas (asturias, alava, almeria, alicante, albacete, barcelona,
  badalona, badajoz, aviles, avila, burgos…) y ciudades/provincias
  argentinas (salta, rosario, necochea, bariloche, santa fe, neuquen,
  mendoza, la plata…), además de páginas de producto/servicio: `comprar`,
  `transporte`, `alquiler`, `tipos`, `oficinas`, `dry-van`, `casas`,
  `sanitarios`, `locales-comerciales`.
- Según Search Console (últimos 3 meses): Argentina da más clics que España
  (119 vs 107) con menos impresiones, así que el tráfico argentino convierte
  mejor. Páginas con más clics: `/salta/`, `/ferrol/`, `/rosario/`,
  `/necochea/`, `/bariloche/`, `/argentina/`, `/santa-fe/`, `/neuquen/`,
  `/talavera-de-la-reina/`, `/mendoza/`, `/la-plata/`.

## Cabeceras (OceanWP)
No hay plantillas de cabecera de Elementor (`elementor_library` solo trae el
"Default Kit", sin ninguna cabecera). La cabecera cambia por el **menú**
asignado (`ocean_header_custom_menu`), no por una plantilla distinta:

| Menú (ID) | Nombre del menú | Páginas |
|---|---|---|
| 0 (sin asignar → menú por defecto del tema) | — | 121 |
| 2 | Contenedores-maritimos | 51 |
| 25 | Argentina | 20 |
| (sin dato: 3 páginas legales) | — | 3 |

Hay un tercer menú, "Politicas" (ID 3), que no está asignado como cabecera de
ninguna página — probablemente se usa en el pie o en otro sitio. **Hace
falta mirar el menú "por defecto" real de WordPress** (Apariencia > Menús),
porque el export no trae esa opción (vive en `wp_options`, no en el XML).

## Widgets usados (de Elementor, por nº de veces)
| Widget | Veces |
|---|---|
| heading | 5259 |
| spacer | 4320 |
| image | 3231 |
| text-editor | 2437 |
| divider | 1754 |
| button | 1701 |
| eael-contact-form-7 | 191 |
| google_maps | 165 |

Todos son widgets habituales de Elementor core, salvo `eael-contact-form-7`
(de Essential Addons for Elementor — envuelve el formulario de Contact Form
7 "Consulta") y `google_maps` (mapa de Google, también de Elementor/plugin).
**Sin el kit no puedo confirmar si `render.js` ya sabe pintarlos** — es de
las primeras cosas a comprobar en cuanto tengamos el kit.

No se ha encontrado ningún shortcode literal en el contenido ni rutas de
`/wp-content/plugins/` dentro del HTML/Elementor — buena señal, no hay
galerías o rejillas de otros plugins que haya que replicar a mano.

## Regla del H1
- 89 páginas tienen exactamente 1 encabezado marcado como H1 dentro de
  Elementor.
- 103 páginas (entre ellas `comprar`, `transporte`, `alquiler`, `tipos`,
  todas las de ciudad…) no tienen ningún widget "heading" con tamaño H1
  dentro de Elementor — lo que implica que su H1 viene del título de la
  página que pinta el tema (OceanWP), no de Elementor.
- 0 páginas con 2 o más H1 de Elementor.
- **Hace falta decidir la regla**: lo más probable es que el H1 "real" sea
  siempre el título de WordPress (que también es el título SEO en casi
  todos los casos), y que el heading grande de Elementor en esas 89 páginas
  sea un H2 visual. Lo comprobaré con capturas antes de fijar la regla.

## Tipos de diseño (huella del árbol de Elementor)
Agrupando las páginas por la estructura exacta de su árbol de Elementor:

| Grupo | Páginas | Ejemplo | Menú |
|---|---|---|---|
| A — ciudad (básico) | 93 | asturias, alava, almeria… | siempre el menú por defecto (0) |
| B — ciudad (con variante) | 70 | rosario, mendoza, santa-fe… | mezclado: 51 con menú "Contenedores-maritimos", 19 con "Argentina" |
| C — tipo de contenedor | 4 | open-top, flat-rack, high-cube, (+1) | menú por defecto |
| D — tipo de contenedor (otra variante) | 3 | open-side, cisternas, dry-van | menú por defecto |
| E — servicio por sector | 3 | oficinas, sanitarios, locales-comerciales | menú por defecto |
| F — páginas únicas | ~20 | comprar, transporte, alquiler, tipos, precios, contacto, medidas, almacenamiento, ventilados, valencia, venta, segunda-mano, de-20-pies, de-40-pies, construcciones-con-contenedores, aviso-legal, contenedores-maritimos, casas, argentina | cada una su propia estructura |

**Pendiente de revisar cuando tengamos el kit**: por qué el grupo B (ciudad
con variante) tiene una estructura distinta del grupo A — si es solo que
esas 70 páginas llevan un bloque de más (por ejemplo, algo específico de
venta/alquiler en esa ciudad) o si es una versión más antigua/nueva de la
plantilla de ciudad. Lo compruebo con capturas antes de decidir si se
unifican en una sola plantilla de página o se mantienen como dos variantes.

- Elementor nuevo (`container`/`e-con`): 191 páginas. Section/column clásico:
  192 páginas (hay solape: muchas páginas mezclan ambos, lo normal en un
  sitio migrado de Elementor antiguo a nuevo con el tiempo).
- No se han detectado iconos SVG en el HTML del árbol ni el patrón habitual
  de icono de tipografía (`selected_icon`) en los datos de Elementor — se
  revisará al abrir las páginas de producto por si usan otro widget de icono.
- No hay enlaces internos con `?p=ID` o `?page_id=ID` en el contenido de
  Elementor — buena señal: ya usan URL "bonitas" (slugs), así que en la
  Fase 7 no habrá que redirigir muchos enlaces de ese tipo.

## Enlaces rotos / vacíos
- No se han encontrado enlaces a `#` o vacíos en los widgets de Elementor con
  la comprobación automática (botones, enlaces). No es definitivo al 100 %
  (la comprobación real se hace sobre el HTML en vivo en la Fase 1), pero no
  hay señales de alarma.

## Imágenes
- 219 adjuntos (`attachment`) en el export. Sin acceso al hosting no puedo
  medir el peso total; se hará en la Fase 1 al descargarlas.

## Otros elementos del export
- 1 entrada de post normal ("Bonjour tout le monde!", el post de ejemplo de
  WordPress — no se usa).
- 1 formulario de Contact Form 7 ("Consulta").
- 1 "Default Kit" de Elementor (estilos globales, sin cabecera ni pie
  propios).
- 182 `nav_menu_item` (las entradas de los 3 menús: Contenedores-maritimos,
  Argentina, Politicas).

## Lo que falta para poder seguir
1. **El kit (`kit/web-final/`, `kit/scripts/`, `kit/extraer.py`) y la carpeta
   `analisis/` no están en la carpeta del proyecto.** Sin ellos no puedo
   montar el proyecto (Fase 0, punto B0), ni usar `extraer.py`/`arbol.py`,
   ni reutilizar el motor de casascontenedores. Hace falta copiarlos aquí
   (la carpeta `kit` y, si la tienes, `analisis`) desde el ZIP o la
   migración anterior.
2. **La zona DNS completa de contenedoresmaritimos.net** (MX, SPF, DKIM,
   SRV, TXT) — imprescindible antes de tocar nada el día del cambio
   (Fase 7), pero conviene tenerla guardada ya.
3. **La ficha de marca y los datos del mensaje de la primera sesión**: a qué
   se dedica y a quién vende, tres palabras de cómo quieres que se sienta,
   colores, webs de referencia, AdSense/Analytics, WhatsApp, teléfono,
   correo, horario, titular (NIF, dirección), registrador del dominio,
   servicio de formularios, GitHub, Netlify, precios y plazos reales.

## Sobre dónde se ejecutan los comandos
Esta sesión está enlazada a tu ordenador para leer y escribir ficheros en
`D:\web\contenedoresmaritimos`, pero no tiene terminal en tu PC (no puedo
ejecutar `npm`, `git`, etc. directamente ahí). Lo que sí tengo es un entorno
en la nube con Node 22, Python 3.13 (con `bs4` y `lxml`), `git` y `gh`, pero
ese entorno **no llega** a `contenedoresmaritimos.net` (la red de ese
entorno solo permite gestores de paquetes y GitHub). Así que para esta
migración voy a: analizar y preparar todo en mi entorno en la nube, y
entregarte los ficheros (proyecto, informes, commits) de vuelta a tu carpeta.
Para las descargas de la Fase 1 que necesitan llegar a la web en vivo, usaré
el navegador cuando haga falta. Te lo iré diciendo en cada fase.
