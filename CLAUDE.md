# contenedoresmaritimos.net — migración de WordPress a Astro

## Quién manda
Yama, no técnico: castellano de España, de tú, sin jerga. Lo hace Claude.
Cada informe dice el estado del cambio (local / commit / main desplegado).

## Decisiones (sección 0 del prompt)
Por ahora se aplican las opciones por defecto, pendiente de confirmación:
- Dec. 1 — Dónde trabaja Claude: **sin terminal en el PC** (esta sesión no
  tiene `device_bash`). El trabajo de código se hace en un entorno en la
  nube y se entrega a esta carpeta. El navegador (Claude in Chrome / el
  navegador integrado) está bloqueado por los permisos de sitio de la
  cuenta para contenedoresmaritimos.net — no se ha podido usar. WebFetch
  llega al dominio pero tiene un límite de URL nuevas por sesión (se agotó
  tras ~155 páginas). La mejor fuente ha resultado ser el propio XML de
  WordPress: `_elementor_data` trae el contenido real de 192 páginas, así
  que de ahí se ha sacado `estructura-viva.json` y `contenido-vivo.json`
  completos sin depender de red.
- Dec. 2 [pendiente]
- Dec. 3 [pendiente — depende de tener el kit]
- Dec. 4 [pendiente]
- Dec. 5 [pendiente]
- Dec. 6 [pendiente]
- Dec. 7 [pendiente]
Regla del H1: [pendiente — ver informes/inventario.md]

## Marca y diseño
Sector y público: [pendiente] · Tres palabras: [pendiente] ·
Webs de referencia: [pendiente]
Lenguaje visual aprobado (Fase 3): [pendiente]

## Reglas
- Método: PROMPT-MIGRACION-V6.md. Antes de cada fase, lee esa fase y la
  sección E. kit/web-final se consulta por el mapa B2, no entero.
- Contenido original intocable salvo petición (regla + seco + commit propio).
- Nada inventado. Lo nuevo, desde src/data/.
- Desde la Fase 2: `npm run todo` a 0; desde la 3, también `todo:visual`.
- Informes en informes/; no listar carpetas enormes.
- Agentes: PROHIBIDO escribir ficheros.

## Datos
AdSense [pendiente] · GA4 [pendiente] · WhatsApp [pendiente] ·
teléfono [pendiente] · correo [pendiente] · horario [pendiente] ·
formulario: Contact Form 7 "Consulta" vía Essential Addons — campos: nombre,
teléfono, provincia/localidad, asunto/consulta, aceptación de política de
privacidad; botón "Enviar"; aviso de email a wordpress@contenedoresmaritimos.net
(y una dirección personal que aparece en el export, a confirmar con Yama
si sigue siendo la correcta) ·
DNS en [pendiente] · repositorio [pendiente] · sitio de Netlify [pendiente].
Páginas con tráfico (Search Console, últimos 3 meses): /salta/, /ferrol/,
/rosario/, /necochea/, /bariloche/, /argentina/, /santa-fe/, /neuquen/,
/talavera-de-la-reina/, /mendoza/, /la-plata/.

## Estado (se actualiza al cerrar cada fase)
- Fase actual: 0 — falta: kit/ y analisis/ en la carpeta del proyecto,
  ficha de marca y datos del negocio, confirmar inventario y regla del H1.
- Hecho:
  - Inventario inicial a partir del XML de WordPress (informes/inventario.md).
  - estructura-viva.json (195 páginas, encabezados completos, desde Elementor).
  - contenido-vivo.json (195 páginas, bloques de contenido completos, desde Elementor).
  - legales-vivos.json: Aviso Legal completo y literal (desde Elementor).
    Pendientes de capturar a mano o con navegador: Política de Privacidad,
    Política de Cookies, Personalizar Cookies (vacías en el export).
  - Detectado un posible fallo del original en Aviso Legal: menciona un
    dominio distinto ("Contendoresescombros.com") y cita la LOPD en vez de
    la LOPDGDD vigente — pendiente de que Yama lo confirme antes de decidir
    qué se hace (A3.6: no se copia ni se arregla en silencio).
- Fallos del kit arreglados: — (aún no hay kit disponible para revisar B1).
- Pendiente del propietario: copiar kit/ y analisis/ a la carpeta; decidir
  si arregla los permisos de sitio/red para poder usar el navegador; mandar
  los datos de la ficha de marca y accesos; confirmar inventario, la regla
  del H1 y el aviso sobre el Aviso Legal.
