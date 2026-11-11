# Investigación: HU-8 Ambientes (Fase 0)

## D1. Mecanismo de ambientes

- **Decisión**: modos nativos de Vite. `vite` (dev) usa `development`, `vite build` usa `production`, Vitest usa `test`. Cada modo carga `.env`, `.env.[modo]` y, encima, `.env.local` y `.env.[modo].local`.
- **Razón**: no requiere dependencias nuevas (principio VIII) y coincide con los nombres de archivo del criterio. Para construir en modo prueba se añade el script `build:test` (`vite build --mode test`).
- **Alternativas**: biblioteca `dotenv` (innecesaria; Vite ya lo hace); configuración en tiempo de ejecución con `config.json` servido por nginx (útil si la URL cambiara sin reconstruir, pero la historia pide archivos `.env.*`).

## D2. Exposición de variables

- **Decisión**: `envPrefix: 'VITE_'` explícito en `vite.config.ts` (es el valor por defecto, pero se escribe para que un cambio sea visible en revisión) y tipado de `ImportMetaEnv` en `src/vite-env.d.ts`.
- **Razón**: Vite solo expone al código las variables con ese prefijo; hacerlo explícito deja constancia del principio IX.

## D3. Valores por ambiente

| Ambiente | Archivo | `VITE_API_URL` | Razón |
|---|---|---|---|
| desarrollo | `.env.development` | `http://localhost:4010` | servidor mock de la HU-9 (puerto 4010 reservado para él); `npm run dev` funciona sin backend (spec 000) |
| prueba | `.env.test` | `http://localhost:5068` | API real local; es el servidor que declara el contrato del backend (`servers[0].url`) |
| producción | `.env.production` | `/api` | mismo origen: nginx reenvía `/api` a la API (spec 000), sin CORS |

La ruta relativa `/api` implica que el proxy retire el prefijo al reenviar (el backend publica `/salud`, no `/api/salud`); es punto abierto de la spec 000 que se resuelve en el despliegue (HU-25).

## D4. Lectura y validación

- **Decisión**: función pura `leerEntorno(variables = import.meta.env)` en `src/compartido/lib/entorno.ts`, exportada por `src/compartido/lib/index.ts`. Devuelve `{ urlApi }` normalizada (sin barra final) y lanza `Error` en español si falta, está vacía o no es `http(s)://…` ni empieza por `/`.
- **Razón**: aislada de `import.meta.env` para probarla con objetos; vive en `compartido/lib` porque la usarán varias capas (principio I).
- **Alternativa**: librería de esquemas (zod); descartada para no añadir dependencia por una sola variable.

## D5. Cómo se garantiza «sin secretos»

- **Decisión**: prueba automática (`tests/ambientes/sin-secretos.test.ts`) que parsea los tres archivos y rechaza: nombre sin `VITE_`; nombre con `SECRET|SECRETO|TOKEN|PASSWORD|PASSWD|CLAVE|CONTRASE|KEY|CREDENCIAL`; valor con credenciales incrustadas (`://usuario:clave@`).
- **Razón**: el repositorio es público; la prueba corre en CI (HU-10) y detecta el error antes del push.
- **Alternativa**: herramientas de escaneo de secretos (gitleaks, MIT); útil, pero fuera del alcance de la historia y sin dependencia con ella; puede proponerse después.

## D6. Archivos locales

- **Decisión**: `.env.local` y `.env.*.local` ya están excluidos por el `.gitignore` de la HU-7 (T001); la prueba de la HU-8 lo verifica.
