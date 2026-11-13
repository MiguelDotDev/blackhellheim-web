# Informe de la sesión desatendida (web)

Fecha: 2026-11-11. Sin push. `sprint/01` no se tocó.

## Lectura tomada
Parte A en `sprint/02` (un commit por HU, sin detenerme). Parte B: solo las HU con «web» en Repos de los sprints 3 a 5, con spec, plan y tareas por HU, sin código. El análisis (`/speckit.analyze`) lo hice a mano, como lectura cruzada de spec ↔ plan ↔ tasks, no con el script.

## Parte A: HU implementadas (rama `sprint/02`)
| HU | Commit | Estado |
|---|---|---|
| 9 | `a37d5d6` HU-9: cliente de API tipado y servidor mock | Hecha. Lint, tipos, 52 pruebas y build en verde. SC-004 comprobado (renombrar `estado` rompe `mock/respuestas.ts`); `tienda_no_encontrada` no aparece en `dist`. |
| 10 | `b121664` HU-10: CI del frontend | En progreso: tareas automáticas hechas (63 pruebas, build en verde); faltan las `[MANUAL]`. |

### Pendientes `[MANUAL]` de HU-10 (te tocan)
- T017: habilitar GitHub Actions y hacer push de `sprint/02`.
- T018: comprobar en Actions los 4 controles `verificar (…)` en verde.
- T019: prueba negativa en la rama temporal `sprint/99-prueba-ci`.
- T020: protección de `main`, `release` y `developer`; luego marcar HU-10 como Hecha.

### Licencias nuevas
openapi-fetch (MIT), openapi-typescript (MIT), openapi-typescript-helpers (MIT), yaml (ISC). Árbol transitivo: MIT, ISC, BSD, Apache-2.0, BlueOak-1.0.0, 0BSD, Python-2.0 (argparse), MPL-2.0 (lightningcss, ya existía). Todas libres. Acciones: actions/checkout v7.0.1 y actions/setup-node v7.1.0, SHA reconfirmados (MIT).

## Parte B: specs por sprint (solo web)
| Sprint | Rama | HU | Commit | Bloqueado por |
|---|---|---|---|---|
| 3 | `sprint/03` (desde sprint/02) | 14 acceso y sesión (`specs/014-acceso-sesion`) | `0d6d87b` | HU-13 api (contrato de autenticación) |
| 3 | | 25 despliegue Azure, parte web (`specs/025-despliegue-azure`) | `cb5a84e` | HU-5 y HU-25 api; recursos de Azure |
| 4 | `sprint/04` (desde sprint/03) | 11 marca (`specs/011-marca`) | `5e3f1f1` | documento de diseño (paleta, fuentes, logo) |
| 5 | `sprint/05` (desde sprint/04) | 18 editor de diseños (`specs/018-editor-disenos`) | `5f52e71` | HU-14, contrato de HU-16/17/19 |

Las HU 13, 15, 16, 17, 19 y 20 son solo api y no se tocaron. HU-14 y HU-25 comparten sprint 3 y cada una tiene su commit.

## Hallazgos del análisis (corregidos salvo nota)
- HU-25: redacción ambigua en FR-002; corregida (en el commit de HU-25).
- HU-25: añadir `workflow_call` a `ci.yml` obliga a ajustar la prueba de HU-10 (`tests/ci`); queda en T008 conservando todas sus reglas.
- HU-14: el plan menciona el mock de «token caducado» con la redacción «`?`/cabecera»; queda la cabecera `x-mock-token`. Sin corregir (cosmético).
- HU-14/18: `api:generar` apunta a un solo contrato; cada HU nueva debe reapuntarlo (T002 en ambas).
- HU-18: el umbral de «arte negro» (0.85 de píxeles oscuros) es mío, a confirmar contigo.
- Línea de backlog de HU-14 (Spec) quedó dentro del commit de HU-25 (error mío al separar commits; sin consecuencia).

## Decisiones
- HU-25: Azure Container Apps + ACR con OIDC (sin secretos) es una decisión provisional mía; cámbiala si ya elegiste otro servicio.
- HU-11 y HU-18 dependen de entregables tuyos (diseño, contratos); no inventé marca ni contratos.
- Mock de HU-9: sin dependencias, `node:http` y ejecución nativa de TypeScript.

## Para subir uno por uno
```bash
git push origin sprint/02   # a37d5d6 (HU-9) y b121664 (HU-10)
git push origin sprint/03   # 0d6d87b (HU-14), cb5a84e (HU-25)
git push origin sprint/04   # 5e3f1f1 (HU-11)
git push origin sprint/05   # 5f52e71 (HU-18)
```
Los commits de cada rama están apilados (sprint/04 incluye sprint/03, y así sucesivamente).
