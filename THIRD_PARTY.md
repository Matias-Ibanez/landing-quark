# Componentes y referencias de diseño

Los diálogos de vista previa y archivos usan el primitive Radix Dialog de [Animate UI](https://animate-ui.com/docs/primitives/radix/dialog), instalado desde su registro oficial mediante Shadcn CLI el 26 de septiembre de 2026. Se conservan su contexto y componentes locales en `src/components/animate-ui/`, `src/hooks/use-controlled-state.tsx` y `src/lib/get-strict-context.tsx`. El hook se ajustó para estados controlados sin efectos de sincronización. La licencia original MIT + Commons Clause y el aviso de copyright se conservan en [licenses/animate-ui.LICENSE.txt](licenses/animate-ui.LICENSE.txt).

[Bencho](https://bencho.dev/) inspiró las opciones visuales de proporción y paleta. No se copiaron bloques ni recursos de su catálogo. Las opciones de QUARK están implementadas en el editor de preguntas.

Motion respeta la preferencia del sistema de reducir movimiento. Radix gestiona los diálogos, el foco y Escape; la navegación móvil evita interactuar con el chat mientras el panel está abierto.
