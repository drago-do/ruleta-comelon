
📄 Documento de Requerimientos: "La Ruleta Tragona 3000"
1. Objetivo del Proyecto
Crear una aplicación web humorística e interactiva que permita a los usuarios subir fotos de un menú de restaurante, extraiga automáticamente las opciones de comida y bebida usando inteligencia artificial, y las coloque en dos ruletas 3D. El usuario girará las ruletas para que el "destino" decida qué va a comer y beber.
2. Arquitectura Técnica Sugerida
 * Frontend: React.js (Nextjs) (para manejar el estado de las fotos y el texto) + Three.js (o React Three Fiber) para renderizar y animar las ruletas 3D de forma fluida en el navegador.
 * Procesamiento de IA (OCR y Clasificación): Uso de la API de OpenRouter como proxy.
 * Modelo de IA: google/gemini-3.1-flash-lite-preview. Es el modelo ideal porque es multimodal (acepta imágenes), rapidísimo, extremadamente barato y lo suficientemente inteligente para no solo extraer texto, sino devolverlo formateado en un JSON separando comidas de bebidas.
 * Estilo Visual: Caricaturesco, colorido, estilo "casino de comida rápida" o "game show" exagerado.
🧑‍💻 Historias de Usuario (HUs)
HU1: Subir fotos del menú
Como usuario indeciso,
Quiero poder subir una o varias fotos desde la galería de mi celular o cámara,
Para que el sistema tenga el menú del cual elegir.
 * Criterios de Aceptación:
   * La interfaz debe tener un botón gigante y llamativo de "Subir Menú".
   * Debe aceptar formatos JPG, PNG y WebP.
   * Debe mostrar miniaturas de las imágenes subidas antes de procesar.
HU2: Extracción y clasificación de texto (Integración OpenRouter)
Como sistema,
Quiero enviar las imágenes a OpenRouter usando google/gemini-3.1-flash-lite-preview,
Para que extraiga los platillos y bebidas y los devuelva en un formato estructurado.
 * Criterios de Aceptación:
   * El sistema debe mostrar una animación de carga graciosa (ej. "Leyendo los jeroglíficos del chef...").
   * El prompt del sistema debe pedir que ignore los precios y solo traiga nombres de platos, separados en los arrays comida y bebidas.
   * Si la IA falla o no detecta nada, debe mostrar un mensaje de error chistoso y permitir reintentar.
HU3: Renderizado de las Ruletas 3D
Como jugador,
Quiero ver dos ruletas en 3D (una de comida y otra de bebidas) con las opciones extraídas,
Para que la experiencia sea visualmente atractiva y se sienta como un juego de azar.
 * Criterios de Aceptación:
   * Las ruletas deben generarse dinámicamente dividiendo sus "rebanadas" según la cantidad de items extraídos.
   * Los textos de los platillos deben aplicarse como texturas sobre la ruleta 3D o flotar sobre ella.
   * Deben tener iluminación y sombras básicas para resaltar el efecto 3D.
HU4: Girar la Ruleta
Como jugador,
Quiero un botón de "INICIAR" que haga girar las ruletas con físicas realistas,
Para que haya suspenso antes de conocer mi comida.
 * Criterios de Aceptación:
   * El botón debe iniciar el giro con una aceleración rápida y una desaceleración gradual (efecto easing).
   * Cada vez que la ruleta pasa por el indicador (la flecha), debe hacer un sonido de "clack".
   * Ambas ruletas deben detenerse en tiempos ligeramente diferentes para aumentar el suspenso.
HU5: Pantalla de Resultados
Como jugador,
Quiero ver el resultado de forma exagerada y victoriosa una vez que las ruletas se detengan,
Para que sea un momento divertido para compartir.
 * Criterios de Aceptación:
   * Aparece un modal o texto gigante en pantalla con el combo ganador (ej. "¡El universo ha hablado! Comerás: Tacos de Tripa con: Licuado de Fresa").
   * Debe haber efectos de partículas (confeti) y un sonido de celebración.
🎨 Lista de Assets a Crear
Para que el juego luzca y suene genial, necesitarás crear o conseguir los siguientes assets.
Assets 3D (Para usar en Three.js)
 * La Ruleta (Cilindro/Disco): Un modelo 3D de una ruleta de casino, pero tematizada. Puedes hacerla parecer un plato de comida gigante o una tapa de olla.
 * El Puntero (Flecha): El objeto que marca el resultado. Puede ser un tenedor 3D gigante, un cuchillo o una mano regordeta apuntando.
 * Fondo del Escenario (Opcional): Un modelo de un mantel de cuadros de picnic curvo, o paredes de un restaurante retro.
Assets 2D y UI
 * Botón Principal de "GIRAR": Un botón estilo caricatura, gordito, rojo, que parezca apretable (con estados Hover y Pressed).
 * Iconos de Estado de Ánimo: Caritas divertidas babeando o con cara de hambre para decorar la pantalla de carga.
 * Texturas de Materiales: * Madera o plástico brillante para la ruleta.
   * Metálico reflectante para el tenedor/puntero.
 * Partículas de Confeti: Pequeños sprites de rebanadas de pizza, hamburguesitas, y refrescos en lugar del clásico confeti de papel para cuando el usuario gana.
Assets de Audio (SFX y Música)
 * Música de Fondo: Música estilo Elevator Music (Bossa Nova o Jazz suave de elevador) pero con un ritmo un poco tonto, que suene mientras se lee el menú.
 * SFX Clack-Clack-Clack: El sonido clásico de la pestaña de goma golpeando los clavos de la ruleta mientras gira (rápido al principio, lento al final).
 * SFX Redoble de Tambores: Para acompañar los últimos segundos del giro.
 * SFX de Celebración: Un sonido de "¡Ta-daaa!", trompetas victoriosas, o un coro de ángeles cantando la palabra "Comidaaa".
 * SFX de Decepción (Easter Egg): Un sonido de trombón triste (womp womp) por si la IA detecta que le tocó "Ensalada verde" o "Agua simple" (puedes programar esto como un detalle gracioso).



6. Reporte de Dependencias de Assets por Iteración
Para garantizar una integración fluida entre el desarrollo técnico y la creación de recursos visuales y sonoros, al finalizar cada iteración (sprint) se deberá generar un reporte de estado que incluya:
 * Assets Integrados: Listado de los recursos (3D, 2D, Audio) que fueron implementados y probados exitosamente durante la iteración actual.
 * Dependencias Bloqueantes: Identificación detallada de los assets faltantes que son estrictamente necesarios para poder iniciar o completar las Historias de Usuario programadas para la siguiente iteración.
 * Ajustes Técnicos y Optimización: Solicitudes de modificación sobre assets ya entregados (ej. reducción del número de polígonos en el modelo de la ruleta, compresión de los archivos de audio, o corrección de dimensiones en la UI).
 * Mapeo con HUs: Cada asset reportado, ya sea como faltante o completado, debe estar vinculado directamente al ID de su Historia de Usuario correspondiente (ej. "Modelo 3D del Puntero - Dependencia bloqueante para HU3").
