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

## Recursos de Azure (los crea la desarrolladora)

1. Grupo de recursos y entorno de Container Apps.
2. Container App de la web: ingreso externo HTTPS al puerto 8080, variable de entorno `API_URL` con la dirección interna de la API, sondeo de salud en `/` (así una revisión defectuosa no recibe tráfico), modo de una sola revisión activa.
3. App registrada en Entra ID con credencial federada: entidad `repo:<dueño>/blackhellheim-web:environment:produccion` (el trabajo usa el entorno `produccion`, por eso el sujeto OIDC es de entorno y no de rama). Rol Contributor solo sobre la Container App.
4. Tras la primera publicación, volver público el paquete `blackhellheim-web` en GHCR para que Azure lo descargue sin credenciales.

## Variables de GitHub (no secretas; Settings → Secrets and variables → Actions → Variables)

`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_RESOURCE_GROUP`, `APP_WEB`. Crear también el entorno `produccion` (conviene exigir aprobación).

## Reversión

```bash
az containerapp revision list -n <APP_WEB> -g <GRUPO> -o table
az containerapp update -n <APP_WEB> -g <GRUPO> --image ghcr.io/<dueño>/blackhellheim-web:<sha-anterior>
```

Cada imagen está etiquetada con el SHA del commit, así que volver atrás es apuntar a un SHA anterior.
