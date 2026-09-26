# QUARK · frontend

Interfaz y chat de QUARK. La API, Hermes y los datos viven en [backend_Quark](https://github.com/Matias-Ibanez/backend_Quark).

## Desarrollo local

Primero iniciá el backend según su README; la API queda en `http://127.0.0.1:8011`. Después:

```bash
npm ci
npm run dev
```

Abrí `http://localhost:3000/chat`. Next.js envía `/api`, `/media`, `/fonts` y `/webhooks` al backend mediante `QUARK_API_URL`, que por defecto apunta a `http://127.0.0.1:8011`.

## Docker Compose en el mismo equipo

Iniciá primero `docker compose up -d --build` desde `backend_Quark`. Ese stack crea la red `quark-shared` y ejecuta `studio` y `hermes`. Luego, desde este repositorio:

```bash
docker compose up -d --build
docker compose ps
```

Abrí `http://localhost:8010/chat`. El contenedor Next.js usa la red compartida para acceder a `studio:8000`; la API queda accesible solo en `127.0.0.1:8011` en el host. Si cambiás el puerto del frontend, definí `FRONTEND_PORT` con el mismo valor en ambos despliegues y reconstruí el backend.

Para un servidor con TLS, el proxy público debe apuntar al puerto local del frontend y proteger el acceso al prototipo. Las instrucciones completas están en [DESPLIEGUE.md del backend](https://github.com/Matias-Ibanez/backend_Quark/blob/main/DESPLIEGUE.md).

## Detalles de la pieza

El backend decide si necesita aclaraciones y devuelve únicamente los campos pendientes. El editor omite los grupos vacíos y revisa solo esas respuestas; un pedido completo empieza a producir sin formulario. La edición manual de una pieza conserva todas las opciones.

Verificado con TypeScript, ESLint del editor y build Docker. En el chat, un reel sobre café sin duración mostró solo esa pregunta y su revisión. Para revertir la presentación, revertir el cambio del editor; no es necesario borrar datos ni conversaciones.

## Lectura de mensajes e imágenes

El chat interpreta Markdown (negritas, cursivas, listas, títulos, enlaces y tablas) sin ejecutar HTML ni cargar imágenes remotas incrustadas en el texto. Los medios se muestran desde las referencias verificadas que devuelve el backend. Las publicaciones vectoriales conservan descarga SVG y vista/descarga PNG, con recuperación de errores de vista previa.

Pruebas: `npm test`. El detalle de los escenarios corregidos está en [VERIFICATION.md](VERIFICATION.md).

Los adjuntos se pueden enviar sin texto: después de cargarlos, pulsá Enviar. Aparecen dentro de tu mensaje y dejan de figurar en el cuadro de escritura. También podés escribir indicaciones antes de enviarlos. Si el envío se rechaza, se conserva el borrador con los archivos; si una carga falla, se siguen procesando los demás archivos válidos. La última conversación seleccionada se recupera al recargar en esa pestaña.
