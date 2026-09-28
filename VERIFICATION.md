# Verificación del frontend

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
