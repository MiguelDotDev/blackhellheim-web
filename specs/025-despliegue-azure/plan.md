# Plan de implementación: Despliegue a Azure, parte web (HU-25)

**Rama**: `sprint/03` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-5/HU-25 api y recursos de Azure

## Resumen

Imagen `nginx-unprivileged` con la PWA compilada y proxy de `/api`; flujo de despliegue en GitHub Actions por OIDC. Todo lo que cree recursos en Azure o configure GitHub es `[MANUAL]`.

## Decisiones

- **D1 Servicio**: Azure Container Apps (HTTPS y dirección `*.azurecontainerapps.io` por defecto, escala a cero) + GitHub Container Registry (GHCR, decisión del proyecto: gratis, sin ACR). Alternativa: App Service para contenedores (más simple, sin escala a cero). Provisional.
- **D2 Proxy**: plantilla `nginx/default.conf.template` con `${API_URL}`; la imagen oficial sustituye variables al arrancar. `proxy_pass ${API_URL}/;` quita el prefijo `/api`.
- **D3 Caché**: `/assets/*` con `immutable, max-age=31536000`; `sw.js`, `index.html` y `manifest.webmanifest` con `no-cache`.
- **D4 OIDC**: `azure/login` con `client-id`, `tenant-id`, `subscription-id` desde `vars.*`; sin `secrets.`.
- **D7 GHCR**: el flujo agrega `packages: write` a los permisos y se autentica con `github.token` (no es un secreto del repositorio). La imagen se publica como paquete público (repositorio público) para que Container Apps la descargue sin credenciales de registro.
- **D5 Despliegue por SHA**: `docker build` → push a `ghcr.io/<dueño>/blackhellheim-web:<sha>` con `github.token` → `az containerapp update --image`. Comprobación posterior de `/` (y `/api/salud` informativo).
- **D6 CI previo**: el despliegue invoca el flujo de CI como reutilizable (`workflow_call` añadido a `ci.yml`, ajustando la prueba de HU-10) o repite las cuatro verificaciones; se elige `workflow_call` para no duplicar. Cambio a `ci.yml` y su prueba en esta HU.

## Licencias (a confirmar en la tarea de verificación)

nginx (BSD-2-Clause), `nginxinc/nginx-unprivileged` (BSD-2-Clause), `azure/login` (MIT), `docker/login-action` (MIT), `docker/build-push-action` (Apache-2.0), Azure CLI (MIT), GHCR (servicio gratuito de GitHub).

## Verificación de la constitución

I N/A · II cumple (`/api` único origen) · V cumple (mismo origen para la cookie) · VI pruebas del flujo y nginx · VIII licencias · IX sin secretos (OIDC, variables no sensibles) · X español · XI solo `main` despliega.

## Estructura

```text
Dockerfile  .dockerignore  nginx/default.conf.template
.github/workflows/despliegue.yml  (+ workflow_call en ci.yml)
tests/despliegue/{flujo-despliegue.test.ts, nginx.test.ts}
docs/despliegue-azure.md   # recursos, variables, reversión
```

## Riesgos

- **R-1**: la cookie de refresh requiere mismo origen ⇒ el proxy debe conservar `Set-Cookie` y `Host`/`X-Forwarded-*`.
- **R-2**: sin Docker local no se puede probar la imagen: la tarea de construcción queda `[MANUAL]` si `docker` no existe.
- **R-3**: el SHA de acciones cambia con el tiempo; se consulta al implementar.
