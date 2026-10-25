// Une en un solo PDF las bitácoras de public/materiales/ (S03-bitacora.pdf, S04-bitacora.pdf…), en orden,
// con una portada en la identidad del sitio y un índice por sesión. Se corre al final del curso.
// El bloque de descarga del inicio aparece solo cuando existe public/bitacora-completa.pdf.
//
// Uso: npm run bitacora-completa
//      node scripts/bitacora-completa.mjs --salida <archivo.pdf>   (para probar sin publicar)

import { readFile, readdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { PDFDocument } from 'pdf-lib';
import { imprimirPDF, raiz, urlFuente } from './imprimir-pdf.mjs';

const i = process.argv.indexOf('--salida');
const salida = i > 0 ? process.argv[i + 1] : join(raiz, 'public/bitacora-completa.pdf');
const SEMESTRE = 'Semestre 2026-2';

const sesiones = JSON.parse(await readFile(join(raiz, 'src/data/sesiones.json'), 'utf8'));
const carpeta = join(raiz, 'public/materiales');
const archivos = (await readdir(carpeta)).filter((n) => /^S\d{2}-bitacora\.pdf$/.test(n)).sort();
if (!archivos.length) throw new Error('No hay bitácoras en public/materiales/');

const bitacoras = [];
for (const nombre of archivos) {
  const numero = Number(nombre.slice(1, 3));
  const pdf = await PDFDocument.load(await readFile(join(carpeta, nombre)));
  const s = sesiones.find((x) => x.numero === numero);
  bitacoras.push({ numero, titulo: s?.titulo ?? `Sesión ${numero}`, pdf, paginas: pdf.getPageCount() });
}

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const dos = (n) => String(n).padStart(2, '0');

function htmlPortada(paginasIniciales) {
  let pagina = paginasIniciales + 1;
  const filas = bitacoras.map((b) => {
    const fila = `<tr><td class="n"><span>${dos(b.numero)}</span></td><td>${esc(b.titulo)}</td><td class="p">${pagina}</td></tr>`;
    pagina += b.paginas;
    return fila;
  }).join('');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Bitácora completa del ACUDE</title><style>
  @font-face { font-family: 'Bricolage Grotesque'; font-weight: 200 800; src: url('${urlFuente}') format('woff2'); }
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Bricolage Grotesque', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .hoja { width: 210mm; height: 297mm; overflow: hidden; page-break-after: always; position: relative; }
  .portada { background: #0F1C16; color: #F4F7F1; padding: 22mm 18mm; display: flex; flex-direction: column; }
  .fondo { position: absolute; left: -8mm; bottom: 18mm; margin: 0; font-size: 92mm; font-weight: 800; line-height: .8; letter-spacing: -.06em; color: transparent; -webkit-text-stroke: .6mm #1F352B; white-space: nowrap; }
  .simbolo { width: 26mm; height: 26mm; }
  .etq { margin: 0; font-size: 9pt; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #D7F65A; }
  h1 { margin: 14mm 0 8mm; font-size: 58pt; font-weight: 800; line-height: .9; letter-spacing: -.045em; position: relative; }
  h1 span { color: #D7F65A; }
  .datos { position: relative; margin-top: auto; font-size: 12pt; line-height: 1.6; color: #A9B8AF; }
  .indice { padding: 22mm 18mm; color: #0F1C16; }
  h2 { margin: 4mm 0 8mm; font-size: 30pt; font-weight: 800; letter-spacing: -.04em; line-height: .95; }
  .indice .etq { color: #3D5248; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 3.2mm 2mm; border-bottom: .5pt solid #C9D3CC; font-size: 11pt; vertical-align: middle; }
  .n { width: 14mm; }
  .n span { display: inline-flex; align-items: center; justify-content: center; width: 11mm; height: 8mm; border-radius: 99px; background: #D7F65A; font-weight: 800; }
  .p { width: 16mm; text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
</style></head><body>
  <section class="hoja portada">
    <p class="fondo" aria-hidden="true">ACUDE</p>
    <svg class="simbolo" viewBox="0 0 100 100"><rect width="100" height="100" rx="26" fill="#D7F65A"/><rect x="42" y="22" width="16" height="56" rx="4" fill="#0F1C16"/></svg>
    <h1>Bitácora completa del <span>ACUDE</span></h1>
    <p class="etq">Herramientas de IA para la vida universitaria</p>
    <p class="datos">Bienestar Universitario · Tecnológico de Antioquia<br>${SEMESTRE} · 15 sesiones · 6 grupos<br>Docente: Natalia Castaño Hoyos</p>
  </section>
  <section class="hoja indice">
    <p class="etq">Índice</p>
    <h2>Las herramientas y los prompts, sesión por sesión</h2>
    <table><tbody>${filas}</tbody></table>
  </section>
</body></html>`;
}

// La portada y el índice se imprimen hasta que los números de página cuadren con sus propias páginas
const temporal = await mkdtemp(join(tmpdir(), 'acude-bitacora-'));
try {
  let iniciales = 2;
  let portada;
  for (let intento = 0; intento < 3; intento++) {
    const archivo = join(temporal, 'portada.pdf');
    await imprimirPDF(htmlPortada(iniciales), archivo);
    portada = await PDFDocument.load(await readFile(archivo));
    if (portada.getPageCount() === iniciales) break;
    iniciales = portada.getPageCount();
  }

  const final = await PDFDocument.create();
  final.setTitle('Bitácora completa del ACUDE');
  final.setAuthor('Natalia Castaño Hoyos');
  final.setSubject(`ACUDE · Herramientas de IA para la vida universitaria · ${SEMESTRE}`);
  for (const origen of [portada, ...bitacoras.map((b) => b.pdf)]) {
    const paginas = await final.copyPages(origen, origen.getPageIndices());
    paginas.forEach((p) => final.addPage(p));
  }
  await writeFile(salida, await final.save());
  console.log(`Listo: ${salida} (${final.getPageCount()} páginas, ${bitacoras.length} bitácoras: ${bitacoras.map((b) => dos(b.numero)).join(', ')})`);
} finally {
  await rm(temporal, { recursive: true, force: true });
}
