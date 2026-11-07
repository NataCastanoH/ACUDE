// Conecta la versión arcade del juego a public/juego/contenido.js, el mismo contenido y las mismas
// reglas de la versión plana. Si ese archivo no está (por ejemplo, abierta como artefacto en claude.ai),
// la arcade sigue con su contenido de muestra.
// Se corre cada vez que llega una versión nueva de la arcade, después de copiarla:
//   npm run conectar-arcade
// También deja GAME_URL con la dirección del sitio.
import { readFileSync, writeFileSync } from 'node:fs';
const ruta = process.argv[2] || 'public/juego/arcade/index.html';
let t = readFileSync(ruta, 'utf8');
if (t.includes('<script src="../contenido.js"></script>')) { console.log('La arcade ya está conectada a contenido.js, no hay nada que hacer'); process.exit(0); }
t = t.replace(/const GAME_URL = "[^"]*";/, 'const GAME_URL = "https://natacastanoh.github.io/ACUDE/juego/arcade/";');
const cambia = (a, b) => { if (!t.includes(a)) throw new Error('No encontré: ' + a.slice(0, 90)); t = t.replace(a, () => b); };

cambia('<script>\n/* ================= Contenido ================= */\nconst ITEMS = [',
`<script src="../contenido.js"></script>
<script>
/* ================= Contenido ================= */
/* En el sitio, la arcade y la plana leen juego/contenido.js: el mismo contenido y las mismas reglas,
   solo cambia la interfaz. Lo de abajo es de muestra y solo se usa si ese archivo no está */
const J = window.JUEGO;
let ITEMS = [`);
cambia('const SCENES = [', 'let SCENES = [');

// Perfil de aliado y rango: los mismos de la plana
cambia('function allyProfile(choices) {\n',
`function allyProfile(choices) {
  if (J) {
    const votos = {};
    choices.forEach(c => { votos[c] = (votos[c] || 0) + 1; });
    const p = J.perfilDe(votos);
    return { name: p.texto.toUpperCase(), phrase: p.explicacion, action: p.opciones };
  }
`);
cambia('function rankTitle(p) {\n', 'function rankTitle(p) {\n  if (J) return J.rango(p, J.maxPuntos(ITEMS.length, SCENES.length)).toUpperCase();\n');

// Reglas
cambia(`const TIME = 10;          // segundos de la barra de bono
const BASE = 100;         // por acierto
const SPEED_MAX = 50;     // bono por rapidez
const STREAK_STEP = 25;   // bono por cada acierto seguido
const ALLY_PTS = 50;      // por cada situación de la parte 2
const LIFE_PTS = 50;      // bono final por cada vida que quede
const GOAL = 0.5;         // porcentaje mínimo de aciertos para pasar al nivel 2`,
`const RG = J ? J.reglas : { segundos: 10, acierto: 100, rapidez: 50, racha: 25, aliado: 50, vida: 50, meta: 0.5, vidas: 2 };
const TIME = RG.segundos;        // segundos de la barra de bono
const BASE = RG.acierto;         // por acierto
const SPEED_MAX = RG.rapidez;    // bono por rapidez
const STREAK_STEP = RG.racha;    // bono por cada acierto seguido
const ALLY_PTS = RG.aliado;      // por cada situación de la parte 2
const LIFE_PTS = RG.vida;        // bono final por cada vida que quede
const GOAL = RG.meta;            // porcentaje mínimo de aciertos para pasar al nivel 2
const livesFor = (m, n) => J ? J.vidasDe(m, n) : m === "coop" ? n + 1 : RG.vidas;
const goalTxt = "META " + Math.round(GOAL * 100) + "%";
const HELP = J ? J.ayuda : [
  { t: "Si estás en peligro ahora", d: "Línea 123, emergencias" },
  { t: "Violencias contra las mujeres", d: "Línea 155, orientación gratuita en todo el país" },
  { t: "Bienestar Universitario TdeA", d: "Programa Pluridiversos, solicitudes en línea", url: "https://tdea.edu.co/micrositios/bienestar-universitario/pluridiverso/" }
];

/* Cada partida saca al azar sus mitos y situaciones del contenido compartido */
function sharedRound() {
  const r = J.nuevaRonda();
  ITEMS = r.mitos.map(m => ({ claim: m.texto, answer: (m.correcta || "").toLowerCase().trim(), why: m.explicacion, route: m.ruta }));
  SCENES = r.dilemas.map(d => {
    const perf = J.partes(d.correcta), next = J.partes(d.explicacion);
    return { place: "", text: (d.texto || "").replace(/\\s*\\n\\s*/g, " "), route: d.ruta,
      options: J.partes(d.opciones).map((label, k) => ({ profile: perf[k] || "Observa", label, next: next[k] || "" })) };
  });
}`);

// Título y modos con las reglas reales
cambia('rules.appendChild(el("p", "sm", "+100 por acierto, bono si respondes rápido y bono por racha"));', 'rules.appendChild(el("p", "sm", "+" + BASE + " por acierto, bono si respondes rápido y bono por racha"));');
cambia('rules.appendChild(el("p", "sm", "Para pasar al nivel 2 hay que acertar al menos el 50%"));', 'rules.appendChild(el("p", "sm", "Para pasar al nivel 2 hay que acertar al menos el " + Math.round(GOAL * 100) + "%"));');
cambia('  items.push({ label: "VER RÉCORDS", act: records });\n  items.push({ label: "COLORES: "',
`  items.push({ label: "VER RÉCORDS", act: records });
  if (J && J.de("pregunta").length) items.push({ label: "PREGÚNTALE", hint: "Lo que nadie se atreve a preguntar en voz alta", act: () => askScreen(0) });
  if (J && J.funciones.dejaPregunta && J.formularioPregunta) items.push({ label: "DEJA TU PREGUNTA", hint: "Así el juego sigue creciendo", href: J.formularioPregunta });
  items.push({ label: "¿NECESITAS AYUDA AHORA?", act: () => { phase = "title"; clear(); hud(); helpScreen(screen, title); } });
  items.push({ label: "COLORES: "`);
cambia('hint: "Un solo equipo, puntos y " + (n + 1) + " vidas compartidas"', 'hint: "Un solo equipo, puntos y " + livesFor("coop", n) + " vidas compartidas"');
cambia('hint: "Cada quien con 2 vidas y su propio puntaje"', 'hint: "Cada quien con " + livesFor("versus", n) + " vidas y su propio puntaje"');
cambia('  maxLives = mode === "coop" ? players + 1 : 2;', '  if (J) sharedRound();\n  maxLives = livesFor(mode, players);');

// Meta y a dónde ir
cambia('  m.appendChild(el("span", "", "META 50%"));\n  m.appendChild(el("span", "", "VAN "', '  m.appendChild(el("span", "", goalTxt));\n  m.appendChild(el("span", "", "VAN "');
cambia('  m.appendChild(el("span", "", "META 50%"));\n  screen.appendChild(m);', '  m.appendChild(el("span", "", goalTxt));\n  screen.appendChild(m);');
cambia('  screen.appendChild(el("p", "txt", item.why));\n  goalLine(screen);\n  if (r.ok)',
  '  screen.appendChild(el("p", "txt", item.why));\n  if (item.route) screen.appendChild(el("p", "sm", "A dónde ir: " + item.route));\n  goalLine(screen);\n  if (r.ok)');
cambia('  screen.appendChild(el("p", "txt", item.why));\n  const rows = el("div", "rows");',
  '  screen.appendChild(el("p", "txt", item.why));\n  if (item.route) screen.appendChild(el("p", "sm", "A dónde ir: " + item.route));\n  const rows = el("div", "rows");');
cambia('  screen.appendChild(el("span", "tag", sc.place.toUpperCase()));', '  if (sc.place) screen.appendChild(el("span", "tag", sc.place.toUpperCase()));');
cambia('  screen.appendChild(el("p", "txt", op.next));\n', '  screen.appendChild(el("p", "txt", op.next));\n  if (SCENES[j].route) screen.appendChild(el("p", "sm", "Lo que aplicaba: " + SCENES[j].route));\n');

// Compartir solo si la función está encendida, igual que en la plana
cambia('  items.push({ label: "COMPARTIR POR WHATSAPP", hint: "Envía el perfil de aliado", href: "https://wa.me/?text=" + encodeURIComponent(msg) });\n  items.push({ label: "COPIAR MENSAJE", act: () => copyMsg(msg) });',
`  if (!J || J.funciones.compartir) {
    items.push({ label: "COMPARTIR POR WHATSAPP", hint: "Envía el perfil de aliado", href: "https://wa.me/?text=" + encodeURIComponent(msg) });
    items.push({ label: "COPIAR MENSAJE", act: () => copyMsg(msg) });
  }`);

// Ayuda también desde la pausa
cambia('    { label: "CAMBIAR COLORES", act: () => colorsScreen(pb, pauseMenu) },',
  '    { label: "CAMBIAR COLORES", act: () => colorsScreen(pb, pauseMenu) },\n    { label: "¿NECESITAS AYUDA AHORA?", act: () => helpScreen(pb, pauseMenu) },');
cambia('    musicItem("pause-", 2),', '    musicItem("pause-", 3),');

// Pantallas nuevas: Pregúntale y ayuda
cambia('/* ================= Paletas de color ================= */',
`/* ================= Pregúntale ================= */
function askScreen(start) {
  phase = "title";
  clear(); hud();
  screen.appendChild(el("div", "eb", "Pregúntale"));
  screen.appendChild(el("p", "big", "LO QUE NADIE PREGUNTA EN VOZ ALTA"));
  menu(J.de("pregunta").map((q, n) => ({ label: q.texto, act: () => answerScreen(n) })), screen, "ask-", { start });
  setAB(["B", "VOLVER"], ["A", "VER"]);
  H.b = () => { sfx("tap"); title(); };
  eco("idle", "PREGÚNTALE");
}
function answerScreen(n) {
  const q = J.de("pregunta")[n];
  phase = "title";
  clear(); hud();
  screen.appendChild(el("div", "eb", "Pregúntale"));
  screen.appendChild(el("p", "txt", q.texto));
  screen.appendChild(el("span", "tag", "RESPUESTA"));
  (q.explicacion || "").split("\\n").forEach(l => screen.appendChild(el("p", "sm", l)));
  if (q.ruta) screen.appendChild(el("p", "sm", "A dónde ir: " + q.ruta));
  setAB(["B", "VOLVER"], ["A", "OTRA PREGUNTA"]);
  H.a = H.b = () => { sfx("tap"); askScreen(n); };
  eco("happy", "AQUÍ ESTÁ");
}

/* ================= ¿Necesitas ayuda ahora? ================= */
function helpScreen(box, back) {
  stopTimer();
  H = {};
  box.innerHTML = "";
  box.scrollTop = 0;
  box.appendChild(el("div", "eb", "¿Necesitas ayuda ahora?"));
  box.appendChild(el("p", "big", "AQUÍ NO ESTÁS SOLO"));
  menu(HELP.map(a => a.url ? { label: a.t, hint: a.d, href: a.url } : { label: a.t, hint: a.d, act: () => {} }), box, "help-");
  setAB(["B", "VOLVER"], ["A", "ABRIR"]);
  H.b = () => { sfx("tap"); back(); };
  eco("idle", "AQUÍ NO ESTÁS SOLO");
}

/* ================= Paletas de color ================= */`);

// El nombre del juego sale de contenido.js (mientras se vota, se llama solo "Juego")
cambia('const livesFor = ', 'const GAME_NAME = J ? J.nombre : "Juego";\nconst livesFor = ');
t = t.replace(/<title>[^<]*<\/title>/, '<title>Juego · Arcade</title>');
t = t.replace(/<div class="wordmark"><b>[^<]*<\/b>/, '<div class="wordmark"><b>JUEGO</b>');
cambia(`  logo.appendChild(el("span", "m", "MITO"));
  logo.appendChild(el("span", "o", "O"));
  logo.appendChild(el("span", "d", "DERECHO"));`,
`  const nm = GAME_NAME.toUpperCase().split(" ");
  if (nm.length === 3) { logo.appendChild(el("span", "m", nm[0])); logo.appendChild(el("span", "o", nm[1])); logo.appendChild(el("span", "d", nm[2])); }
  else logo.appendChild(el("span", "m", nm.join(" ")));`);
cambia('" de aliado en Mito o Derecho es " + prof.name', '" de aliado en " + GAME_NAME + " es " + prof.name');

// Si hay hoja de Google, la lee para la próxima partida
cambia('paintSound();\ntitle();\n</script>', 'paintSound();\ntitle();\ndocument.querySelector(".wordmark b").textContent = GAME_NAME.toUpperCase();\ndocument.title = GAME_NAME + " · Arcade";\nif (J) J.cargar();\n</script>');
writeFileSync(ruta, t);
console.log('Listo: la arcade lee juego/contenido.js');
