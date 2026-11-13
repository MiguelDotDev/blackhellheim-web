# Plan de implementación: Editor de diseños (HU-18)

**Rama**: `sprint/05` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-14, contrato de HU-16/17/19

## Resumen

Tres slices FSD: `entidades/diseno` (tipos de dominio derivados del contrato y store de borrador), `funcionalidades/editar-diseno` (formulario, subida, aviso de arte oscuro) y `paginas/admin-disenos` (listado y edición). La detección de arte oscuro es una función pura en `funcionalidades/editar-diseno/lib`.

## Decisiones

- **D1 Detección**: `analizarArte(datos: ImageData)` devuelve la proporción de píxeles opacos oscuros (alfa > 128, luminancia relativa < 0.1); aviso si ≥ umbral (0.85, constante exportada y probada). Se obtiene el `ImageData` con `createImageBitmap` + `OffscreenCanvas`/`canvas`; en pruebas se usa `ImageData` sintético.
- **D2 Subida**: una petición por archivo, en secuencia limitada (2 en paralelo), con estado individual y reintento.
- **D3 Estado**: borrador del formulario en Pinia (memoria); no se guarda en almacenamiento persistente.
- **D4 Sin dependencias nuevas**: validación y vistas previas con APIs del navegador (`URL.createObjectURL`, `File`).
- **D5 Conflictos**: se envía el identificador de versión/ETag que defina el contrato; si el contrato no lo trae, se anota como hallazgo y se omite.

## Verificación de la constitución

I cumple · II cumple (contrato primero; bloqueo documentado) · III cumple (sin precios) · V cumple · VI pruebas primero · VII formularios accesibles y aviso no solo por color · VIII sin dependencias · IX sin secretos · X español · XI `sprint/05`.

## Estructura

```text
specs/018-editor-disenos/{spec.md, plan.md, tasks.md, contratos/openapi.json}   # copia manual
src/entidades/diseno/{index.ts, modelo/}
src/funcionalidades/editar-diseno/{index.ts, ui/, api/, lib/analizar-arte.ts, modelo/}
src/paginas/admin-disenos/{index.ts, ui/}
mock/respuestas.ts (+ operaciones de diseños)  tests/api/mock-disenos.test.ts
```

## Riesgos

- **R-1**: contrato aún inexistente ⇒ sin T001 no hay implementación.
- **R-2**: análisis de píxeles en imágenes grandes bloquea la interfaz ⇒ reducir la imagen a ≤ 256 px de lado antes de analizar.
- **R-3**: el umbral de «negro» es subjetivo ⇒ confirmar con la administradora (supuesto).
