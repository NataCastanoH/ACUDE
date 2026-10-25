// Carga los JSON de src/data, los valida y calcula lo que se deriva de ellos.
// Si algo está mal, la construcción del sitio se detiene con la lista de problemas.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import sesionesJSON from '../data/sesiones.json';
import herramientasJSON from '../data/herramientas.json';
import galeriaJSON from '../data/galeria.json';
import promptsJSON from '../data/prompts.json';
import vocesJSON from '../data/voces.json';
import decalogoJSON from '../data/decalogo.json';
import configJSON from '../data/config.json';
import sitioJSON from '../data/sitio.json';

export const TIPOS_RETO = ['Práctica con IA', 'Portafolio', 'Juego o torneo', 'Seguimiento personal'];
export const TIPOS_PIEZA = ['Simulacro', 'Calculadora', 'Asistente', 'Presentación', 'Infografía', 'Otro'];
export const GRUPOS = ['Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado 10', 'Sábado 12'];
const ESTADOS = ['publicada', 'borrador'];

export const dosDigitos = (n) => String(n).padStart(2, '0');

export const anclaHerramienta = (nombre) =>
  'h-' + nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function validar() {
  const problemas = [];
  const raizPublic = join(process.cwd(), 'public');

  const nombres = new Set();
  for (const [i, h] of herramientasJSON.entries()) {
    const donde = `herramientas.json, posición ${i + 1} (${h.nombre ?? 'sin nombre'})`;
    if (!h.nombre) problemas.push(`${donde}: falta "nombre"`);
    else if (nombres.has(h.nombre)) problemas.push(`${donde}: el nombre está repetido`);
    nombres.add(h.nombre);
    if (!h.categoria) problemas.push(`${donde}: falta "categoria"`);
    if (h.url && !/^https?:\/\//.test(h.url)) problemas.push(`${donde}: "url" debe empezar con https://`);
  }

  const numeros = new Set();
  const slugs = new Set();
  for (const [i, s] of sesionesJSON.entries()) {
    const donde = `sesiones.json, sesión ${s.numero ?? `en la posición ${i + 1}`}`;
    if (!Number.isInteger(s.numero)) problemas.push(`${donde}: "numero" debe ser un número entero`);
    else if (numeros.has(s.numero)) problemas.push(`${donde}: el número está repetido`);
    numeros.add(s.numero);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.slug ?? '')) problemas.push(`${donde}: "slug" solo puede tener minúsculas sin tildes, números y guiones`);
    else if (slugs.has(s.slug)) problemas.push(`${donde}: el slug está repetido`);
    slugs.add(s.slug);
    if (!s.titulo) problemas.push(`${donde}: falta "titulo"`);
    if (!ESTADOS.includes(s.estado)) problemas.push(`${donde}: "estado" debe ser "publicada" o "borrador"`);
    if (s.estado === 'publicada' && !TIPOS_RETO.includes(s.tipo_reto))
      problemas.push(`${donde}: "tipo_reto" debe ser uno de: ${TIPOS_RETO.join(', ')}`);
    for (const h of s.herramientas ?? [])
      if (!nombres.has(h)) problemas.push(`${donde}: la herramienta "${h}" no está en herramientas.json (el nombre debe ser idéntico)`);
    for (const campo of ['presentacion', 'bitacora'])
      if (s[campo] && !existsSync(join(raizPublic, s[campo]))) problemas.push(`${donde}: no existe el archivo public/${s[campo]}`);
    for (const img of s.galeria ?? [])
      if (!/^https?:\/\//.test(img.src ?? img) && !existsSync(join(raizPublic, img.src ?? img))) problemas.push(`${donde}: no existe la imagen public/${img.src ?? img}`);
    for (const fecha of ['fecha', 'semana'])
      if (s[fecha] && !/^\d{4}-\d{2}-\d{2}$/.test(s[fecha])) problemas.push(`${donde}: "${fecha}" debe tener el formato AAAA-MM-DD`);
  }

  for (const [i, g] of galeriaJSON.entries()) {
    const donde = `galeria.json, posición ${i + 1}`;
    if (!TIPOS_PIEZA.includes(g.tipo)) problemas.push(`${donde}: "tipo" debe ser uno de: ${TIPOS_PIEZA.join(', ')}`);
    if (g.grupo && !GRUPOS.includes(g.grupo)) problemas.push(`${donde}: "grupo" debe ser uno de: ${GRUPOS.join(', ')}`);
    if (g.sesion != null && !numeros.has(g.sesion)) problemas.push(`${donde}: la sesión ${g.sesion} no existe`);
  }

  for (const [i, p] of promptsJSON.entries())
    if (p.sesion != null && !numeros.has(p.sesion)) problemas.push(`prompts.json, posición ${i + 1}: la sesión ${p.sesion} no existe`);

  if (!['decalogo', 'clase'].includes(configJSON.boton_principal))
    problemas.push('config.json: "boton_principal" debe ser "decalogo" o "clase"');

  if (problemas.length)
    throw new Error(`\n\nHay ${problemas.length} problema(s) en los datos del sitio:\n- ${problemas.join('\n- ')}\n`);
}

validar();

export const config = configJSON;
export const sitio = sitioJSON;
export const herramientas = herramientasJSON;
export const todasLasSesiones = [...sesionesJSON].sort((a, b) => a.numero - b.numero);
export const sesiones = todasLasSesiones.filter((s) => s.estado === 'publicada');
export const galeria = galeriaJSON.filter((g) => g.aprobado);
export const prompts = promptsJSON.filter((p) => p.aprobado);
export const voces = vocesJSON.filter((v) => v.aprobado);
export const decalogo = decalogoJSON.filter((d) => d.aprobado).sort((a, b) => a.numero - b.numero);

export const rutaSesion = (s) => `sesiones/${dosDigitos(s.numero)}-${s.slug}/`;

export const categorias = [...new Set(herramientas.map((h) => h.categoria))].sort((a, b) => a.localeCompare(b, 'es'));

// «Usada en»: se calcula cruzando sesiones.json, no se guarda en la herramienta
export const usadaEn = (nombre) => todasLasSesiones.filter((s) => s.herramientas.includes(nombre));

export const herramientaPorNombre = (nombre) => herramientas.find((h) => h.nombre === nombre);

export function fechaLarga(iso) {
  if (!iso) return null;
  const [a, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(a, m - 1, d))
  );
}
