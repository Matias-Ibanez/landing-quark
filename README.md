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
