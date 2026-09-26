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
