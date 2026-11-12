# Informe de la noche (web) · 2

Rama de trabajo final: `sprint/06`. Sin push, sin `--amend`, sin tocar `sprint/01`–`04`.

## Lectura adoptada
- «Arte negro» = ≥ 85 % de píxeles opacos (alfa > 128) con luminancia relativa < 0.1.
- Excepción acordada a AGENTS.md: un commit local por HU, sin detenerse.
- HU-18 con tarea `[MANUAL]` pendiente (T012) ⇒ Estado = **En progreso**, no «Hecha» (regla 6).

## Commits
| Hash | Qué |
|---|---|
| `6a56397` | HU-18: editor de diseños (en `sprint/05`) |
| `981be7c` | Merge de `sprint/05` en `sprint/06` (merge commit) |
| (este informe) | commit aparte |

## Pruebas (tras HU-18)
`npm run lint`, `type-check`, `test` (37 archivos, 184 pruebas) y `build`: en verde.

## HU-18: decisiones y hallazgos
- `api:generar` y las pruebas de contrato ahora apuntan a `specs/018-editor-disenos/contratos/openapi.json`.
- Mock ampliado: `/admin/disenos` (GET/POST), `/admin/disenos/{id}` (GET/PUT con `If-Match` → 412), `/admin/arte`, y `/admin/printful/productos[/{id}/variantes]` (fuente de colores y tallas). Un correo `admin@…` se registra como Administrador solo en el mock. `/catalogo/*` y `/admin/precios/*` quedan sin mock (excluidos en `mock-cobertura.test.ts`).
- **Contrato**: `DisenoSolicitud` admite un solo `archivoArteId`. Se suben todas las imágenes, pero solo la primera se envía como arte del diseño. Hay que pedir al backend soporte para varias.
- **Contrato**: no publica resolución mínima ni límite de imágenes. Provisional: 1000 px por lado y 10 imágenes (`lib/validar-archivo.ts`).
- `VarianteDisenoDto.costoBaseUsd` es obligatorio en la petición; se reenvía tal cual lo da el backend (Printful), sin cálculo. El formulario no tiene campos de precio.
- Un solo producto (playera, id 71) con `shortcut:` en el código.
- La prueba de «renovación de sesión a mitad del formulario» solo verifica que el borrador no se pierde (el stub no simula la cookie de refresh).

## HU omitidas
- **HU-23**: no implementada. Las dependencias «interfaz del carrito (HU-24)» y «checkout (HU-27)» no existen: no hay carrito/checkout en `src`, ni en el contrato copiado. El catálogo y los precios sí están en el contrato (`/catalogo/playeras`, `precioMxn`), pero los botones de compra no tienen a qué conectarse. Además `specs/023-catalogo-detalle/contratos/` no existe (T001 `[MANUAL]`) y la fila del backlog tiene la columna Spec vacía aunque la carpeta existe.
  Falta: HU-24 y HU-27 (o su interfaz), copiar el contrato a la carpeta de HU-23 y el mock de catálogo.

## `[MANUAL]` pendientes
- HU-18 T012: probar con la API real y una imagen real de arte negro sobre prenda negra.
- HU-23 T001 (copiar contrato) y T010 (prueba con la API real).

## Comandos de push (los ejecutas tú)
```bash
git push origin sprint/05   # contiene HU-18
git push origin sprint/06   # contiene el merge de sprint/05
```
Avisos: «HU-18 está en progreso (falta T012 manual); sin push desde aquí». Cuando T012 pase, marcar «Hecha» en `backlog.md`.
