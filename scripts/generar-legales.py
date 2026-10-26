# Genera src/data/legales-nuevos.json: textos de las páginas legales que están vacías
# en la web original. Los datos variables llevan marcadores {{...}} que se rellenan
# al compilar desde src/data/site.json. Para cambiar un texto se edita ESTE fichero
# y se vuelve a ejecutar (no se editan los JSON de las páginas a mano).
import json

FECHA = "26 de octubre de 2026"

PRIVACIDAD = """
<p>Esta Política de Privacidad explica qué datos personales recoge <strong>{{dominio}}</strong>, para qué los usa y qué derechos tienes sobre ellos, de acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>
<h2>1. Quién es el responsable</h2>
<ul>
<li><strong>Responsable:</strong> {{nombre}}</li>
<li><strong>NIF/NIE:</strong> {{nif}}</li>
<li><strong>Domicilio:</strong> {{direccion}}</li>
<li><strong>Correo electrónico de contacto:</strong> {{correo}}</li>
<li><strong>Sitio web:</strong> {{dominio}}</li>
</ul>
<h2>2. Qué datos recogemos</h2>
<p>Solo recogemos los datos que tú nos das al rellenar el formulario de contacto «Consulta»:</p>
<ul>
<li>Tu nombre.</li>
<li>Tu teléfono.</li>
<li>Tu provincia o localidad.</li>
<li>El asunto o la consulta que nos escribes.</li>
</ul>
<p>Además, como en cualquier sitio web, el servidor que aloja la página registra de forma técnica datos como la dirección IP y la fecha y hora de la visita, necesarios para que la web funcione y sea segura.</p>
<h2>3. Para qué usamos tus datos y con qué base legal</h2>
<p>Usamos tus datos para <strong>atender tu consulta</strong> y, si procede, enviarte información o un presupuesto sobre contenedores marítimos. La base legal es <strong>tu consentimiento</strong> (artículo 6.1.a del RGPD), que nos das al marcar la casilla «He leído y acepto la política de privacidad» y enviar el formulario. Puedes retirarlo en cualquier momento escribiéndonos al correo indicado arriba.</p>
<h2>4. Cuánto tiempo conservamos tus datos</h2>
<p>Conservamos tus datos mientras sean necesarios para atender tu consulta y, después, durante los plazos que la ley exija para atender posibles responsabilidades. Pasado ese tiempo, los eliminamos.</p>
<h2>5. A quién comunicamos tus datos</h2>
<p>No vendemos tus datos. Para que la web funcione intervienen proveedores tecnológicos que actúan por nuestra cuenta (alojamiento web y envío de formularios), con los que se aplican las garantías que exige la normativa, incluidas las relativas a transferencias internacionales cuando el proveedor está fuera del Espacio Económico Europeo. Solo comunicaremos tus datos a otras personas o empresas si la ley nos obliga o si tú nos lo pides.</p>
<h2>6. Tus derechos</h2>
<p>Puedes ejercer en cualquier momento los derechos de <strong>acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad</strong> escribiendo a {{correo}} e indicando el derecho que quieres ejercer. Para proteger tu información, podemos pedirte que acredites tu identidad.</p>
<p>Si crees que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es">www.aepd.es</a>).</p>
<h2>7. Seguridad</h2>
<p>Aplicamos medidas técnicas y organizativas razonables para proteger tus datos frente a accesos no autorizados, pérdida o alteración.</p>
<h2>8. Cookies</h2>
<p>Información sobre las cookies de este sitio en nuestra <a href="/politica-de-cookies/">Política de Cookies</a>.</p>
<h2>9. Cambios en esta política</h2>
<p>Podemos actualizar esta política para adaptarla a cambios legales o del sitio web. La fecha de la última revisión figura abajo.</p>
<p><em>Última actualización: {{fecha}}.</em></p>
"""

COOKIES = """
<p>Esta Política de Cookies explica qué son las cookies, cuáles puede instalar <strong>{{dominio}}</strong> y cómo puedes controlarlas, conforme a la Ley 34/2002 (LSSI) y al RGPD.</p>
<h2>1. Qué es una cookie</h2>
<p>Una cookie es un pequeño archivo que un sitio web guarda en tu dispositivo cuando lo visitas. Sirve, por ejemplo, para recordar tus preferencias o para medir cómo se usa la página.</p>
<h2>2. Qué cookies usa este sitio</h2>
<ul>
<li><strong>Cookies propias:</strong> este sitio no instala cookies propias de seguimiento, publicidad ni analítica.</li>
<li><strong>Cookies de terceros — Google Maps:</strong> algunas páginas incluyen un mapa de Google Maps incrustado. Al cargarlo, Google puede instalar cookies en tu navegador para prestar ese servicio. Más información en <a href="https://policies.google.com/technologies/cookies">la política de cookies de Google</a>.</li>
</ul>
<p>Si en el futuro incorporamos otras herramientas (por ejemplo, de analítica o publicidad), actualizaremos esta política y te pediremos tu consentimiento cuando la ley lo exija.</p>
<h2>3. Cómo desactivar o eliminar las cookies</h2>
<p>Puedes permitir, bloquear o eliminar las cookies desde la configuración de tu navegador (Chrome, Firefox, Safari, Edge u otros). Consulta la ayuda de tu navegador para ver cómo hacerlo. Si bloqueas las cookies de terceros, los mapas incrustados podrían no mostrarse correctamente.</p>
<h2>4. Más información</h2>
<p>Para saber cómo tratamos tus datos personales, consulta la <a href="/politica-de-privacidad/">Política de Privacidad</a> y el <a href="/aviso-legal/">Aviso Legal</a>.</p>
<p><em>Última actualización: {{fecha}}.</em></p>
"""

PERSONALIZAR = """
<p>Aquí puedes ver cómo controlar las cookies de <strong>{{dominio}}</strong>.</p>
<h2>Cookies que usa este sitio</h2>
<p>Este sitio no instala cookies propias de seguimiento, publicidad ni analítica. Las únicas cookies que pueden instalarse son las de terceros de <strong>Google Maps</strong>, en las páginas que muestran un mapa.</p>
<h2>Cómo personalizarlas</h2>
<p>Puedes aceptar, bloquear o eliminar las cookies desde los ajustes de privacidad de tu navegador. Si bloqueas las cookies de terceros, los mapas incrustados podrían no mostrarse.</p>
<p>Consulta todos los detalles en la <a href="/politica-de-cookies/">Política de Cookies</a> y en la <a href="/politica-de-privacidad/">Política de Privacidad</a>.</p>
<p><em>Última actualización: {{fecha}}.</em></p>
"""

salida = {
    "_nota": "Textos redactados el " + FECHA + ". Se rellenan {{marcadores}} desde site.json. Pendiente de revisión legal por el titular.",
    "fecha": FECHA,
    "politica-de-privacidad": PRIVACIDAD.strip(),
    "politica-de-cookies": COOKIES.strip(),
    "personalizar-cookies": PERSONALIZAR.strip(),
}
json.dump(salida, open('src/data/legales-nuevos.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
open('src/data/legales-nuevos.json', 'a', encoding='utf8').write('\n')
print('legales-nuevos.json escrito')
