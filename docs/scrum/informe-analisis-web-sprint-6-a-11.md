# Informe: análisis de las specs web de los sprints 6 a 11

Fecha: 2026-11-11. Sin push. No se tocaron `sprint/01`, `sprint/02`, ni commits ya hechos (solo commits nuevos y merges con merge commit; sin `--amend`). No se cambió ninguna decisión `[MANUAL]` ni umbral de producto.

## Método
Para cada HU, con carpeta explícita y en la rama donde vive, se aplicó el procedimiento de `/speckit-analyze` (solo lectura): inventario de FR/SC/escenarios/casos límite contra tareas, consistencia spec–plan–tasks y contra la constitución. El skill es de solo lectura, así que los ajustes los apliqué a mano y solo para hallazgos medios o altos. Un commit por HU. Orden: HU-39 primero, luego las demás por sprint, con merge hacia la rama siguiente. Ninguna HU tuvo hallazgos CRÍTICOS ni conflictos con la constitución.

## Hallazgos y commits por HU
| Sprint | HU | Hallazgos corregidos | Commit |
|---|---|---|---|
| 11 | 39 | M: carrito conservado al actualizar, reactualización al recuperar red, compra bloqueada sin conexión y almacenamiento lleno sin tarea. A: plan decía «sin dependencias nuevas» pero T002 instala `vite-plugin-pwa`, Workbox y `fake-indexeddb`. B: estado de backlog ambiguo | `64471a7` |
| 11 | 42 | A: plan sin dependencias vs herramienta de navegador (Playwright). M: independencia de orden/puertos y reintentos acotados sin tarea | `3650609` |
| 11 | 44 | M: listar 900 y 901 en el backlog como fuera de alcance sin tarea | `274da49` |
| 11 | 45 | M: marcar HU no hechas como pendientes y resumir hallazgos/decisiones (US2.3) sin tarea | `1335a81` |
| 11 | 41 | A: plan sin dependencias vs Lighthouse/axe-core. M: falsos positivos documentados y 100 % de pares de contraste sin tarea | `ae67d6a` |
| 6 | 23 | M: esqueletos, fallo de red que no borra lo mostrado, imagen rota y store reutilizable para HU-39 sin tarea. M: ambigüedad entre «formato es-MX» y «no convertir precios» (plan D2) | `0e89919` |
| 7 | 24 | A: plan sin dependencias vs `fake-indexeddb`/`idb`. M: FR-004 (interfaz del carrito) sin tarea explícita, tarea con FR mal referenciado (FR-002/003 en vez de FR-001), precios del resumen sin sesión | `b9089ee` |
| 7 | 27 | M: variante sin existencia, renovación de sesión conservando lo capturado, Pagar sin total válido y autocompletado por CP condicional sin tarea | `7ffa8eb` |
| 8 | 29 | M: idempotencia, carrito tras error, cancelación con reintento, sesión caducada y sin conexión al volver sin tarea | `3cc3fcd` |
| 9 | 31 | M: mensaje de commit truncado en la última tarea; normalización, código quitado, editar/desactivar y «sin permiso» sin tarea | `7be2986` |
| 9 | 33 | M: store reutilizable (HU-34/HU-39) sin tarea | `45502c5` |
| 9 | 34 | M: filtro por estado, fecha con `Intl` y página fuera de rango sin tarea | `6047690` |
| 9 | 38 | M: no registrar datos personales, ruta `/admin/creadoras/:codigo` con rol y tablas accesibles sin tarea | `6b7ef5a` |
| 10 | 36 | B/M: comportamiento sin conexión del corazón sin prueba | `eeb0eea` |
| 10 | 35 | A: T003 exigía HU-39 (sprint 11) para toda la HU, contradiciendo «la bandeja puede ir antes». M: contador entre pestañas, suscripción 410 y sin soporte sin tarea | `17b27e3` |
| 10 | 37 | M: contador accesible del máximo y refresco de reseña ocultada sin tarea | `8aceee2` |

A = alto, M = medio, B = bajo (incluido solo si iba junto a uno mayor).

## Merges hacia adelante (merge commit)
| Merge | Commit |
|---|---|
| sprint/06 en sprint/07 | `8c5df36` |
| sprint/07 en sprint/08 | `bc14e1a` |
| sprint/08 en sprint/09 | `409dcec` |
| sprint/09 en sprint/10 | `c8848b0` |
| sprint/10 en sprint/11 | `3fe8068` |

Los ajustes de las HU 39, 42, 44, 45 y 41 se hicieron directo en `sprint/11` (cadena de ramas: las demás se propagan por los merges).

## Pendiente / límites
- Patrón repetido: la plantilla común decía «Sin dependencias nuevas» aunque una tarea instalara una (39, 41, 42, 24). Corregido en esos cuatro; revisar la plantilla si se generan más specs.
- Los escenarios que dependen de contratos de API siguen sin endpoints concretos (los contratos no existen). Hay que revisarlos al copiar cada `openapi.json` ([MANUAL] T001 de cada HU).
- No se corrió la verificación mecánica de nuevo ni `lint`/`test`: solo cambiaron Markdown.
- Las tareas `[MANUAL]` siguen todas pendientes. Push de las ramas: tuyo, en orden `sprint/03` … `sprint/11`.
