# Tareas: Despliegue a Azure, parte web (HU-25)

**Pruebas**: primero. **Bloqueado por**: HU-5 y HU-25 api; recursos de Azure (`[MANUAL]`).
**Nota**: esta HU tiene tareas `[MANUAL]`; no se marca «Hecha» hasta completarlas. La parte api se trabaja en el otro repo.

## Fase 1: Preparación

- [ ] T001 [FE] Confirmar que la HU-10 está hecha (`ci.yml` y su prueba existen) y consultar SHA y licencias de `azure/login` y demás acciones (`git ls-remote`); registrar en `plan.md`
- [ ] T002 [MANUAL] Crear en Azure: grupo de recursos, Container Registry, entorno y Container App de la web; app registrada con credencial federada para `repo:<dueño>/blackhellheim-web:ref:refs/heads/main`; rol mínimo (AcrPush + Contributor sobre la app)
- [ ] T003 [MANUAL] Definir en GitHub las variables (no secretas) `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `ACR_NOMBRE`, `APP_WEB` y el entorno `produccion`

## Fase 2: Imagen (US1)

- [ ] T004 [FE] Escribir primero `tests/despliegue/nginx.test.ts`: la plantilla tiene `location /api/` con `proxy_pass ${API_URL}/`, respaldo SPA `try_files … /index.html`, `no-cache` para `sw.js`/`index.html`/`manifest`, caché inmutable para `/assets/`, `Set-Cookie` no filtrado
- [ ] T005 [FE] Crear `nginx/default.conf.template`, `Dockerfile` multietapa (Node de `.nvmrc` → nginx-unprivileged, usuario no root) y `.dockerignore`; documentar licencias
- [ ] T006 [FE] Si hay Docker: construir y ejecutar la imagen con una API de prueba y comprobar `/`, `/acceso` y `/api/salud`; si no, dejar nota y marcar `[MANUAL]`

## Fase 3: Flujo de despliegue (US2)

- [ ] T007 [FE] Escribir primero `tests/despliegue/flujo-despliegue.test.ts`: solo `push` a `main`; permisos `contents: read` + `id-token: write`; sin `secrets.`; todos los `uses:` por SHA; `concurrency` sin cancelar; despliegue por SHA de commit, nunca `latest`; llama al CI previo
- [ ] T008 [FE] Añadir `workflow_call` a `ci.yml` (y ajustar `tests/ci/flujo-ci.test.ts` conservando todas sus reglas) y crear `despliegue.yml` (CI → construir → publicar → actualizar → comprobar)
- [ ] T009 [FE] Ejecutar `tests/ci` y `tests/despliegue` en verde

## Fase 4: Documentación y cierre

- [ ] T010 [FE] Escribir `docs/despliegue-azure.md` (recursos, variables, variable `API_URL`, reversión a la imagen anterior) y enlazarlo en `README.md`
- [ ] T011 [FE] `npm run lint`, `type-check`, `test`, `build` en verde
- [ ] T012 [FE] Fila de HU-25 en `backlog.md`: Spec rellenada, Estado `En progreso` (parte web); commit `HU-25: despliegue continuo de la web`; avisar qué falta en api y en `[MANUAL]`
- [ ] T013 [MANUAL] Habilitar el flujo, hacer el primer merge a `main` y comprobar HTTPS, `/` y `/api/salud` (SC-001, SC-003); probar un fallo y ver que el servicio anterior sigue (SC-004)
- [ ] T014 [MANUAL] Marcar «Hecha» cuando ambos repos y T013 estén completos

## Dependencias

T001 → T004–T006 → T007–T009 → T010–T012. T002/T003 antes de T013. HU-25 api debe publicar su imagen y exponer `API_URL` antes de T013.
