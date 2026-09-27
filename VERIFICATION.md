# Verificación del chat

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
