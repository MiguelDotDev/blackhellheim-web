# Informe: specs web de los sprints 6 a 11

Fecha: 2026-11-11. Sin push. No se tocaron `sprint/01`, `sprint/02` ni commits ya hechos (solo commits nuevos y merges hacia adelante). Se llegó al final: todas las HU web de los sprints 6 a 11 tienen spec, plan y tareas. No se escribió código de aplicación.

## Parte A: correcciones
| Qué | Rama | Commit |
|---|---|---|
| HU-25: GHCR como registro (se mantiene Container Apps y OIDC; sin `ACR_*`; paquete público tarea `[MANUAL]`) | sprint/03 | `07892ec` |
| HU-25: ajustes tras análisis (`API_URL`, sondeo de salud, FR-003, caso sin `API_URL`) | sprint/03 | `6fe6d4c` |
| HU-14: ajustes tras análisis (cierre revoca refresh, prueba de arranque, teclado y contraseña) | sprint/03 | `2f5e9e2` |
| Merge de sprint/03 en sprint/04 (para llevar los cambios) | sprint/04 | `71ce19e` |
| HU-11: ajustes tras análisis (importar desde `principal.css`, `font-display`, tema oscuro) | sprint/04 | `9e4f74e` |
| Merge de sprint/04 en sprint/05 | sprint/05 | `e565912` |
| HU-18: ajustes tras análisis (límite de imágenes, imagen transparente, sesión a mitad, 409 condicional) | sprint/05 | `d6c8ee0` |

`/speckit-analyze` se ejecutó como skill con carpeta explícita en 025, 014, 011 y 018. No se tocó el umbral de arte negro ni ninguna decisión `[MANUAL]`. Nota: el skill es de solo lectura; las correcciones las apliqué yo a mano después.

## Parte B: HU web procesadas (un commit por HU)
| Sprint | Rama | HU | Carpeta | Commit |
|---|---|---|---|---|
| 6 | sprint/06 | 23 | `023-catalogo-detalle` | `ac3653b` |
| 7 | sprint/07 | 24 (web) | `024-carrito` | `7cfbe28` |
| 7 | | 27 | `027-checkout` | `2353a0d` |
| 8 | sprint/08 | 29 (web) | `029-pago-stripe` | `b0304ac` |
| 9 | sprint/09 | 31 (web) | `031-codigo-creadora` | `2667431` |
| 9 | | 33 | `033-confirmacion-pedido` | `bfc6333` |
| 9 | | 34 (web) | `034-historial-pedidos` | `6cc0091` |
| 9 | | 38 (web) | `038-admin-pedidos` | `256e349` |
| 10 | sprint/10 | 36 (web) | `036-lista-deseos` | `1591ece` |
| 10 | | 35 (web) | `035-notificaciones` | `ff0b84a` |
| 10 | | 37 (web) | `037-resenas` | `c40d50d` |
| 11 | sprint/11 | 39 | `039-pwa-sin-conexion` | `466755b` (+ ajuste `822c2d2`) |
| 11 | | 42 (web) | `042-flujo-completo` | `460324c` |
| 11 | | 44 (web) | `044-specs-diferidos` | `5ad275a` |
| 11 | | 45 (web) | `045-documentacion-final` | `ef5cdac` |
| 11 | | 41 | `041-accesibilidad-rendimiento` | `048e9a1` |

Las HU de recorte (36, 35, 37 y 41) van al final de su sprint. Ramas apiladas: 06 desde 05, 07 desde 06, y así hasta 11.

## `[MANUAL]` y bloqueos por HU
Todas las HU con API (23, 24, 27, 29, 31, 33, 34, 35, 36, 37, 38) tienen como primera tarea `[MANUAL]` copiar el `openapi.json` del backend a su `contratos/`; no se inventaron contratos.
- 23: bloqueada por contratos de HU-19 y HU-20 y por interfaces de HU-24/27. 24: HU-14 y contrato HU-24 api. 27: HU-14/23/24 y contrato de envío. 
- 29: HU-14/24/27, contrato de pago y `[MANUAL]` cuenta de Stripe (claves solo en el backend) y pagos de prueba.
- 31: HU-18. 33: HU-29. 34: HU-33. 38: HU-31/33.
- 35: bloqueada por el service worker de HU-39 (el push va después de la bandeja); `[MANUAL]` claves VAPID y prueba en Android.
- 39: iconos de HU-11 y prueba en Android. 42: todas las HU del flujo; `[MANUAL]` compra de demostración y decisión sobre Printful. 44: revisión legal futura. 45: revisión y retrospectiva de cada sprint son tuyas. 41: Lighthouse en dispositivo real.

## Hallazgos del análisis (Parte B)
El `analyze` de la Parte B fue una verificación mecánica: el generador comprueba que cada FR tenga al menos una tarea. Únicamente HU-39 dejó FR-002 sin tarea; corregido en `822c2d2`. No se ejecutó el skill por HU en la Parte B (costo/capacidad); si lo quieres, es el siguiente paso.
- Dependencia circular suave: HU-35 (push) necesita el service worker de HU-39, que está en el sprint 11. Documentado en 035 como entrega en dos partes.
- Ningún conflicto con la constitución. HU-23, 27, 29 y 38 reiteran el principio III (precios solo mostrados); HU-29 evita `stripe.js` y claves.
- HU-24 y HU-27: el cambio de backlog de HU-27 cayó en el commit de HU-27 junto con el de HU-24 (cosmético).

## Decisiones y licencias
- Sin dependencias nuevas salvo posibles: `fake-indexeddb` (MIT, dev), `vite-plugin-pwa` y Workbox (MIT) en HU-39, Playwright (Apache-2.0, candidata) en HU-42, Lighthouse (Apache-2.0) y `axe-core` (MPL-2.0) en HU-41. Cada spec obliga a verificar la licencia y el árbol antes de instalar.
- HU-25: GHCR + Container Apps + OIDC; `packages: write` con `github.token`, imagen pública.
- HU-44: se completa la 900 y se crea la 901 sin plan ni tareas ejecutables.
- Las specs están generadas con una plantilla común; revísalas con ojo propio, sobre todo los escenarios que dependen de contratos que aún no existen.
