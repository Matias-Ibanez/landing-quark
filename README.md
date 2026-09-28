# QUARK · frontend

El chat requiere ingresar con la cuenta `admin`. `/login` ofrece el formulario y **Salir** revoca la sesión actual. Configurá la contraseña desde la consola del backend según [AUTENTICACION.md](https://github.com/mibanez-devops/backend_quark/blob/main/AUTENTICACION.md); no hay registro público ni credenciales predeterminadas. Las cookies se envían por el mismo origen; las operaciones que cambian datos incluyen CSRF, también al subir archivos. Las credenciales no se guardan en localStorage.

Interfaz y chat de QUARK. La API, Hermes y los datos viven en [backend_Quark](https://github.com/mibanez-devops/backend_quark).

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

Para un servidor con TLS, el proxy público apunta al puerto local del frontend. El backend valida la cuenta admin y protege también los medios; configurá su origen HTTPS para activar cookies Secure. Las instrucciones completas están en [DESPLIEGUE.md del backend](https://github.com/mibanez-devops/backend_quark/blob/main/DESPLIEGUE.md).

## Vercel con backend en tu servidor

Importá este repositorio como proyecto Next.js. Conservá el comando `npm run build`, Root Directory en la raíz del repo y Output Directory automático; no lo apuntes a `.next/standalone`. En Environment Variables, definí `QUARK_API_URL` con el origen HTTPS del túnel del backend, por ejemplo `https://api.quark.tudominio.com`, antes de construir. No lleva `/api` ni barra final y no usa el puerto local de tu PC.

Vercel define `VERCEL=1`; mantené habilitada la exposición de variables de sistema. La configuración desactiva `output: standalone` en esa plataforma y lo conserva en Docker. Esto evita el fallo de empaquetado `ENOENT .next/next-server.js.nft.json` reportado para Next.js 16.3 con standalone y el adaptador de Vercel; véase [el reporte upstream](https://github.com/vercel/next.js/issues/96646).

Después de cambiar variables o configuración, desplegá la última revisión. El backend debe configurar `PUBLIC_APP_ORIGIN` con el dominio exacto del frontend y `PUBLIC_API_ORIGIN` con el del túnel, siguiendo [DEPLOY_GITHUB.md](https://github.com/mibanez-devops/backend_quark/blob/main/DEPLOY_GITHUB.md). Comprobá login, logout, adjuntos y reproducción en el dominio real. Un build exitoso no confirma que el túnel o las cookies ya estén funcionando.

## Detalles de la pieza

El backend decide si necesita aclaraciones. Se muestra una pregunta por vez dentro del chat: elegí una opción o escribí la respuesta en el cuadro de mensajes. Cada respuesta queda guardada. Al terminar podés revisar y editar respuestas individuales antes de pulsar **Crear mi pieza**; un pedido completo produce directamente. No hay selector de función: pedí una publicación, una campaña o un short en lenguaje natural.

Las elecciones de formato muestran proporciones; las paletas muestran colores. El texto sin enviar se conserva durante las actualizaciones periódicas. Los cambios guardados en otra pestaña se recuperan por versión.

## Lectura de mensajes e imágenes

El chat interpreta Markdown (negritas, cursivas, listas, títulos, enlaces y tablas) sin ejecutar HTML ni cargar imágenes remotas incrustadas en el texto. Los medios se muestran desde las referencias verificadas que devuelve el backend. Las publicaciones vectoriales conservan descarga SVG y vista/descarga PNG, con recuperación de errores de vista previa.

Pruebas: `npm test`. El detalle de los escenarios corregidos está en [VERIFICATION.md](VERIFICATION.md).

Adjuntá fotos, PDF o audio con **+**, pegá imágenes desde el portapapeles o arrastrá archivos al chat. Se admiten cinco archivos de hasta 30 MB por mensaje. Podés enviarlos sin texto o acompañarlos con instrucciones. Aparecen dentro de tu mensaje y dejan de figurar en el cuadro de escritura. Si el envío se rechaza, se conserva el borrador con los archivos; si una carga falla, se siguen procesando los demás archivos válidos. La última conversación seleccionada se recupera al recargar en esa pestaña.

Un clic sobre una tarjeta abre una vista previa con descargas; los videos se cargan allí, sin fijarse encima del chat. **Archivos** reúne adjuntos y resultados de la conversación. **Biblioteca** permite buscar piezas y filtrar imágenes o videos, retomar su chat o llevarlas al calendario. Los PDF muestran la primera página y un enlace al original; el backend lee texto y páginas escaneadas con límites documentados en su README.

Los diálogos animados vienen del registro oficial de Animate UI. Las opciones visuales toman como referencia Bencho; véase [THIRD_PARTY.md](THIRD_PARTY.md). Se respetan las preferencias de reducir movimiento, Escape y navegación por teclado. El panel móvil se cierra al elegir un chat y bloquea la interacción con el fondo.
