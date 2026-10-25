// Imprime un HTML a PDF con el Edge o Chrome instalado, sin interfaz.
// Si el navegador no se encuentra solo: CHROME_PATH="ruta/al/navegador"
import { writeFile, mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
export const urlFuente = pathToFileURL(join(raiz, 'public/fuentes/bricolage-grotesque-latin-wght.woff2')).href;

const candidatos = [
  process.env.CHROME_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

export async function imprimirPDF(html, salida) {
  const navegador = candidatos.find((c) => existsSync(c));
  if (!navegador) throw new Error('No encontré Edge ni Chrome. Indica la ruta con CHROME_PATH.');
  const temporal = await mkdtemp(join(tmpdir(), 'acude-pdf-'));
  const archivoHtml = join(temporal, 'pagina.html');
  await writeFile(archivoHtml, html);
  try {
    execFileSync(navegador, [
      '--headless',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--user-data-dir=${join(temporal, 'perfil')}`,
      `--print-to-pdf=${salida}`,
      pathToFileURL(archivoHtml).href,
    ], { stdio: 'ignore', timeout: 60_000 });
  } finally {
    await rm(temporal, { recursive: true, force: true });
  }
  if (!existsSync(salida)) throw new Error(`No se generó ${salida}`);
}
