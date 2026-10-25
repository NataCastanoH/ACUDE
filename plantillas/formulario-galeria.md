# Plantilla: formulario y hoja de la galería (opción A)

La galería del inicio y la sección «Lo que construyeron» de cada sesión leen una hoja de Google publicada como CSV.
Solo aparecen las filas que tienen **sí** en la columna `Aprobado`. Nada se publica sin revisión.

## 1. Crear el formulario en Google Forms

Título: **Galería ACUDE · Envía lo que construiste**
Descripción sugerida: «Comparte el enlace de tu pieza. Aparece en el sitio del curso cuando la docente la revise. No pongas datos de otras personas.»

Crea las preguntas **con estos títulos exactos** (el sitio reconoce las columnas por su nombre):

| # | Título de la pregunta | Tipo | Opciones | Obligatoria |
|---|---|---|---|---|
| 1 | `Tipo` | Opción múltiple | Simulacro, Calculadora, Asistente, Presentación, Infografía, Otro | Sí |
| 2 | `Título` | Respuesta corta | | Sí |
| 3 | `Materia o contexto` | Respuesta corta | (materia, trabajo o emprendimiento) | Sí |
| 4 | `Autor` | Respuesta corta | Descripción: «Tu nombre como quieres que aparezca» | Sí |
| 5 | `Grupo` | Desplegable | Martes, Miércoles, Jueves, Viernes, Sábado 10, Sábado 12 | Sí |
| 6 | `Sesión` | Desplegable | 11, 12, 13, 14, 15 (o las que apliquen, solo el número) | Sí |
| 7 | `Enlace` | Respuesta corta, con validación «Texto → URL» | | Sí |

Sugerencia: en Configuración, desactiva «Recopilar correos» si no lo necesitas.

## 2. Conectar la hoja

1. En el formulario: pestaña **Respuestas** → **Vincular con Hojas de cálculo** → hoja nueva.
2. En la hoja, agrega a mano una columna al final con el encabezado exacto `Aprobado`.
3. Para aprobar una pieza escribe `sí` en esa columna (también sirven `x` o una casilla de verificación marcada).

La hoja queda con estas columnas (ver `galeria-hoja.csv`):

```
Marca temporal,Tipo,Título,Materia o contexto,Autor,Grupo,Sesión,Enlace,Aprobado
```

## 3. Publicar la hoja como CSV

1. En la hoja: **Archivo → Compartir → Publicar en la web**.
2. Elige la pestaña de respuestas (no «Todo el documento») y el formato **Valores separados por comas (.csv)**.
3. Copia el enlace (termina en `output=csv`) y pégalo en `src/data/config.json`:
   - `"galeria_csv"`: el enlace del CSV
   - `"formulario_galeria"`: el enlace para responder el formulario (botón «Enviar» del formulario → ícono de enlace)
4. Haz commit. Desde ese momento las piezas aprobadas aparecen solas, sin volver a publicar el sitio.

Importante: la hoja publicada es pública. No agregues columnas con correos, teléfonos ni datos de otras personas en la pestaña que publicas.

## Opción B (sin formulario)

Pega las piezas a mano en `src/data/galeria.json`, con los mismos campos:

```json
{
  "tipo": "Simulacro",
  "titulo": "Quiz de anatomía",
  "materia_o_contexto": "Anatomía",
  "autor": "[Nombre]",
  "grupo": "Martes",
  "sesion": 13,
  "enlace": "https://...",
  "fecha": "2026-11-03",
  "aprobado": true
}
```

Si las dos opciones tienen piezas, manda la hoja: cuando el CSV carga, reemplaza a las de `galeria.json`.
Si el CSV falla (sin red), el sitio muestra la última copia guardada en el navegador o, si no hay, las de `galeria.json`.

## Contador del reto comunitario (opcional)

Por defecto el número se escribe a mano en `config.json` → `reto_comunitario.contador`.
Si prefieres contarlo desde una hoja, usa las columnas de `reto-comunitario-hoja.csv`, publícala como CSV igual que arriba
y pega el enlace en `reto_comunitario.csv`. El sitio cuenta las filas con `sí` en `Aprobado`.
