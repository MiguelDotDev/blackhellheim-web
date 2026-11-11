# Plan de implementación: PWA instalable y uso sin conexión (HU-39)

**Rama**: `sprint/11` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-11 (iconos y colores), HU-14, HU-23, HU-33/34

## Resumen

PWA instalable con service worker de Workbox y capa de datos sin conexión en IndexedDB para pedidos, avisos y catálogo visto.

## Decisiones

- **D1 Estrategias**: precaché de la app; `StaleWhileRevalidate` para imágenes; el catálogo visto vive en IndexedDB, no en la caché de `fetch`.
- **D2 Repositorio sin conexión**: interfaz `leerPedidos/guardarPedidos` por usuario, usada por HU-33/34/35.
- **D3 Actualización**: modo `prompt` (aviso al usuario).

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/039-pwa-sin-conexion/{spec.md, plan.md, tasks.md}
vite.config.ts (vite-plugin-pwa)  src/sw/  src/compartido/lib/almacen-local.ts
src/widgets/aviso-conexion/  public/iconos/ (del diseño)
```

## Riesgos

- **R-1**: Iconos de la marca pendientes de HU-11.
- **R-2**: Probar en dispositivo real: tarea manual.
- **R-3**: Caché de datos de otra sesión: el borrado al cerrar sesión lo cubre.
