# Verificación del frontend

## Portada de imágenes y nueva organización — 2026-09-28

- Los dos adjuntos recibidos son idénticos (SHA-256 B892CB2F…A4F1AB12). Se adapta una sola vez su image-stream-hero: fotos comerciales optimizadas, geometría CSS, distribución completa desde el inicio y botón de pausa. La animación se detiene fuera de pantalla; la preferencia de movimiento reducido la pausa en una composición ya formada. Sin dependencias nuevas ni actualizaciones React por frame.
- Se enfoca la portada en imágenes, carruseles y videos. El círculo se mueve a una sección secundaria, compacta, sin secuencia de entrada. Se retiran de la página las secciones redundantes de problemas y beneficios, conservando sus archivos; se mantienen identidad, navegación y equipo. Los enlaces internos dejan de sumar dos veces el espacio reservado para el encabezado.
- `VERCEL=1 next build` aprobado con compilación y TypeScript; ESLint de los 12 archivos TS/TSX modificados y `git diff --check` aprobados. La revisión posterior cambia solo el fondo ilustrativo del cierre y el espacio de los enlaces internos. No es un deploy remoto.
- Navegador: revisión en 390×844 y 1440×900, sin desbordamiento horizontal; las 18 imágenes de los dos lados de la portada cargan, pausa efectiva verificada por animation-play-state=paused y enlaces internos válidos. Recarga final sin nuevos errores ni advertencias de consola. Movimiento reducido cubierto por CSS, sin emular la preferencia del sistema. Capturas guardadas fuera del repositorio en el directorio de revisión local.
- Solo cambios locales en codex/landing-commercial-local; sin push ni modificaciones de producción. Reversión: restaurar Hero y Home y retirar ImageStreamHero/ContentShowcase junto con sus estilos.

## Planes centrados en contenido — 2026-09-28

- Propuesta de lanzamiento: Imágenes US$9/mes (30 imágenes); Imágenes + videos US$15/mes (60 imágenes y 4 videos); Contenido + redes US$29/mes (100 imágenes y 8 videos, más una cuenta de Instagram). La gestión de redes se presenta como futura y secundaria. Precio antes de impuestos; cada lámina cuenta como una imagen, videos de hasta 60 segundos y dos rondas de cambios incluidas. Los datos compartidos alimentan tarjetas y preguntas frecuentes.
- Son precios y cantidades propuestos, pendientes de validar contra costos y uso real. Este cambio no implementa facturación ni cuotas en la API. La landing indica que el prototipo no cobra y no conecta/programa redes todavía. La comparación usa el precio mensual específico de ChatGPT Plus (US$20) con enlace a la fuente oficial, consultada el 28/09/2026; no afirma un promedio del mercado ni equivalencia de funciones.
- TypeScript y ESLint de los archivos afectados aprobados en la revisión local conjunta. Navegador: se ven precios y cantidades, los tres planes conservan sus enlaces y la tarjeta clara tiene foco oscuro visible. No se modifica autenticación, chat ni backend. Reversión: retirar los nuevos datos de planes y restaurar tarjetas, FAQ y bloque de redes.

## Portada sin secuencia de entrada — 2026-09-28

- Se eliminan las fases dispersa/fila y sus temporizadores. Las fotos aparecen directamente en círculo, una vez medida la sección, evitando también mostrar coordenadas de escritorio brevemente en celular. Se conserva el movimiento al desplazar la página.
- ESLint del componente, `tsc --noEmit` y `git diff --check`: aprobados. Recarga local: 12 fotos en sus posiciones finales, sin errores ni advertencias de consola. Cambio solo local, sin push.

## Landing comercial, revisión local — 2026-09-28

- Portada con fotos de comercios que se organizan al entrar y cambian de posición al desplazar la página. Adaptación del componente aportado, con `motion/react` ya instalado: sin dependencias nuevas, aleatoriedad al renderizar ni bloqueo del scroll. Se conservan navegación, rutas y tipografía; el texto y los botones quedan visibles durante la animación.
- Textos más cercanos a comerciantes y emprendedores; la explicación se organiza en tres pasos. Se mantienen precios sin definir y se indica que conectar/publicar en redes está previsto para más adelante. Los enlaces de contacto ficticios se reemplazan por el chat y preguntas frecuentes.
- `tsc --noEmit`, ESLint de los 15 archivos TSX modificados y `git diff --check`: aprobados. `VERCEL=1 next build`: aprobado, incluida compilación y TypeScript; no es un despliegue en Vercel. No se modifican dependencias, configuración del backend ni autenticación. El lint global conserva la limitación preexistente documentada abajo.
- Navegador local: revisión visual en 390×844, 768×1024 y 1440×900; sin desbordamiento horizontal. Las 12 fotos de la portada cargan, los enlaces internos tienen destino, el menú móvil abre/cierra al elegir una sección y el acordeón de preguntas funciona. Una pestaña nueva no registra errores de hidratación ni advertencias. Se contempla movimiento reducido en el componente y CSS; no se ha emulado esta preferencia del sistema en el navegador.
- Cambios conservados en la rama local `codex/landing-commercial-local`, sin push ni publicación. Reversión: revertir esta revisión de landing; no afecta chats, adjuntos ni medios generados.

## Login sin usuario precargado y carruseles — 2026-09-28

- El usuario del login empieza vacío y conserva autocomplete=username para credenciales guardadas por el navegador. La prueba de CSRF/rechazo escribe explícitamente el usuario; 8 pruebas de auth aprobadas.
- Las imágenes de cada mensaje aparecen seguidas; abrir cualquier lámina conserva el orden del carrusel y permite botones, flechas de teclado y swipe horizontal, con límites al principio/final. Las descargas SVG/PNG cambian con la lámina activa. Se deduplican SVG y PNG de la misma imagen. Archivos y galería usan carouselId/slideIndex del backend para evitar mezclar revisiones o proyectos.
- npm test: 36 pruebas aprobadas, 24,36 s, incluidas navegación táctil/teclado, descarga por lámina y agrupación. Build Vercel (VERCEL=1, QUARK_API_URL público) aprobado con TypeScript. ESLint de todos los archivos modificados aprobado. Lint global tiene un error preexistente react-hooks/set-state-in-effect en instagram-inbox.tsx:28 y cuatro advertencias ajenas a este cambio; no se declara aprobado.
- Reversión: retirar gallery y metadatos de agrupación del visor, mensajes, archivos y galería, junto con sus pruebas. Los archivos SVG/PNG y chats almacenados se conservan. La revisión del login se puede revertir de forma independiente.

## Empaquetado Vercel y Docker — 2026-09-28

- El error aportado ocurrió en onBuildComplete de Vercel, después de compilación/TypeScript. La configuración forzaba output:standalone; coincide con [Next.js #96646](https://github.com/vercel/next.js/issues/96646). next.config.ts usa salida estándar cuando VERCEL=1 y conserva standalone fuera de esa plataforma. No se cambiaron dependencias, rutas, autenticación ni rewrites.
- PowerShell `$env:VERCEL='1'; npm run build`: aprobado (compilación 1,364 s, TypeScript 6,0 s). El manifiesto real `.next/required-server-files.json` se comprobó mediante Node: output no es standalone. Después, quitando VERCEL, `npm run build`: aprobado (compilación 1,378 s, TypeScript 5,9 s); el manifiesto tiene output:standalone y existe `.next/standalone/server.js`, necesario para Docker. Ambas ejecuciones generaron /chat dinámico y /login estático. `npx eslint next.config.ts`: aprobado.
- Los builds locales no ejecutan el adaptador remoto de Vercel. Su empaquetado final debe confirmarse en un despliegue de la nueva revisión; no se presenta como un deploy remoto aprobado. README documenta variables de sistema, QUARK_API_URL, directorio de salida automático y la comprobación posterior de login/adjuntos.
- Reversión: restaurar la propiedad output anterior de next.config.ts y retirar estas notas/guía Vercel. No cambia datos ni Dockerfile; reintroduce el conflicto reportado al empaquetar en Vercel.

## Markdown y medios — 2026-09-26

- `npx vitest run tests/messages.test.tsx`: 5 pruebas aprobadas. Negritas, cursivas, listas, títulos, tablas, enlaces seguros, rechazo de HTML/URLs ejecutables e imágenes remotas, adjuntos del usuario y PNG/SVG con error y reintento.
- TypeScript y build Docker de Next.js aprobados. ESLint de los componentes modificados: sin errores; advertencia de img nativo en el visor de medios, que conserva las URLs y el comportamiento de PNG/SVG.
- Navegador real: la respuesta de capacidades mostró cinco etiquetas strong y cinco elementos de lista, sin asteriscos literales. Una imagen PNG enviada quedó visible dentro del mensaje del usuario y conservó sus dimensiones de 1080 × 1080.
- Reversión: revertir MarkdownMessage, MediaImage, MessageList, integración en galería y atributo del contenedor de scroll, junto con dependencias y pruebas. Los archivos y mensajes del backend no se borran.

## Envío de adjuntos y estado del chat — 2026-09-26

- `npm test`: 13 pruebas aprobadas. Incluye envío de una imagen sin texto, conservación del borrador al rechazar el pedido, cargas parciales, límite de tamaño, prevención de doble envío, restauración del chat, respuestas tardías de otro chat y fallo de refresco después de una aceptación válida.
- TypeScript y build Docker aprobados; desplegado junto con backend 5043cc2, que persiste los adjuntos en su turno.
- Navegador real: se cargó brief-slide-01.png y se envió sin texto. La imagen pasó al historial y el compositor quedó limpio. El agente describió correctamente la portada de café y propuso continuar el contenido. Al recargar, el chat seleccionado y la imagen siguieron visibles. Recursos anteriores quedan accesibles en un desplegable.
- El formulario no vuelve a enviar un pedido aceptado si después falla el refresco. Los datos de un chat ya abandonado no reemplazan el chat seleccionado. El historial no fuerza el desplazamiento cuando la persona está leyendo mensajes anteriores.
- Capturas de prueba guardadas fuera del repositorio frontend, en la carpeta temporal ignorada del backend. No se suben recursos del usuario ni imágenes generadas a Git.
- Reversión: revertir ChatInputForm, los cambios de estado de ChatLayout y sus pruebas/documentación. La sesión puede conservar la clave quark:last-chat sin efecto, y los mensajes con adjuntos permanecen en el backend.

## Detalles de la pieza — 2026-09-26

- `npm test`: 19 pruebas aprobadas; seis nuevas cubren inputs sin opciones, aparición de texto exacto, conservación al cambiar de modo, guardado parcial, actualización de versiones, pasos que desaparecen y recarga tras conflictos.
- `npx tsc --noEmit`, ESLint del editor/pruebas y `docker compose build web`: aprobados. Contenedor web actualizado localmente.
- Navegador real: se completaron tema, formato, colores y texto exacto, con un área de texto visible y editable. El resumen mostró texto y colores guardados; no se confirmó producción. Captura fuera del repositorio: `.tmp/detalles-texto-editable.png` en el backend.
- Las actualizaciones periódicas conservan el texto sin guardar. Una versión guardada más nueva se carga; ante un conflicto, Recargar opciones guardadas consulta al servidor. Las etapas usan la identidad de su grupo para evitar saltos cuando cambia el conjunto de preguntas.
- Reversión: revertir CreativeBriefEditor y sus pruebas/documentación. El contrato HTTP se conserva y no se eliminan datos del backend.

## 2026-09-26 — Vistas previas accesibles de archivos

- `npm test -- tests/resource-preview.test.tsx`: **3 pruebas aprobadas**. Verifican diálogo cerrado sin reproductores, vista SVG con ambas descargas, PDF con portada/enlace original, cierre con Escape y miniatura fallida sin botones anidados.
- TypeScript y ESLint de componentes nuevos aprobados. El build Docker de Next.js incluye el primitive oficial Radix Dialog de Animate UI; su licencia MIT + Commons Clause y copyright están preservados en licenses/animate-ui.LICENSE.txt.
- Runtime integrado: navegador abrió PDF desde su tarjeta; la vista conserva portada y descarga. Desde Biblioteca se abrió Prueba SVG editorial y se verificaron enlaces SVG y PNG. En 390×844, la vista de imagen midió 366 px y quedó entre x=12 y x=378, sin salir del viewport.
- Reversión: retirar ResourcePreview, ConversationFiles, primitives/context/hook locales y sus pruebas/atribución, con los cambios de integración que los importen. MediaImage mantiene retry por defecto; no requiere eliminar archivos o datos del backend.

## 2026-09-26 — Chat, preguntas y biblioteca

- `npm test`: **25 pruebas aprobadas**. Cubren preguntas individuales, texto exacto editable, elección con guardado inmediato, revisión/edición antes de crear, borradores durante polling, conflictos, respuesta desde el compositor, adjuntos pegados y arrastrados, ausencia de selector, mensajes Markdown, miniaturas y filtros/búsqueda de biblioteca.
- `npx tsc --noEmit`, ESLint de todos los archivos modificados y `docker compose build web`: aprobados. ESLint conserva una advertencia por img nativa, usada para medios locales con fallback SVG/PNG y cargas diferidas en miniaturas.
- Runtime final desplegado en localhost:8010/chat: una imagen sin tema preguntó el tema; se respondió desde el cuadro de mensajes y aparecieron cuatro proporciones como botones. Las preguntas y respuestas mantienen sus roles en el historial. Elección, revisión, recarga y cancelación se comprobaron sin renderizar. Captura ignorada fuera del frontend: .tmp/quark-ux-final.png en el backend.
- Portapapeles real: se pegó PNG, se envió con Hola, apareció en su turno y se limpió el compositor. PDF real: la portada abre con un clic; el video basado en ese documento llegó como tarjeta y a Archivos. El reproductor mostró duración 10 s y dimensiones 1080×1920. Escape cerró la vista y devolvió el foco a su tarjeta; el chat quedó con cero reproductores y cero selectores.
- Biblioteca: se abrió una pieza vectorial con descargas SVG/PNG; el filtro Videos mostró únicamente tarjetas de video. No se reproducen videos desde la cuadrícula. Las miniaturas fuera de pantalla cargan cuando se necesitan.
- Móvil 390×844: ancho del documento 390 px sin desbordamiento; menú con búsqueda, Escape y devolución de foco al botón de apertura. Mientras el menú está abierto, el historial y el compositor dejan de aparecer en el árbol accesible. Las vistas previas quedan dentro del viewport. Captura ignorada: .tmp/quark-ux-mobile.png en el backend. Se restableció el viewport al terminar.
- Reversión: revertir la integración conversacional en ChatLayout, editor, compositor, historial, header/sidebar y biblioteca junto con pruebas/README. Los componentes de vista previa pueden quedarse disponibles. La API conserva compatibilidad de fields/answers; conversaciones, adjuntos y exportaciones no se eliminan.

## 2026-09-28 — Ingreso privado y cierre de sesión

- /login permite ingresar como admin, admite gestores de contraseñas, informa falta de configuración/errores sin exponer credenciales y limpia el campo tras rechazo. No hay signup ni almacenamiento de tokens en localStorage. Layout del servidor consulta /api/auth/check: una cookie presente no basta. El helper de API envía cookies del mismo origen y CSRF para operaciones que cambian datos, incluidos uploads; conserva el boundary multipart. 401 redirige al login; Salir revoca la sesión y vuelve mediante navegación completa.
- `npm test`: **33 aprobadas, siete archivos, 26,13 s**. Los ocho casos nuevos cubren acceso no configurado, nonce actualizado/error de contraseña, multipart/CSRF, lecturas, chat anónimo, cookie inválida, backend caído y validación correcta. ESLint de archivos modificados: aprobado tras usar Link para la marca; TypeScript incluido en el build: aprobado. `npm run build` final: compilación **1,469 s**, TypeScript **10,2 s**, /chat dinámico y /login estático.
- Runtime contra la API descartable nueva: standalone real de producción en 127.0.0.1:8020 con proxy a 8021. Chat anónimo 307 a /login, login 200, chat autenticado 200/private-no-store, upload PNG 201, preview privada 200/anónima 401, logout 200 y acceso posterior 401. Navegador: error genérico al ingresar mal, contraseña borrada, ingreso correcto abre chat, Salir vuelve al login y /chat vuelve a redirigir. Captura ignorada en el backend .tmp/auth-login.png. Sin DeepSeek ni proyectos del usuario; estos procesos locales se detienen después de verificar.
- Docker Desktop local no respondió; no se desplegó el nuevo contenedor habitual ni se verificó TLS público. Compose agrega QUARK_API_URL al runtime para la validación desde el servidor. Ambos repositorios requieren estas versiones y configurar la cuenta por consola, según AUTENTICACION.md del backend. La landing pública sigue accesible; las rutas de datos y archivos quedan protegidas por la API.
- Reversión: retirar src/app/login, auth-client.ts, logout-button.tsx y tests/auth.test.tsx; restaurar layout de /chat, helper api.ts, header, headers de Next.js y variable runtime de Compose junto con README. Coordinar con backend: retirar este UI sin adaptar CSRF rompe escrituras, y retirar autenticación del backend abre el prototipo. No cambia ni elimina conversaciones, adjuntos o renders.
# 2026-09-28 — Landing responsive y explicación antes de planes (local)

- Se conserva el hero de fotografías deslizándose y la escena circular, según la revisión del usuario. En móvil, texto y botones aparecen antes de una galería horizontal nativa; en tablet se evita extender la portada hasta toda la altura de la pantalla. El círculo tiene fotografías mayores y más altura en escritorio, sin bordes ni cambios abruptos de fondo.
- Antes de los planes aparecen un ejemplo ilustrativo de cafetería, los pasos para crear y una explicación de imágenes/carruseles y videos. La portada enlaza a cómo funciona; los planes siguen accesibles desde navegación. No se modifica facturación, cupos, autenticación ni generación de contenido.
- ESLint de los archivos modificados: aprobado. Build local con VERCEL=1: aprobado, incluido TypeScript (compilación 1,373 s; TypeScript 8,1 s). Comprobaciones reales de navegador en 320, 390, 768, 1440 y 1920 px: sin desbordamiento horizontal de la página; botones visibles, navegación móvil operativa, galería desplazada 201 px con teclado y pausa de la animación confirmada mediante animationPlayState:paused. Fotografías visibles cargadas y escena circular ampliada inspeccionada en escritorio.
- Capturas fuera del repositorio, en la carpeta temporal del backend: landing-review/hero-recuperado.png y landing-review/circulo-ampliado.png. Cambios conservados en la rama local codex/landing-commercial-local; sin push ni despliegue remoto. Reversión: revertir esta unidad de landing, sin afectar datos del chat.

## 2026-09-28 — Login con fotografías (local)

- Se adapta la referencia ImageSlider al diseño oscuro de QUARK con motion/react ya instalado. En escritorio hay fotografía y formulario; en móvil se prioriza el formulario. Transiciones suaves, selección manual, pausa, detención fuera de pantalla y preferencia de movimiento reducido. No se agregan métodos de ingreso ni enlaces de recuperación inexistentes.
- Solo cambia la presentación del formulario: se conserva usuario vacío, verificación de sesión, nonce CSRF actualizado, bloqueo de doble envío, limpieza de contraseña tras rechazo y redirección. Las ocho pruebas de tests/auth.test.tsx pasan; ESLint de archivos modificados y build con TypeScript aprobados.
- Navegador: formulario dentro del ancho a 320 y 390 px; diseño dividido inspeccionado en escritorio, selección de fotografía y pausa comprobadas, fotografías cargadas y usuario sin valor inicial. La API de autenticación local no responde: se comprobó el estado de conexión fallida y reintento, sin afirmar un ingreso real exitoso en esta revisión. No se cambió el backend ni la configuración de producción.
- Captura fuera del repositorio: carpeta temporal del backend landing-review/login-slider.png. Cambios solo locales, sin push ni deploy. Reversión: revertir esta unidad visual; el contrato y las protecciones de autenticación permanecen iguales.

## 2026-09-28 — Hero móvil y texto comercial (local)

- Por indicación posterior del usuario, el móvil conserva ahora el mismo corredor animado de fotos del escritorio; reemplaza la galería horizontal de la unidad anterior. Ajusta tamaño, posición y altura por breakpoint; tiene pausa accesible y respeta movimiento reducido. El recorte usa overflow:clip para que enfocar el botón de pausa no desplace internamente el hero ni esconda el título.
- Nuevo encabezado: “Convertí lo que hacés en contenido que vende.” Se eliminan el párrafo introductorio adicional de planes, la comparación con ChatGPT Plus, el bloque de aclaraciones bajo los planes y las leyendas ilustrativas. FAQ ya no repite los textos eliminados. No se añaden cobros ni se cambia la disponibilidad de funciones del backend.
- ESLint de archivos modificados aprobado. Build con VERCEL=1 y TypeScript aprobado (compilación 1,482 s; TypeScript 8,5 s). Navegador en móvil y escritorio: texto e imágenes sin desbordamiento horizontal, pausa efectiva; tras enfocarla, el hero conserva scrollTop:0 y el encabezado queda visible. Los textos retirados no aparecen en el DOM; enlace Planes abre su sección.
- Capturas finales: landing-review/hero-movil-final.png y landing-review/hero-recuperado.png, fuera del repo frontend. Se mantienen los cambios solo en commits locales; sin push ni deploy.
