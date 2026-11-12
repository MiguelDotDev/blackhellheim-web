# Despliegue de la web en Azure (HU-25, parte web)

Flujo: push a `main` → CI (las cuatro verificaciones) → `docker build` → push a GHCR (`ghcr.io/<dueño en minúsculas>/blackhellheim-web:<sha>`) → `az containerapp update --image` → comprobación de `/`. Sin ACR, sin secretos: Azure por OIDC y GHCR con `github.token`.

## Imagen

- `Dockerfile` multietapa: `node:24-alpine` (misma versión mayor que `.nvmrc`) compila con `VITE_API_URL=/api`; `nginxinc/nginx-unprivileged` sirve en el puerto **8080** como usuario `nginx`.
- `nginx/default.conf.template`: `/api/` → `${API_URL}/` (se quita el prefijo `/api`: el backend publica `/salud`, no `/api/salud`), respaldo SPA, `/assets/` inmutable, `sw.js`/`index.html`/`manifest.webmanifest` con `no-cache`, `Set-Cookie` sin filtrar.
- `API_URL` es **obligatoria**, sin barra final (`http://api:8080`). Sin ella el contenedor no arranca y lo dice en español. nginx resuelve el nombre al arrancar: la API debe ser alcanzable entonces.
- Licencias: nginx y nginx-unprivileged BSD-2-Clause, Node MIT, `azure/login` MIT, `actions/checkout` MIT, Azure CLI MIT, GHCR servicio gratuito.

Probar en local:

```bash
docker build -t bhh-web:local .
MOCK_PUERTO=4011 npm run mock &
docker run --rm --network host -e API_URL=http://127.0.0.1:4011 bhh-web:local
curl http://127.0.0.1:8080/api/salud    # {"estado":"ok"}
```

## Recursos de Azure (scripts en `scripts/azure/`)

Orden de ejecución (con `az login` hecho; los scripts son idempotentes):

1. **Primero el API**: `crear-recursos.sh` del backend (grupo `bhh-prod-rg`, entorno `bhh-prod-env`, app `bhh-api`). El web se crea **después**: `crear-web.sh` falla si `bhh-api` no existe.
2. `scripts/azure/crear-web.sh`: Container App `bhh-web` en el mismo grupo y entorno (región leída del entorno), ingreso externo HTTPS, puerto 8080, 0.25 vCPU / 0.5 Gi, 0–1 réplicas, una sola revisión, `API_URL=http://bhh-api` (nombre corto de la app dentro del entorno, sin barra final). Arranca con la imagen de ejemplo de Microsoft; el puerto 8080 ya queda fijado porque el workflow solo ejecuta `az containerapp update --image` y no cambia puerto ni variables. Hasta el primer despliegue la URL dará error: es esperado.
3. `scripts/azure/configurar-oidc-web.sh`: app de Entra ID con credencial federada `repo:MiguelDotDev/blackhellheim-web:environment:produccion` y Contributor solo sobre la Container App `bhh-web`. Imprime las cinco variables de GitHub.
4. Crear en GitHub el entorno `produccion` y las variables (sección siguiente), y hacer push a `main`.
5. Tras la primera publicación, volver público el paquete `blackhellheim-web` en GHCR para que Azure lo descargue sin credenciales.

Sin sondeo de salud: `az containerapp create` no tiene opciones para sondeos (solo YAML), así que no se configura; el workflow comprueba `/` tras desplegar.

### Riesgos conocidos

- **504 por arranque en frío**: el API (min-replicas 0) y la base serverless (autopausa) tardan en despertar y el `proxy_read_timeout` por defecto de nginx es 60 s. La primera petición a `/api/` tras inactividad puede dar 504; reintentar suele bastar. Si molesta, subir `proxy_read_timeout` en `nginx/default.conf.template` o dar `min-replicas 1` al API.
- **Orden de creación**: nginx resuelve `API_URL` al arrancar; si el API no existe el contenedor no arranca. Crear siempre el API antes que el web.

## Variables de GitHub (no secretas; Settings → Secrets and variables → Actions → Variables)

`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_RESOURCE_GROUP`, `APP_WEB`. Crear también el entorno `produccion` (conviene exigir aprobación).

## Reversión

```bash
az containerapp revision list -n <APP_WEB> -g <GRUPO> -o table
az containerapp update -n <APP_WEB> -g <GRUPO> --image ghcr.io/<dueño>/blackhellheim-web:<sha-anterior>
```

Cada imagen está etiquetada con el SHA del commit, así que volver atrás es apuntar a un SHA anterior.
