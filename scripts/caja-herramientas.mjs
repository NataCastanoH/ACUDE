// Genera public/caja-herramientas.pdf: las 15 sesiones en una página (herramienta, para qué, truco).
// Lee src/data/sesiones.json (campo "caja" de cada sesión) y lo imprime con Edge o Chrome sin interfaz.
//
// Uso: npm run caja-herramientas
// Si el navegador no se encuentra solo: CHROME_PATH="ruta/al/navegador" npm run caja-herramientas

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { imprimirPDF, raiz, urlFuente as fuente } from './imprimir-pdf.mjs';

const sesiones = JSON.parse(await readFile(join(raiz, 'src/data/sesiones.json'), 'utf8')).sort((a, b) => a.numero - b.numero);
const salida = join(raiz, 'public/caja-herramientas.pdf');

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const dos = (n) => String(n).padStart(2, '0');

const filas = sesiones.map((s) => `
  <tr>
    <td class="n"><span>${dos(s.numero)}</span></td>
    <td><strong>${esc(s.titulo_corto)}</strong><br><span class="h">${esc(s.caja?.herramienta ?? '[Herramienta]')}</span></td>
    <td>${esc(s.caja?.para_que ?? '[Para qué sirve]')}</td>
    <td class="t">${esc(s.caja?.truco ?? '[Truco de una línea]')}</td>
  </tr>`).join('');

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Caja de herramientas · ACUDE</title>
<style>
  @font-face { font-family: 'Bricolage Grotesque'; font-weight: 200 800; src: url('${fuente}') format('woff2'); }
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Bricolage Grotesque', sans-serif; color: #0F1C16; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .hoja { width: 210mm; height: 297mm; display: flex; flex-direction: column; }
  header { background: #0F1C16; color: #F4F7F1; padding: 11mm 12mm 9mm; display: flex; justify-content: space-between; align-items: flex-end; gap: 8mm; }
  .marca { display: flex; align-items: center; gap: 3mm; font-weight: 800; font-size: 13pt; letter-spacing: -0.02em; }
  .marca i { display: inline-block; width: 8mm; height: 8mm; border-radius: 26%; background: #D7F65A; position: relative; }
  .marca i::after { content: ''; position: absolute; left: 42%; top: 22%; width: 16%; height: 56%; border-radius: 1px; background: #0F1C16; }
  h1 { margin: 4mm 0 0; font-size: 30pt; font-weight: 800; line-height: 0.9; letter-spacing: -0.04em; }
  h1 span { color: #D7F65A; }
  .etq { font-size: 7pt; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #D7F65A; }
  .sub { max-width: 62mm; font-size: 8.5pt; line-height: 1.35; color: #A9B8AF; text-align: right; }
  table { width: 100%; border-collapse: collapse; margin: 5mm 0 0; }
  main { flex: 1; padding: 0 12mm; }
  th { text-align: left; font-size: 6.5pt; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #3D5248; padding: 0 2mm 2mm; border-bottom: 1.5pt solid #0F1C16; }
  td { padding: 2.1mm 2mm; border-bottom: 0.5pt solid #C9D3CC; font-size: 8.4pt; line-height: 1.3; vertical-align: top; }
  td strong { font-size: 9pt; font-weight: 800; }
  .h { color: #3D5248; }
  .t { font-weight: 600; }
  .n { width: 11mm; padding-right: 0; }
  .n span { display: inline-flex; align-items: center; justify-content: center; width: 9mm; height: 7mm; border-radius: 99px; background: #D7F65A; font-weight: 800; font-size: 9pt; }
  footer { padding: 4mm 12mm 7mm; font-size: 7pt; color: #3D5248; display: flex; justify-content: space-between; }
</style></head>
<body><div class="hoja">
  <header>
    <div>
      <div class="marca"><i></i>ACUDE</div>
      <h1>La caja de <span>herramientas</span></h1>
      <p class="etq" style="margin:3mm 0 0">Las 15 sesiones en una sola página</p>
    </div>
    <p class="sub">Herramienta, para qué sirve y el truco de una línea, para que no se te olvide nada el próximo semestre</p>
  </header>
  <main>
    <table>
      <thead><tr><th></th><th>Sesión y herramienta</th><th>Para qué</th><th>El truco</th></tr></thead>
      <tbody>${filas}</tbody>
    </table>
  </main>
  <footer><span>ACUDE · Herramientas de IA para la vida universitaria · Bienestar Universitario · Tecnológico de Antioquia</span><span>natacastanoh.github.io/ACUDE</span></footer>
</div></body></html>`;

await imprimirPDF(html, salida);
console.log(`Listo: ${salida}`);
