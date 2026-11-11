# AGENTS.md · blackhellheim-web

Reglas para agentes de código (OpenCode, Claude Code y otros). La fuente de verdad de los principios es `.specify/memory/constitution.md`; léela primero.

## Qué es
PWA de la tienda BlackHellHeim (Vue 3 + TypeScript + Vite + Pinia + Vue Router + Tailwind). Marca siempre escrita **BlackHellHeim**.

## Estructura (Feature-Sliced Design en español)
`src/aplicacion`, `src/paginas`, `src/widgets`, `src/funcionalidades`, `src/entidades`, `src/compartido`. Segmentos dentro de cada slice: `ui`, `modelo`, `api`, `lib`.
- `specs/NNN-slug/` una carpeta por historia (mismo número que en el backend); `contratos/` es copia del backend, no se edita aquí.
- `docs/scrum/` (incluye `backlog.md`, la referencia de HU por sprint), `docs/legal/`.

## Reglas
1. No implementes sin spec y tasks aprobadas.
2. Una capa solo importa de capas inferiores; cada slice se importa solo por su `index.ts`. ESLint lo verifica.
3. El cliente de la API se genera desde el OpenAPI; no escribas a mano tipos del contrato. Usa el servidor mock mientras el backend no esté listo.
4. Nunca calcules ni envíes precios; solo muéstralos.
5. Token de acceso solo en memoria; nada de tokens en localStorage.
6. Pedidos, notificaciones y compras deben poder verse sin conexión (IndexedDB).
7. Comprar exige sesión; el carrito local se fusiona al iniciar sesión.
8. Sin secretos; solo variables `VITE_` sin datos sensibles.
9. Verifica la licencia de cualquier dependencia nueva.
10. Código, specs y commits en español.

## Comandos
```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run test
npm run build
```

## Flujo SDD
`/speckit.specify` → `/speckit.clarify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.analyze` → `/speckit.implement`.

## Flujo por historia de usuario y ramas
Ramas: `main` (despliega a Azure, solo recibe de `release`), `release` (pruebas y aprobación), `developer` (integración) y `sprint/NN` (una por sprint, sale de `developer`). Nunca hagas commit directo a `main`, `release` ni `developer`.

Trabajo por historia (requisito académico):
1. La fuente de verdad de qué HU pertenece a qué sprint es `docs/scrum/backlog.md`. Antes de empezar, identifica la HU y su sprint, y trabaja sobre la rama `sprint/NN` de ese sprint (si no existe, dímelo y no la crees tú). No uses ramas por historia.
2. Cada HU corresponde a una carpeta en `specs/`. Implementa una HU a la vez; no mezcles HU distintas en el mismo commit.
3. Cuando terminen todas las tareas de una HU y `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` pasen, haz commit con el mensaje `HU-N: <título corto>` y actualiza su fila en `backlog.md` (Spec y Estado = Hecha). Después DETENTE y dime textualmente: "HU-N terminada. Haz push a sprint/NN" con el comando exacto. No hagas push tú.
4. Cuando todas las HU de un sprint estén en Hecha, dime textualmente: "Sprint N completo. Abre pull request de sprint/NN a developer". Luego `developer` a `release` y `release` a `main` solo con mi aprobación explícita.
5. Si una HU toca ambos repos, trabaja la parte de este repo, márcalo en la fila y avísame qué falta en el otro. El contrato OpenAPI lo define el backend; aquí solo se copia.
6. Las tareas `[MANUAL]` no las inventes: déjalas pendientes y avísame qué me toca. Una HU con `[MANUAL]` pendientes no está Hecha.
7. Si el backlog y las carpetas de specs no coinciden, avísame en vez de suponer.
8. El Estado de `backlog.md` es de este repositorio; el del backend es independiente.
