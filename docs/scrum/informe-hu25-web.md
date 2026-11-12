# Informe HU-25 (parte web, tareas automáticas)

Rama `sprint/03` · commit de código `368d607` · sin push.

## Lecturas tomadas (trabajo desatendido)
- «Tareas automáticas» = las marcadas `[FE]` en `specs/025-despliegue-azure/tasks.md`; las `[MANUAL]` quedan pendientes.
- HU-25 sigue «En progreso» en `backlog.md` (hay `[MANUAL]` y falta la parte api).
- Solo CLI de Docker (sin `docker/login-action` ni `build-push-action`): una acción externa menos (`azure/login` v3.1.0, fijada por SHA).
- Variable extra `AZURE_RESOURCE_GROUP`; el sujeto OIDC es de entorno (`environment:produccion`), no de rama.

## Verificaciones
| Verificación | Resultado |
|---|---|
| `npm run lint` | verde |
| `npm run type-check` | verde |
| `npm run test` | verde, 28 archivos / 127 pruebas |
| `npm run build` | verde; `dist` sin URLs de Azure |
| Pruebas de flujos (`tests/ci`, `tests/despliegue`) | verdes; sin `secrets.` en `despliegue.yml` |
| `docker build` | OK tras un fallo propio: `.dockerignore` excluía `mock/` y `tests/` que `vue-tsc --build` necesita; corregido (2.º intento) |
| Contenedor sin `API_URL` | no arranca, mensaje en español |
| Contenedor con API simulada (`npm run mock`) | `/` y `/acceso` 200; `/api/salud` → `{"estado":"ok"}` (el prefijo `/api` se quita); `Set-Cookie` HttpOnly pasa; `/assets/` inmutable; `/` `no-cache`; corre como `nginx` |

No se ejecutó el flujo, ni login a Azure, ni se crearon recursos.

## Pendiente `[MANUAL]`
- T002 Recursos de Azure (grupo, entorno, Container App con `API_URL`, sondeo `/`, app registrada con credencial federada `repo:<dueño>/blackhellheim-web:environment:produccion`, rol mínimo).
- T002b Hacer público el paquete GHCR tras la primera publicación.
- T003 Variables de GitHub (`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_RESOURCE_GROUP`, `APP_WEB`) y entorno `produccion`.
- T013 Primer merge a `main` y comprobar HTTPS, `/` y `/api/salud`; probar un fallo.
- T014 Marcar «Hecha» con ambos repos.
- Falta además la HU-25 del API (publicar su imagen y exponer `API_URL`).

## Riesgos / no verificado
- El flujo nunca se ha ejecutado en GitHub; `az containerapp update` y la comprobación final son código sin probar.
- `docker build` local usó el constructor clásico; en Actions (BuildKit) no debería diferir.
- nginx resuelve el nombre de `API_URL` al arrancar: si la API no es resoluble, el contenedor cae.

## Push
```bash
git push origin sprint/03
```
