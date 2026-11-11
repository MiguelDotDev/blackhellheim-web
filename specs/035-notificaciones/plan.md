# Plan de implementación: Bandeja de notificaciones y avisos push (HU-35, parte web)

**Rama**: `sprint/10` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-14, HU-33/34, HU-39 (service worker); contrato del API de notificaciones (HU-35 api); claves VAPID

## Resumen

Bandeja de avisos (independiente del push) y suscripción push que se apoya en el service worker de HU-39.

## Decisiones

- **D1 Dos entregas**: primero bandeja y contador, luego push cuando exista el service worker.
- **D2 Clave VAPID pública**: variable `VITE_VAPID_PUBLICA` en `.env.*` (valor público), documentada en el README.
- **D3 Sin dependencias nuevas propias**.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/035-notificaciones/{spec.md, plan.md, tasks.md, contratos/openapi.json}
src/entidades/notificacion/  src/funcionalidades/avisos-push/  src/paginas/notificaciones/  src/widgets/icono-notificaciones/
src/sw/ (ampliación de HU-39)
```

## Riesgos

- **R-1**: Bloqueo por HU-39 para el push.
- **R-2**: Probar push requiere dispositivo Android y backend: tareas manuales.
