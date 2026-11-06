/* ==========================================================
   MITO O DERECHO · lo que comparten las dos versiones del juego
   La versión plana (juego/plana/) y la arcade (juego/arcade/) leen este archivo:
   el contenido, las reglas y las funciones encendidas son las mismas,
   lo único que cambia es la interfaz
   ========================================================== */
window.JUEGO = (() => {
  const J = {
    nombre: "Mito o Derecho",               // Martes: se vota en el chat
    creditos: [],                           // cada grupo agrega su línea, ej: "Martes · nombre y mitos"
    // Hoja de Google con el contenido (compartida como "cualquier persona con el enlace puede ver")
    // Pega aquí solo el ID que va entre /d/ y /edit en el enlace de la hoja
    hojaId: "",
    hojaPestana: "contenido",
    formularioPregunta: "",                 // enlace del formulario "Deja tu pregunta"
    ronda: { mitos: 6, dilemas: 4 },        // cuántos salen por partida, al azar
    funciones: {
      progreso: true,       // Miércoles: barra de progreso
      compartir: true,      // Jueves: compartir el perfil por WhatsApp
      buscador: false,      // Viernes: buscador en Pregúntale
      accesible: false,     // Sábado 10-12: letra grande y alto contraste
      dejaPregunta: false   // Sábado 12-2: botón "Deja tu pregunta"
    },
    reglas: {
      segundos: 10,         // duración de la barra del bono por rapidez
      acierto: 100,         // puntos por acierto
      rapidez: 50,          // bono máximo por responder rápido
      racha: 25,            // bono por cada acierto seguido
      aliado: 50,           // puntos por cada situación del nivel 2
      vida: 50,             // bono final por cada vida que quede
      meta: 0.5,            // aciertos mínimos para pasar al nivel 2
      vidas: 3              // vidas por jugador, en cooperativo el equipo tiene una por jugador y 2 más
    },
    // Rango final según la parte de los puntos posibles que se logró
    rangos: [[0.75, "Leyenda de la U"], [0.52, "Aliado experto"], [0.3, "Aliado en formación"], [0, "Explorador"]],

    /* Contenido semilla, todo por validar con Bienestar Universitario
       Mismas columnas que la hoja de Google:
       tipo | texto | opciones | correcta | explicacion | ruta | fuente | estado | grupo
       Separador dentro de una celda: ||  */
    filas: [
      {"tipo": "mito", "texto": "En el TdeA existe una política de derechos humanos, diversidad y género", "opciones": "", "correcta": "derecho", "explicacion": "Existe y está firmada, es la Resolución Académica 003 de 2023", "ruta": "Pluridiversos, Bienestar Universitario", "fuente": "Res. Académica 003 de 2023, TdeA (Derechos Humanos, Diversidad y Género)", "estado": "por validar"},
      {"tipo": "mito", "texto": "Una broma no cuenta como acoso si nadie se quejó", "opciones": "", "correcta": "mito", "explicacion": "Que nadie se queje no quiere decir que no duela, muchas personas callan por miedo o por no saber a dónde ir", "ruta": "Bienestar Universitario", "fuente": "Ley 1257 de 2008", "estado": "por validar"},
      {"tipo": "mito", "texto": "Si tengo una discapacidad puedo pedir ajustes razonables para presentar un examen", "opciones": "", "correcta": "derecho", "explicacion": "Es un derecho y el TdeA tiene una ruta de ajustes razonables con formulario en línea", "ruta": "Ruta de ajustes razonables, Pluridiversos", "fuente": "Ley 1618 de 2013 y Res. 11 de 2016, TdeA (Atención Educativa a la Diversidad)", "estado": "por validar"},
      {"tipo": "mito", "texto": "Los temas de género solo le importan a las mujeres", "opciones": "", "correcta": "mito", "explicacion": "La equidad de género es de todas las personas, también de quien hoy no se siente afectado", "ruta": "Oferta de Pluridiversos", "fuente": "Res. Académica 003 de 2023, TdeA (Derechos Humanos, Diversidad y Género)", "estado": "por validar"},
      {"tipo": "mito", "texto": "Si el acoso fue por Teams o WhatsApp no cuenta porque no fue en la universidad", "opciones": "", "correcta": "mito", "explicacion": "Lo virtual también es la universidad, los lineamientos para educación superior incluyen lo que pasa en entornos digitales", "ruta": "Ruta TdeA sin Violencias Basadas en Género", "fuente": "Res. 14466 de 2022, Ministerio de Educación (VBG en educación superior)", "estado": "por validar"},
      {"tipo": "mito", "texto": "Pluridiversos también atiende a estudiantes de las sedes y regiones", "opciones": "", "correcta": "derecho", "explicacion": "El programa es para toda la comunidad TdeA y sus servicios se solicitan en línea", "ruta": "Formularios de Pluridiversos", "fuente": "Página de Pluridiversos, TdeA", "estado": "por validar"},
      {"tipo": "mito", "texto": "Si alguien usa silla de ruedas, llegar al salón es problema suyo", "opciones": "", "correcta": "mito", "explicacion": "La accesibilidad es responsabilidad de la institución, no de la persona", "ruta": "Ruta de ajustes razonables, Pluridiversos", "fuente": "Ley 1618 de 2013", "estado": "por validar"},
      {"tipo": "mito", "texto": "Pedir que te llamen por tu nombre identitario es un capricho", "opciones": "", "correcta": "mito", "explicacion": "Reconocer la identidad de alguien hace parte de la política de diversidad y género del TdeA", "ruta": "Pluridiversos", "fuente": "Res. Académica 003 de 2023, TdeA (Derechos Humanos, Diversidad y Género)", "estado": "por validar"},
      {"tipo": "mito", "texto": "Burlarse del acento de alguien de otra región es solo recocha", "opciones": "", "correcta": "mito", "explicacion": "Los regionalismos y las expresiones culturales son parte de la inclusión que el TdeA se comprometió a cuidar", "ruta": "Pluridiversos", "fuente": "Res. Académica 002 de 2023, TdeA (Educación Superior Inclusiva e Intercultural)", "estado": "por validar"},
      {"tipo": "mito", "texto": "Si no me pasó a mí, no puedo buscar orientación", "opciones": "", "correcta": "mito", "explicacion": "Si lo viste también puedes buscar orientación en Bienestar", "ruta": "Bienestar Universitario", "fuente": "Por confirmar con Bienestar", "estado": "por validar"},
      {"tipo": "mito", "texto": "Si una persona no parece tener una discapacidad, no puede pedir ajustes", "opciones": "", "correcta": "mito", "explicacion": "Hay discapacidades y condiciones que no se ven, y también tienen derecho a ajustes razonables", "ruta": "Ruta de ajustes razonables, Pluridiversos", "fuente": "Ley 1618 de 2013", "estado": "por validar"},
      {"tipo": "mito", "texto": "La lengua de señas colombiana está reconocida por la ley", "opciones": "", "correcta": "derecho", "explicacion": "Está reconocida como la lengua de la comunidad sorda en Colombia", "ruta": "Pluridiversos", "fuente": "Ley 982 de 2005", "estado": "por validar"},
      {"tipo": "mito", "texto": "Colombia se reconoce como un país con diversidad étnica y cultural", "opciones": "", "correcta": "derecho", "explicacion": "Lo dice la Constitución, y el TdeA trabaja con enfoque en etnias y pueblos originarios", "ruta": "Pluridiversos", "fuente": "Constitución Política, art. 7", "estado": "por validar"},
      {"tipo": "mito", "texto": "Todas las personas tienen derecho al libre desarrollo de su personalidad", "opciones": "", "correcta": "derecho", "explicacion": "Cómo te vistes, cómo te ves y cómo vives tu identidad hacen parte de ese derecho", "ruta": "Pluridiversos", "fuente": "Constitución Política, art. 16", "estado": "por validar"},
      {"tipo": "mito", "texto": "Si alguien se viste distinto, es normal que el grupo opine", "opciones": "", "correcta": "mito", "explicacion": "Opinar del cuerpo o la ropa de alguien sin que lo pida puede hacerle daño, el respeto va primero", "ruta": "Pluridiversos", "fuente": "Constitución Política, art. 16", "estado": "por validar"},
      {"tipo": "mito", "texto": "Discriminar a alguien por su orientación sexual puede ser un delito en Colombia", "opciones": "", "correcta": "derecho", "explicacion": "La ley antidiscriminación sanciona actos de discriminación por razones como el sexo o la orientación sexual", "ruta": "Bienestar Universitario", "fuente": "Ley 1482 de 2011", "estado": "por validar"},
      {"tipo": "mito", "texto": "Un piropo en el pasillo es solo un halago", "opciones": "", "correcta": "mito", "explicacion": "Si no se pidió o incomoda, deja de ser halago, y las universidades deben prevenir las violencias basadas en género", "ruta": "Ruta TdeA sin Violencias Basadas en Género", "fuente": "Res. 14466 de 2022, Ministerio de Educación (VBG en educación superior)", "estado": "por validar"},
      {"tipo": "mito", "texto": "En Colombia las personas trans pueden corregir el componente sexo en su registro civil", "opciones": "", "correcta": "derecho", "explicacion": "Existe un trámite ante notaría para hacerlo", "ruta": "Pluridiversos", "fuente": "Decreto 1227 de 2015", "estado": "por validar"},
      {"tipo": "mito", "texto": "Si la discriminación pasa en una sede regional, la política del TdeA no aplica", "opciones": "", "correcta": "mito", "explicacion": "Las políticas institucionales aplican a toda la comunidad TdeA", "ruta": "Pluridiversos", "fuente": "Res. Académica 003 de 2023, TdeA (Derechos Humanos, Diversidad y Género)", "estado": "por validar"},
      {"tipo": "mito", "texto": "La inclusión en la U solo se trabaja en el mes de la diversidad", "opciones": "", "correcta": "mito", "explicacion": "Pluridiversos hace acompañamiento todo el semestre, con seguimiento y alertas tempranas", "ruta": "Pluridiversos", "fuente": "Página de Pluridiversos, TdeA", "estado": "por validar"},
      {"tipo": "dilema", "texto": "En el grupo de WhatsApp de la materia alguien se burla del acento de un compañero de Vegachí\n¿Qué haces?", "opciones": "Le escribo por privado al compañero para ver cómo está||Respondo en el grupo: \"parce, ese chiste no da\"||Leo, sigo, pero me quedo pensando", "correcta": "Acompaña||Transforma||Observa", "explicacion": "Le cambias la noche a alguien, a veces eso basta para que no se sienta solo||El chiste pierde fuerza cuando alguien lo nombra con calma, otros se animan a escribir lo mismo||Notarlo ya es un paso, la próxima vez puede que digas algo", "ruta": "Regionalismos y expresiones culturales son parte de la inclusión en el TdeA", "fuente": "Res. Académica 002 de 2023, TdeA (Educación Superior Inclusiva e Intercultural)", "estado": "por validar"},
      {"tipo": "dilema", "texto": "Un compañero pidió que lo llamen por su nombre identitario y un profe insiste en el nombre de la lista\n¿Qué haces?", "opciones": "Lo llamo siempre por su nombre, aunque el profe no lo haga||Le pregunto si quiere apoyo para hablarlo con el profe o con Bienestar||En clase no digo nada, pero después lo saludo por su nombre", "correcta": "Transforma||Activa||Acompaña", "explicacion": "Cuando el grupo usa su nombre, el nombre se vuelve normal para todos||Preguntar primero respeta su decisión y le abre una ruta real||Un saludo con su nombre le dice que alguien lo ve", "ruta": "Pluridiversos, lineamiento de nombre identitario por confirmar", "fuente": "Res. Académica 003 de 2023, TdeA (Derechos Humanos, Diversidad y Género)", "estado": "por validar"},
      {"tipo": "dilema", "texto": "En el trabajo en grupo, cada idea que propone una compañera la repite un compañero y a él sí le hacen caso\n¿Qué haces?", "opciones": "Digo: \"como propuso ella hace un momento…\"||Hablo con ella después y le pregunto cómo lo vive||Me doy cuenta y lo anoto para estar pendiente", "correcta": "Transforma||Acompaña||Observa", "explicacion": "Devolver el crédito en voz alta cambia cómo escucha el grupo||Saber que alguien lo notó le quita peso a la situación||Ver el patrón es lo que permite cortarlo después", "ruta": "Equidad de género en espacios académicos", "fuente": "Res. Académica 003 de 2023, TdeA (Derechos Humanos, Diversidad y Género)", "estado": "por validar"},
      {"tipo": "dilema", "texto": "Alguien te cuenta que un docente le escribe por fuera de clase y la incomoda\n¿Qué haces?", "opciones": "Escucho sin juzgar y le pregunto qué necesita||Le cuento que existe la ruta TdeA sin Violencias Basadas en Género y le ofrezco acompañarla||Le pido consejo a alguien de confianza para saber qué hacer", "correcta": "Acompaña||Activa||Observa", "explicacion": "Escuchar primero es lo que más ayuda, la decisión de qué hacer es de ella||Conocer la ruta y ofrecer compañía hace que activarla sea menos difícil||Pedir consejo está bien, recuerda que la historia es de ella y ella decide con quién se comparte", "ruta": "Ruta TdeA sin Violencias Basadas en Género, Activa la ruta", "fuente": "Res. 14466 de 2022, Ministerio de Educación (VBG en educación superior)", "estado": "por validar"},
      {"tipo": "dilema", "texto": "Para el trabajo en grupo nadie invita al compañero con discapacidad auditiva\n¿Qué haces?", "opciones": "Lo invito a mi grupo y le pregunto cómo prefiere comunicarse||Propongo que el grupo trabaje por chat para que todos participen igual||Me doy cuenta y lo comento con alguien de confianza", "correcta": "Acompaña||Transforma||Observa", "explicacion": "Preguntarle cómo prefiere trabajar le dice que lo tienes en cuenta tal como es||Cambiar la forma de trabajar ayuda a todo el grupo, no solo a él||Notarlo ya es un paso, la próxima vez puede que lo invites tú", "ruta": "Ruta de ajustes razonables, Pluridiversos", "fuente": "Ley 1618 de 2013", "estado": "por validar"},
      {"tipo": "dilema", "texto": "En el chat de Teams alguien escribe un chiste sobre las mujeres en ingeniería y varios ponen risas\n¿Qué haces?", "opciones": "Escribo con calma: \"ese chiste no da\"||Le escribo por privado a una compañera de la carrera para ver cómo lo tomó||No pongo risa y me quedo pensando en eso", "correcta": "Transforma||Acompaña||Observa", "explicacion": "Una línea tranquila corta la cadena de risas y otros se animan a no seguirla||Saber que alguien lo notó le quita peso a la situación||No reírse también dice algo, aunque nadie lo vea", "ruta": "Equidad de género en espacios académicos", "fuente": "Res. Académica 003 de 2023, TdeA (Derechos Humanos, Diversidad y Género)", "estado": "por validar"},
      {"tipo": "dilema", "texto": "Un compañero que llegó de otro país te dice que no sabe si puede pedir apoyo en la U\n¿Qué haces?", "opciones": "Lo escucho y le pregunto qué necesita||Le cuento que Pluridiversos también trabaja con personas migrantes y le ofrezco acompañarlo a llenar el formulario||Le pregunto a Bienestar cómo funciona, sin dar su nombre", "correcta": "Acompaña||Activa||Observa", "explicacion": "Escuchar primero le da confianza para contar lo que de verdad necesita||Conocer la ruta y acompañar hace que pedir apoyo sea menos difícil||Averiguar sin exponerlo cuida su privacidad y te prepara para ayudar", "ruta": "Pluridiversos, alcance por confirmar", "fuente": "Página de Pluridiversos, TdeA", "estado": "por validar"},
      {"tipo": "dilema", "texto": "En una exposición alguien imita la forma de hablar de un compañero que tartamudea y varios se ríen\n¿Qué haces?", "opciones": "Digo con calma: \"dejémoslo terminar\"||Después de clase le pregunto cómo está||No me río y me fijo si vuelve a pasar", "correcta": "Transforma||Acompaña||Observa", "explicacion": "Devolverle el turno le recuerda a todos que lo importante es lo que tiene para decir||Un mensaje después puede pesar más que la burla||No sumarse a la risa ya cambia el ambiente", "ruta": "Pluridiversos", "fuente": "Res. 11 de 2016, TdeA (Atención Educativa a la Diversidad)", "estado": "por validar"},
      {"tipo": "dilema", "texto": "Una compañera te cuenta que se siente sola porque es la única mujer del grupo y no la toman en cuenta\n¿Qué haces?", "opciones": "La escucho y le pregunto qué le serviría||Le propongo buscar juntas los grupos de participación de Pluridiversos||Propongo en el grupo repartir los roles por igual", "correcta": "Acompaña||Activa||Transforma", "explicacion": "Sentirse escuchada es el primer paso para no sentirse sola||Encontrar otras personas que viven lo mismo cambia la forma de vivirlo||Cuando las reglas son claras, nadie queda por fuera por costumbre", "ruta": "Grupos de participación poblacional, Pluridiversos", "fuente": "Res. Académica 003 de 2023, TdeA (Derechos Humanos, Diversidad y Género)", "estado": "por validar"},
      {"tipo": "dilema", "texto": "Alguien comparte en el WhatsApp del curso una foto de otra persona para burlarse de su cuerpo\n¿Qué haces?", "opciones": "Escribo que no está bien y pido que la borren||Si conozco a la persona, le escribo por privado||Busco cómo se orienta una situación así en Bienestar", "correcta": "Transforma||Acompaña||Activa", "explicacion": "Muchas veces solo hace falta que una persona lo diga para que otros lo apoyen||Saber que alguien está de su lado le ayuda a no cargarlo sola||Conocer la ruta te prepara para ayudar si la persona lo quiere", "ruta": "Ruta TdeA sin Violencias Basadas en Género", "fuente": "Res. 14466 de 2022, Ministerio de Educación (VBG en educación superior)", "estado": "por validar"},
      {"tipo": "dilema", "texto": "Un compañero cuenta que tiene más tiempo en los exámenes por un ajuste razonable y otro dice \"eso es ventaja\"\n¿Qué haces?", "opciones": "Explico que es un ajuste para estudiar en igualdad, no una ventaja||Le digo al compañero que tiene todo el derecho a pedirlo||Averiguo cómo funciona la ruta de ajustes razonables", "correcta": "Transforma||Acompaña||Activa", "explicacion": "Nombrarlo bien ayuda a que el grupo deje de verlo como un privilegio||Un respaldo a tiempo le quita la culpa de usar su derecho||Saber cómo funciona te deja explicarlo con datos la próxima vez", "ruta": "Ruta de ajustes razonables, Pluridiversos", "fuente": "Ley 1618 de 2013", "estado": "por validar"},
      {"tipo": "dilema", "texto": "Al armar grupos, alguien pide cambiarse para no trabajar con un compañero por rumores sobre su orientación sexual\n¿Qué haces?", "opciones": "Me hago con él y lo trato como a cualquiera||Digo en el grupo que un rumor no es razón para dejar a nadie por fuera||Si el rechazo sigue, busco orientación en Pluridiversos", "correcta": "Acompaña||Transforma||Activa", "explicacion": "Que alguien elija trabajar contigo dice más que cualquier rumor||Ponerlo en palabras frena el rechazo antes de que se vuelva costumbre||Saber a dónde ir hace que no tengas que resolverlo solo", "ruta": "Pluridiversos", "fuente": "Res. Académica 003 de 2023, TdeA (Derechos Humanos, Diversidad y Género)", "estado": "por validar"},
      {"tipo": "perfil", "texto": "Observa", "opciones": "Mañana fíjate en quién habla menos en tu clase", "correcta": "", "explicacion": "Empiezas a notar lo que otros dejan pasar, y todo cambio empieza por ahí", "ruta": "", "fuente": "", "estado": "por validar"},
      {"tipo": "perfil", "texto": "Acompaña", "opciones": "Mañana escríbele a alguien que no ha vuelto a clase", "correcta": "", "explicacion": "Sabes escuchar, y eso hace que la gente no se sienta sola", "ruta": "", "fuente": "", "estado": "por validar"},
      {"tipo": "perfil", "texto": "Activa", "opciones": "Mañana guarda en tu celular el enlace de Pluridiversos", "correcta": "", "explicacion": "Conoces la ruta y la usas, contigo nadie se queda sin saber a dónde ir", "ruta": "", "fuente": "", "estado": "por validar"},
      {"tipo": "perfil", "texto": "Transforma", "opciones": "Mañana comparte este juego con tu grupo de la materia", "correcta": "", "explicacion": "Cambias el ambiente a tu alrededor, donde estás, la gente se siente más libre", "ruta": "", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "¿A dónde voy si me pasó algo?", "opciones": "", "correcta": "", "explicacion": "Empieza por Bienestar Universitario, el programa Pluridiversos tiene un formulario de solicitud de acompañamiento diferencial\nSi es una violencia basada en género existe la ruta TdeA sin VBG\nSi estás en peligro ahora, llama al 123", "ruta": "Pluridiversos y ruta TdeA sin VBG", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "¿Puedo usar mi nombre identitario en clase y en las plataformas?", "opciones": "", "correcta": "", "explicacion": "La política de diversidad y género del TdeA respalda el reconocimiento de la identidad\nEl paso a paso para las plataformas está por confirmar con Bienestar", "ruta": "Pluridiversos", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "¿Qué hago si fue un profe?", "opciones": "", "correcta": "", "explicacion": "También aplica la ruta, no importa quién haya sido\nPuedes buscar orientación en Bienestar sin tener todo resuelto", "ruta": "Ruta TdeA sin VBG", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "¿Qué son los ajustes razonables?", "opciones": "", "correcta": "", "explicacion": "Son cambios en cómo se evalúa o se enseña para que una persona con discapacidad o con una condición particular estudie en igualdad\nSe piden por un formulario en línea de Pluridiversos", "ruta": "Ruta de ajustes razonables", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "¿Pluridiversos es solo para personas LGBTIQ+?", "opciones": "", "correcta": "", "explicacion": "No, trabaja diversidades e identidades, género, discapacidad, personas migrantes, regionalismos, etnias y pueblos originarios", "ruta": "Pluridiversos", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "Estudio en una sede o región, ¿también me atienden?", "opciones": "", "correcta": "", "explicacion": "Los servicios se solicitan en línea\nEl alcance exacto por sede está por confirmar con Bienestar", "ruta": "Formularios de Pluridiversos", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "¿Qué es Pluridiversos?", "opciones": "", "correcta": "", "explicacion": "Es el programa de Bienestar Universitario que acompaña el acceso, la permanencia, el egreso y la empleabilidad con enfoque diferencial, para estudiantes, egresados, docentes y administrativos", "ruta": "Pluridiversos", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "¿Qué es una violencia basada en género?", "opciones": "", "correcta": "", "explicacion": "Es cualquier acción que hace daño a alguien por su género, su orientación sexual o su identidad: comentarios, acoso, presión, amenazas o agresiones, en persona o por redes", "ruta": "Ruta TdeA sin VBG", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "¿Tengo que tener pruebas para pedir ayuda?", "opciones": "", "correcta": "", "explicacion": "No necesitas tener todo resuelto para buscar orientación\nQué se necesita para un proceso formal te lo explican en Bienestar", "ruta": "Bienestar Universitario", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "¿Lo que cuente en Bienestar es confidencial?", "opciones": "", "correcta": "", "explicacion": "La confidencialidad y sus límites te los explican en la primera atención", "ruta": "Bienestar Universitario", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "Me siento mal emocionalmente, ¿a dónde voy?", "opciones": "", "correcta": "", "explicacion": "Bienestar Universitario tiene acompañamiento para eso\nSi sientes que estás en peligro ahora, llama al 123", "ruta": "Bienestar Universitario", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "¿Qué hago si alguien me cuenta que le pasó algo?", "opciones": "", "correcta": "", "explicacion": "Escucha sin juzgar, no le pidas detalles que no quiera dar, cuéntale que existe la ruta y respeta lo que decida\nNo lo cuentes a otras personas sin su permiso", "ruta": "Ruta TdeA sin VBG y Pluridiversos", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "¿Qué es el lenguaje inclusivo y es obligatorio?", "opciones": "", "correcta": "", "explicacion": "Es hablar y escribir sin dejar a nadie por fuera\nSi el TdeA tiene un lineamiento propio está por confirmar", "ruta": "Pluridiversos", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "¿Hay grupos o espacios para participar?", "opciones": "", "correcta": "", "explicacion": "Sí, Pluridiversos tiene grupos de participación poblacional, cátedras y semilleros en el Pluri-Lab", "ruta": "Inscripción a la oferta de Pluridiversos", "fuente": "", "estado": "por validar"},
      {"tipo": "pregunta", "texto": "Soy de una comunidad indígena o afro, ¿hay apoyo para mí?", "opciones": "", "correcta": "", "explicacion": "Sí, Pluridiversos trabaja con enfoque diferencial en etnias y pueblos originarios y puedes pedir acompañamiento por formulario", "ruta": "Solicitud de acompañamiento diferencial", "fuente": "", "estado": "por validar"}
    ],

    // Botón "¿Necesitas ayuda ahora?"
    ayuda: [
      {"t": "Si estás en peligro ahora", "d": "Línea 123, emergencias"},
      {"t": "Violencias contra las mujeres", "d": "Línea 155, orientación gratuita en todo el país"},
      {"t": "Bienestar Universitario TdeA", "d": "Programa Pluridiversos, solicitudes en línea", "url": "https://tdea.edu.co/micrositios/bienestar-universitario/pluridiverso/"},
      {"t": "Ruta TdeA sin Violencias Basadas en Género", "d": "Por confirmar"},
      {"t": "Apoyo psicológico de Bienestar", "d": "Por confirmar"}
    ]
  };

  J.partes = t => (t || "").split("||").map(x => x.trim()).filter(Boolean);
  J.de = tipo => J.filas.filter(r => (r.tipo || "").toLowerCase().trim() === tipo && (r.estado || "").toLowerCase() !== "descartada");
  J.azar = (arr, n) => arr.map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]).slice(0, n || arr.length);
  J.nuevaRonda = () => ({ mitos: J.azar(J.de("mito"), J.ronda.mitos), dilemas: J.azar(J.de("dilema"), J.ronda.dilemas) });
  J.vidasDe = (modo, jugadores) => modo === "coop" ? jugadores + J.reglas.vidas - 1 : J.reglas.vidas;

  /* El rango depende de cuántos puntos se pueden hacer en la ronda */
  J.maxPuntos = (mitos, dilemas) => {
    const R = J.reglas;
    return mitos * (R.acierto + R.rapidez) + R.racha * mitos * (mitos - 1) / 2 + dilemas * R.aliado + R.vidas * R.vida;
  };
  J.rango = (puntos, max) => {
    const f = puntos / Math.max(1, max);
    return (J.rangos.find(([desde]) => f >= desde) || J.rangos[J.rangos.length - 1])[1];
  };

  /* Perfil de aliado: el que más se eligió en el nivel 2; en empate gana el primero de esta lista */
  J.perfilDe = votos => {
    const orden = ["Transforma", "Activa", "Acompaña", "Observa"];
    const gana = orden.reduce((a, b) => (votos[b] || 0) > (votos[a] || 0) ? b : a, "Observa");
    const perfiles = J.de("perfil");
    return perfiles.find(x => x.texto === gana) || perfiles[0] || { texto: gana, explicacion: "", opciones: "" };
  };

  function csv(texto) {
    const filas = []; let fila = [], campo = "", com = false;
    for (let i = 0; i < texto.length; i++) {
      const c = texto[i];
      if (com) { if (c === '"') { if (texto[i + 1] === '"') { campo += '"'; i++; } else com = false; } else campo += c; }
      else if (c === '"') com = true;
      else if (c === ",") { fila.push(campo); campo = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && texto[i + 1] === "\n") i++; fila.push(campo); filas.push(fila); fila = []; campo = ""; }
      else campo += c;
    }
    if (campo || fila.length) { fila.push(campo); filas.push(fila); }
    const enc = filas.shift().map(h => h.trim().toLowerCase());
    return filas.filter(f => f.some(x => x.trim())).map(f => Object.fromEntries(enc.map((h, i) => [h, (f[i] || "").trim()])));
  }

  /* Si hay hoja, la lee; devuelve true si el contenido quedó en vivo */
  J.cargar = async () => {
    if (!J.hojaId) return false;
    try {
      const url = `https://docs.google.com/spreadsheets/d/${J.hojaId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(J.hojaPestana)}&t=${Date.now()}`;
      const r = await fetch(url); if (!r.ok) throw 0;
      const filas = csv(await r.text());
      if (filas.length > 3) { J.filas = filas; return true; }
    } catch (e) { /* sin red: se queda el contenido semilla */ }
    return false;
  };

  return J;
})();
