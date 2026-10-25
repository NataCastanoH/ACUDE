// Descarga los materiales de Base44, los compara con las copias locales
// y deja en public/materiales/ un PDF por material con nombre limpio (S03-bitacora.pdf).
// Cuando hay dos copias del mismo archivo se publica la local.
//
// Uso: npm run descargar-materiales
//      node scripts/descargar-materiales.mjs --local <carpeta> --respaldo <carpeta> --destino <carpeta>

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(
  process.argv.slice(2).reduce((pares, v, i, arr) => (v.startsWith('--') ? [...pares, [v.slice(2), arr[i + 1]]] : pares), [])
);
const carpetaLocal = args.local ?? join(raiz, '_entrada', 'documentos');
const carpetaRespaldo = args.respaldo ?? join(raiz, '_respaldo', 'base44');
const carpetaDestino = args.destino ?? join(raiz, 'public', 'materiales');

const manifiesto = JSON.parse(await readFile(join(raiz, 'scripts', 'materiales.json'), 'utf8'));

const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const esPdf = (buf) => buf.subarray(0, 5).toString('latin1') === '%PDF-';
const nombreLimpio = (a) => `S${String(a.sesion).padStart(2, '0')}-${a.tipo}.pdf`;

async function descargar(url, intentos = 3) {
  for (let i = 1; i <= intentos; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (i === intentos) throw err;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

// Los zip creados en macOS guardan las tildes descompuestas (NFD): se busca por nombre normalizado
const nombresLocales = new Map(
  (await readdir(carpetaLocal).catch(() => [])).map((n) => [n.normalize('NFC'), n])
);

await mkdir(carpetaRespaldo, { recursive: true });
await mkdir(carpetaDestino, { recursive: true });

const filas = [];
for (const a of manifiesto.archivos) {
  const fila = { archivo: nombreLimpio(a), base44: '—', local: '—', comparacion: '—', publicado: 'no' };
  let bufBase44 = null;
  let bufLocal = null;

  if (a.base44) {
    try {
      const buf = await descargar(manifiesto.base44 + a.base44);
      if (!esPdf(buf)) throw new Error('la respuesta no es un PDF');
      await writeFile(join(carpetaRespaldo, a.base44), buf);
      bufBase44 = buf;
      fila.base44 = `ok (${Math.round(buf.length / 1024)} KB)`;
    } catch (err) {
      fila.base44 = `falló: ${err.message}`;
    }
  } else {
    fila.base44 = 'no existe en Base44';
  }

  const nombreLocal = a.local && nombresLocales.get(a.local.normalize('NFC'));
  if (nombreLocal) {
    const buf = await readFile(join(carpetaLocal, nombreLocal));
    if (esPdf(buf)) {
      bufLocal = buf;
      fila.local = `ok (${Math.round(buf.length / 1024)} KB)`;
    } else {
      fila.local = 'el archivo local no es un PDF';
    }
  } else {
    fila.local = 'no está en la carpeta local';
  }

  if (bufBase44 && bufLocal) fila.comparacion = sha(bufBase44) === sha(bufLocal) ? 'idénticos' : 'DIFERENTES';

  const elegido = bufLocal ?? bufBase44;
  if (elegido) {
    await writeFile(join(carpetaDestino, fila.archivo), elegido);
    fila.publicado = bufLocal ? 'sí, copia local' : 'sí, copia de Base44';
  }
  filas.push(fila);
  console.log(`${fila.archivo.padEnd(22)} Base44: ${fila.base44.padEnd(28)} local: ${fila.local.padEnd(28)} ${fila.comparacion}`);
}

const fecha = new Date().toISOString().slice(0, 10);
const reporte = [
  `# Reporte de materiales (${fecha})`,
  '',
  'Generado por `scripts/descargar-materiales.mjs`. Las copias de Base44 quedan en `_respaldo/base44/` (fuera del repositorio).',
  '',
  '| Archivo | Base44 | Copia local | Comparación | Publicado |',
  '|---|---|---|---|---|',
  ...filas.map((f) => `| ${f.archivo} | ${f.base44} | ${f.local} | ${f.comparacion} | ${f.publicado} |`),
  '',
  `Publicados: ${filas.filter((f) => f.publicado !== 'no').length} de ${filas.length}.`,
  '',
].join('\n');
await writeFile(join(raiz, 'scripts', 'reporte-materiales.md'), reporte);

const fallos = filas.filter((f) => f.publicado === 'no');
if (fallos.length) {
  console.error(`\nSin publicar: ${fallos.map((f) => f.archivo).join(', ')}`);
  process.exitCode = 1;
}
