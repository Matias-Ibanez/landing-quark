# Verificación del chat

## Markdown y medios — 2026-09-26

- `npx vitest run tests/messages.test.tsx`: 5 pruebas aprobadas. Negritas, cursivas, listas, títulos, tablas, enlaces seguros, rechazo de HTML/URLs ejecutables e imágenes remotas, adjuntos del usuario y PNG/SVG con error y reintento.
- TypeScript y build Docker de Next.js aprobados. ESLint de los componentes modificados: sin errores; advertencia de img nativo en el visor de medios, que conserva las URLs y el comportamiento de PNG/SVG.
- Navegador real: la respuesta de capacidades mostró cinco etiquetas strong y cinco elementos de lista, sin asteriscos literales. Una imagen PNG enviada quedó visible dentro del mensaje del usuario y conservó sus dimensiones de 1080 × 1080.
- Reversión: revertir MarkdownMessage, MediaImage, MessageList, integración en galería y atributo del contenedor de scroll, junto con dependencias y pruebas. Los archivos y mensajes del backend no se borran.
