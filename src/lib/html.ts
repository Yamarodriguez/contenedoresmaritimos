// Los textos de Elementor traen algo de marcado en línea. Se conserva el
// permitido (negritas, saltos, span) y se quita la etiqueta del plugin de
// resaltado (elsnr-highlight), dejando su texto.
export function limpiar(texto: string = ''): string {
  return texto
    .replace(/<\/?elsnr-highlight[^>]*>/gi, '')
    .replace(/<(?!\/?(?:strong|b|em|i|br|span)\b)[^>]*>/gi, '');
}

const DOMINIO = /^https?:\/\/(?:www\.)?contenedoresmaritimos\.net(?=\/)/i;

// Enlace interno => relativo (Fase 1, paso 6); los de otros dominios no se tocan.
export function interno(url: string): string {
  return url.replace(DOMINIO, '');
}

// HTML de un widget de texto de Elementor: se conservan párrafos, listas,
// enlaces y negritas; se quitan estilos, clases, scripts y el plugin de
// resaltado. Como WordPress, si no trae párrafos, las líneas en blanco los separan.
export function htmlTexto(html: string = ''): string {
  let h = html
    .replace(/<\/?elsnr-highlight[^>]*>/gi, '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<(\/?)(p|br|strong|b|em|i|ul|ol|li|a|span|h[2-6])\b([^>]*)>/gi, (_m, c, t, attrs) => {
      if (c) return `</${t.toLowerCase()}>`;
      if (t.toLowerCase() === 'a') {
        const href = attrs.match(/href="([^"]*)"/i)?.[1];
        const ext = /target="_blank"/i.test(attrs);
        return href !== undefined ? `<a href="${interno(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>` : '<a>';
      }
      return `<${t.toLowerCase()}>`;
    })
    .replace(/<(?!\/?(?:p|br|strong|b|em|i|ul|ol|li|a|span|h[2-6])\b)[^>]*>/gi, '')
    .trim();
  if (!/<(p|ul|ol|h[2-6])\b/i.test(h)) {
    h = h.split(/\n\s*\n/).map((s) => `<p>${s.trim().replace(/\n/g, '<br>')}</p>`).join('');
  }
  return h;
}
