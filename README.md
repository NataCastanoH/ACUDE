# ACUDE · Herramientas de IA para la vida universitaria

Sitio de la muestra cultural del curso del ACUDE (Bienestar Universitario, Tecnológico de Antioquia).
Se publica en **https://natacastanoh.github.io/ACUDE** cada vez que hay un cambio en la rama `main`.

Es un sitio estático hecho con [Astro](https://astro.build): no tiene servidor, base de datos ni inicio de sesión.
Todo el contenido vive en archivos JSON dentro de `src/data/` y en la hoja de Google de la galería.

## Cómo editar el contenido

Puedes editar los archivos directamente en GitHub (abre el archivo → ícono del lápiz → «Commit changes»).
A los dos o tres minutos el sitio se actualiza solo.

Si un JSON queda mal escrito (una coma de más, una comilla sin cerrar) o una sesión nombra una herramienta que no existe,
la publicación se detiene y el sitio sigue mostrando la versión anterior. El error aparece en la pestaña **Actions** del repositorio,
en español, diciendo qué archivo y qué campo revisar.

| Archivo | Qué guarda |
|---|---|
| `src/data/sesiones.json` | Las 15 sesiones: textos, herramientas, materiales, prompts, caja de herramientas |
| `src/data/herramientas.json` | El catálogo de herramientas |
| `src/data/galeria.json` | Piezas de la galería pegadas a mano (opción B) |
| `src/data/prompts.json` | El muro de prompts del inicio |
| `src/data/voces.json` | Las frases de «Las voces» |
| `src/data/decalogo.json` | Las diez reglas del decálogo |
| `src/data/sitio.json` | Textos fijos: hero, títulos de sección, sobre el curso, sobre la docente, ficha, cintas |
| `src/data/config.json` | Enlaces y ajustes: Teams, formulario y hoja de la galería, asistente, podcast, contador |

Regla de todo el sitio: donde falta contenido real va un texto entre corchetes, por ejemplo `[Nombre]`. Reemplázalo cuando tengas el dato.

### Una sesión (`sesiones.json`)

```json
{
  "numero": 13,
  "slug": "tu-primera-app",
  "titulo_corto": "Tu primera app",
  "linea": "Sin saber programar",
  "titulo": "Crear con IA I: de preguntar a construir",
  "tipo_reto": "Práctica con IA",
  "fecha": null,
  "semana": "2026-11-03",
  "unidad": "Crear con IA",
  "objetivo": "…",
  "resumen": "…",
  "actividad": "…",
  "herramientas": ["Claude (artefactos y Proyectos)", "Lovable"],
  "presentacion": "materiales/S13-presentacion.pdf",
  "bitacora": "materiales/S13-bitacora.pdf",
  "video": null,
  "galeria": [],
  "prompts": [{ "codigo": "AS", "etiqueta": "Nombre de la plantilla", "texto": "…" }],
  "caja": { "herramienta": "…", "para_que": "…", "truco": "…" },
  "estado": "publicada"
}
```

- `estado`: `"borrador"` no genera página de detalle; la sesión aparece en el recorrido como «Próximamente». Cámbialo a `"publicada"` cuando tenga sus textos.
- `tipo_reto`: uno de `Práctica con IA`, `Portafolio`, `Juego o torneo`, `Seguimiento personal`.
- `fecha` y `semana`: formato `AAAA-MM-DD` o `null`. Si hay fecha se muestra la fecha; si no, «Semana del …».
- `herramientas`: nombres **idénticos** a los de `herramientas.json`. «Usada en» del catálogo se calcula solo con esto.
- `presentacion`, `bitacora`: sube el PDF a `public/materiales/` con el nombre `S13-presentacion.pdf` o `S13-bitacora.pdf` y escribe la ruta sin `public/`. La fila de descarga solo aparece si el campo tiene ruta.
- `video`: enlace completo (YouTube, Drive) o `null`.
- `galeria`: fotos de clase. Súbelas a `public/galeria/S13/` (JPG de máximo 1600 px de ancho y unos 300 KB) y escribe `{ "src": "galeria/S13/foto1.jpg", "alt": "Qué se ve en la foto" }`.
- `caja`: la fila de la sesión en la caja de herramientas en PDF (ver abajo).
- Cada sesión aparece en la cinta y en las fichas del inicio con su `titulo_corto` y su `linea`.

### Una herramienta (`herramientas.json`)

```json
{ "nombre": "NotebookLM", "categoria": "Comprensión y traducción", "descripcion": "…", "url": "https://notebooklm.google", "gratis": true, "celular": true }
```

Las categorías se arman solas a partir de este archivo. `gratis` y `celular` aceptan `true`, `false` o `null` (sin dato, no se muestra nada).

### Prompts, voces y decálogo

Cada elemento tiene `"aprobado": true` o `false`. Lo que está en `false` no aparece. En el muro de prompts,
`codigo` y `sesion` enlazan la tarjeta con la plantilla en la página de la sesión.

### Galería

Ver `plantillas/formulario-galeria.md`: cómo crear el Google Form, conectar la hoja, aprobar piezas y publicar el CSV.

### Botón del menú

En `config.json`, `"boton_principal": "decalogo"` muestra «Nuestro decálogo». Con `"clase"` y un enlace en `enlace_teams` muestra «Entrar a la clase».

### Asistente del curso

Pega el enlace público del Gem de Gemini o del cuaderno de NotebookLM en `config.json` → `asistente.url`.
Para la fase 2 (chat propio con una API de pago) cambia `asistente.modo` a `"chat"` y pon en `asistente.endpoint` la dirección de una función serverless.
El contrato está documentado en `src/components/Asistente.astro`. La clave de la API va en esa función, nunca en este repositorio.

### Podcast

Sube el MP3 a `public/audio/podcast.mp3` y escribe `"archivo": "audio/podcast.mp3"` en `config.json` → `podcast`, o pega un enlace externo en `podcast.url`.
Un MP3 de 10 minutos a 64 kbps pesa unos 5 MB; no se descarga hasta que alguien le da reproducir.

## Trabajar en tu computador

Necesitas [Node.js](https://nodejs.org) 22 o más reciente.

```bash
npm install          # la primera vez
npm run dev          # sitio de prueba en http://localhost:4321/ACUDE
npm run build        # construye el sitio en dist/ (lo mismo que hace GitHub)
```

### Scripts

- `npm run descargar-materiales`: baja los PDF de Base44 a `_respaldo/base44/`, los compara con las copias locales de `_entrada/documentos/` y deja en `public/materiales/` un archivo por material con nombre limpio. Cuando hay dos copias se publica la local. El manifiesto está en `scripts/materiales.json` y el resultado de la última ejecución en `scripts/reporte-materiales.md`.
- `npm run caja-herramientas`: genera `public/caja-herramientas.pdf` (una página A4) a partir del campo `caja` de cada sesión. Usa el Edge o Chrome instalado; si no lo encuentra, indica la ruta con la variable `CHROME_PATH`. Vuelve a correrlo y haz commit del PDF cada vez que cambies una fila.

## Publicar

La primera vez, en GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Desde ahí, cada push a `main` corre `.github/workflows/deploy.yml`, que construye y publica. El avance se ve en la pestaña **Actions**.

## Estructura

```
.github/workflows/deploy.yml   publicación automática
public/marca/                  kit del logo (símbolo, lockups, favicons)
public/materiales/             presentaciones y bitácoras en PDF
public/galeria/                fotos de clase por sesión
public/fuentes/                Bricolage Grotesque (servida desde el sitio, sin Google Fonts)
src/data/                      todo el contenido editable
src/lib/                       validación de datos y utilidades
src/components/, src/layouts/  piezas de la interfaz
src/pages/                     inicio, recorrido, herramientas, sesiones/[sesión], 404
scripts/                       descarga de materiales y caja de herramientas
plantillas/                    formulario y hojas de la galería
```
