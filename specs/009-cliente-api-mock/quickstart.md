# Guía de validación: HU-9 Cliente de API y mock

Requisitos: HU-7 y HU-8 terminadas; Node 24; `npm ci`.

## 1. Regenerar el cliente (historia 1)

```bash
npm run api:generar
git status --short src/compartido/api/generado   # sin cambios si el contrato no cambió
npm run test -- tests/api/esquema-actualizado
```

## 2. Mock y `/salud` (historia 2)

```bash
npm run mock                                   # terminal 1: escucha en :4010
curl -s localhost:4010/salud                   # {"estado":"ok"}
curl -s localhost:4010/tiendas/MEX             # tienda
curl -si localhost:4010/tiendas/XYZ | head -1  # 404
curl -si localhost:4010/tiendas/mex | head -1  # 400
```

## 3. Aplicación contra el mock (FR-010)

Con el mock en la terminal 1: `npm run dev` en la terminal 2. En la consola del navegador:
`await fetch('http://localhost:4010/salud').then(r => r.json())` responde sin error de origen cruzado.

## 4. Cliente configurado (historia 3)

```bash
npm run test -- src/compartido/api tests/api
```

## 5. Actualizar el contrato

1. Copiar `openapi.json` del backend a `specs/009-cliente-api-mock/contratos/` (no editar).
2. `npm run api:generar` y revisar el diff.
3. `npm run type-check && npm run test` y corregir usos y mock.

## 6. Fuera de producción

`npm run build` y `grep -ril "tienda_no_encontrada" dist` no devuelve resultados.
