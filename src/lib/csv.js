// Lector de CSV mínimo (comillas dobles, saltos de línea dentro de comillas)
export function leerCSV(texto) {
  const filas = [];
  let fila = [], campo = '', comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n') { fila.push(campo); filas.push(fila); fila = []; campo = ''; }
    else if (c !== '\r') campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  return filas.filter((f) => f.some((v) => v.trim() !== ''));
}

const normalizar = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// Encabezados que acepta la hoja de la galería (los del formulario y los cortos)
const ALIAS = {
  tipo: 'tipo', tipo_de_pieza: 'tipo',
  titulo: 'titulo', nombre_de_la_pieza: 'titulo',
  materia_o_contexto: 'materia_o_contexto', materia: 'materia_o_contexto',
  autor: 'autor', nombre: 'autor', tu_nombre: 'autor', tu_nombre_como_quieres_que_aparezca: 'autor',
  grupo: 'grupo',
  sesion: 'sesion',
  enlace: 'enlace', enlace_a_la_pieza: 'enlace',
  fecha: 'fecha', marca_temporal: 'fecha', timestamp: 'fecha',
  aprobado: 'aprobado',
};

const SI = ['si', 'x', 'true', 'verdadero', '1', 'aprobado'];

// Convierte el CSV publicado en piezas con los campos de galeria.json; solo deja las aprobadas
export function piezasDesdeCSV(texto) {
  const [encabezados = [], ...filas] = leerCSV(texto);
  const campos = encabezados.map((e) => ALIAS[normalizar(e)] ?? null);
  return filas
    .map((f) => Object.fromEntries(campos.map((c, i) => [c, (f[i] ?? '').trim()]).filter(([c]) => c)))
    .filter((p) => SI.includes(normalizar(p.aprobado ?? '')))
    .map((p) => ({ ...p, sesion: p.sesion ? Number(String(p.sesion).match(/\d+/)?.[0]) || null : null, aprobado: true }));
}

// Cuenta filas aprobadas de una hoja (contador del reto comunitario)
export function contarAprobadas(texto) {
  const [encabezados = [], ...filas] = leerCSV(texto);
  const i = encabezados.findIndex((e) => normalizar(e) === 'aprobado');
  return i < 0 ? filas.length : filas.filter((f) => SI.includes(normalizar(f[i] ?? ''))).length;
}
