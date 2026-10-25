// Tarjeta de una pieza de la galería. La usan la página (al construir) y el navegador (al leer el CSV),
// así las dos versiones son idénticas.
const ICONOS = {
  Simulacro: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 12h4"/><path d="M7 8h7"/><circle cx="15.5" cy="15.5" r="2"/><path d="M7 16h4"/>',
  Calculadora: '<rect x="5" y="2" width="14" height="20" rx="2"/><rect x="8" y="5" width="8" height="4" rx="1"/><circle cx="9" cy="13" r="1"/><circle cx="12" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><circle cx="9" cy="17" r="1"/><circle cx="12" cy="17" r="1"/><circle cx="15" cy="17" r="1"/>',
  Asistente: '<rect x="4" y="8" width="16" height="12" rx="3"/><circle cx="9" cy="14" r="1.2"/><circle cx="15" cy="14" r="1.2"/><line x1="12" y1="4" x2="12" y2="8"/><circle cx="12" cy="3" r="1"/>',
  Presentación: '<rect x="3" y="4" width="18" height="12" rx="2"/><line x1="12" y1="16" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/><path d="M7 12l3-3 3 2 4-4"/>',
  Infografía: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8"/><path d="M8 12h5"/><rect x="8" y="15" width="8" height="3" rx="1"/>',
  'Demo de clase': '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M10 8.5v5l4-2.5z"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  Otro: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
};

const ACCION = {
  Simulacro: 'Abrir el quiz',
  Calculadora: 'Abrir la herramienta',
  Asistente: 'Probar el asistente',
  Presentación: 'Ver la presentación',
  Infografía: 'Ver la infografía',
  'Demo de clase': 'Ver la demo',
  Otro: 'Abrir la pieza',
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const enlaceSeguro = (u) => (/^https?:\/\//i.test(u ?? '') ? u : null);

export function htmlPieza(p) {
  const tipo = ICONOS[p.tipo] ? p.tipo : 'Otro';
  const enlace = enlaceSeguro(p.enlace);
  const meta = [p.materia_o_contexto, p.autor, p.grupo].filter(Boolean).map(esc).join(' · ');
  const etiqueta = enlace ? 'a' : 'div';
  const destino = enlace ? ` href="${esc(enlace)}" target="_blank" rel="noopener"` : '';
  return `<${etiqueta} class="pieza"${destino}>
  <div class="pieza__cabeza"><span class="pieza__tipo">${esc(p.tipo || 'Otro')}</span>${p.sesion ? `<span class="pieza__sesion">Sesión ${esc(p.sesion)}</span>` : ''}</div>
  <svg aria-hidden="true" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ICONOS[tipo]}</svg>
  <p class="pieza__titulo">${esc(p.titulo || '[Título de la pieza]')}</p>
  ${meta ? `<p class="pieza__meta">${meta}</p>` : ''}
  ${enlace ? `<p class="pieza__accion">${ACCION[tipo]} <span aria-hidden="true">↗</span><span class="sr">(abre en otra pestaña)</span></p>` : ''}
</${etiqueta}>`;
}
