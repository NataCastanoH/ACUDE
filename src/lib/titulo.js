// Regla heredada de Base44: la palabra clave del título va en lima.
// Si no se indica cuál, se pinta «IA» y si no aparece, la última palabra.
export function partirTitulo(texto, destacado) {
  if (destacado === false) return [texto, '', ''];
  if (destacado) {
    const i = texto.lastIndexOf(destacado);
    if (i >= 0) return [texto.slice(0, i), destacado, texto.slice(i + destacado.length)];
  }
  const ia = texto.search(/(?<![\p{L}])IA(?![\p{L}])/u);
  if (ia >= 0) return [texto.slice(0, ia), 'IA', texto.slice(ia + 2)];
  const m = texto.match(/^(.*\s)?(\S+?)([?!.:,]*)$/s);
  return m ? [m[1] ?? '', m[2], m[3]] : [texto, '', ''];
}
