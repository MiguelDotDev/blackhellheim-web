# Plan de implementación: Carrito que se conserva (HU-24, parte web)

**Rama**: `sprint/07` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-14 (sesión y gancho de sesión iniciada); contrato del API de carrito (HU-24 api)

## Resumen

Slice `entidades/carrito` con repositorio local (IndexedDB) y repositorio remoto (API) detrás de una sola interfaz; fusión al evento de sesión iniciada.

## Decisiones

- **D1 Dos repositorios**: `carritoLocal` y `carritoRemoto` con la misma interfaz; el store elige según haya sesión.
- **D2 IndexedDB**: envoltorio mínimo propio con la API nativa; alternativa `idb` (ISC) solo si el código crece.
- **D3 Fusión**: el servidor decide; el cliente no resuelve conflictos.
- **D4 Sincronización de pestañas**: `BroadcastChannel`.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Posibles dependencias de desarrollo/ejecución: `fake-indexeddb` (MIT, desarrollo) o `idb` (ISC); se decide en T005, verificando licencia y árbol antes de instalar.

## Estructura

```text
specs/024-carrito/{spec.md, plan.md, tasks.md, contratos/openapi.json}
src/entidades/carrito/{index.ts, modelo/, api/}  src/widgets/icono-carrito/  src/paginas/carrito/
mock/respuestas.ts (+ carrito)
```

## Riesgos

- **R-1**: Contrato de carrito inexistente hasta que el API lo publique.
- **R-2**: IndexedDB en jsdom: usar `fake-indexeddb` (MIT) solo como dependencia de desarrollo; verificar licencia al instalar.
