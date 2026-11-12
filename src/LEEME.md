# Guía de capas (Feature-Sliced Design en español)

Las capas, de arriba abajo: `aplicacion` → `paginas` → `widgets` → `funcionalidades` → `entidades` → `compartido`.

## Qué va en cada capa

- **aplicacion**: arranque, enrutador, proveedores (Pinia) y estilos globales.
- **paginas**: una pantalla completa por slice (`paginas/inicio`).
- **widgets**: bloques de interfaz grandes que combinan funcionalidades y entidades.
- **funcionalidades**: acciones del usuario con valor propio (añadir al carrito, iniciar sesión).
- **entidades**: conceptos del negocio (producto, pedido) con su modelo y su interfaz.
- **compartido**: piezas sin lógica de negocio (`ui`, `lib`, `api`).

## Segmentos dentro de un slice

`ui` (componentes), `modelo` (estado y reglas), `api` (llamadas al backend), `lib` (utilidades).

## Regla de importación

1. Una capa solo importa de capas **inferiores**, nunca de las superiores.
2. Cada slice se importa **solo por su `index.ts`**, nunca por sus archivos internos.
3. Dos slices de la **misma capa** no se importan entre sí.

`npm run lint` falla si se rompe alguna.

## Ejemplos: dónde va…

1. Un botón genérico → `compartido/ui`.
2. Una regla de negocio (p. ej. validar un código) → `modelo` de la entidad o funcionalidad que la usa.
3. Una llamada a la API → segmento `api` del slice (cliente generado desde el OpenAPI).
4. Una pantalla → `paginas/<nombre>/ui`, expuesta por su `index.ts`.
5. Un tipo del contrato → generado en `compartido/api`; no se escribe a mano.
