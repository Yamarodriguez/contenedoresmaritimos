// Capturas de una página con cada tema, a escritorio (1400) y móvil (390).
// Uso: node scripts/capturas.mjs /salta/ a,b,c
import { chromium } from 'playwright';
const [ruta = '/salta/', temas = 'a,b,c'] = process.argv.slice(2);
const navegador = await chromium.launch();
for (const tema of temas.split(',')) {
  for (const [nombre, ancho, alto] of [['escritorio', 1400, 900], ['movil', 390, 800]]) {
    const pagina = await navegador.newPage({ viewport: { width: ancho, height: alto } });
    await pagina.goto(`http://localhost:4321${ruta}?tema=${tema}`, { waitUntil: 'networkidle' });
    await pagina.evaluate(() => document.fonts.ready);
    // Recorre la página para que carguen las fotos perezosas y vuelve arriba.
    await pagina.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await pagina.waitForTimeout(400);
    await pagina.screenshot({ path: `capturas/${tema}-${nombre}.png`, fullPage: false });
    const r = await pagina.$('.rejilla');
    if (r) { await r.scrollIntoViewIfNeeded(); await pagina.waitForTimeout(300); await pagina.screenshot({ path: `capturas/${tema}-${nombre}-tarjetas.png`, fullPage: false }); }
    await pagina.close();
  }
}
await navegador.close();
console.log('Capturas hechas');
