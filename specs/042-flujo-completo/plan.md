# Plan de implementación: Flujo completo probado y pedido de demo (HU-42, parte web)

**Rama**: `sprint/11` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-14, HU-23, HU-24, HU-27, HU-29, HU-33 implementadas; backend y servicios de prueba (Stripe modo prueba, Printful)

## Resumen

Pruebas de punta a punta con el mock integradas a la CI y un guion para la compra de demostración real.

## Decisiones

- **D1 Herramienta**: Playwright (Apache-2.0) como candidata; alternativa `@vue/test-utils` con el enrutador real. Se decide tras verificar tamaño de descargas y licencia.
- **D2 CI**: añadir un cuarto trabajo solo si la duración lo permite; si no, un quinto control separado, sin tocar los cuatro de HU-10.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/042-flujo-completo/{spec.md, plan.md, tasks.md}
tests/e2e/  docs/demo-pedido.md
```

## Riesgos

- **R-1**: Descarga de navegadores en CI puede ser lenta o bloqueada: medir y decidir.
- **R-2**: El flujo real depende de dos repos y servicios externos.
