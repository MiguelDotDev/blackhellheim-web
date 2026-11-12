#!/usr/bin/env bash
# Nombres de los recursos de Azure del web (HU-25). Se hace `source`; no contiene secretos.
# Mismas convenciones que blackhellheim-api/scripts/azure/variables.sh: grupo y entorno compartidos.
set -euo pipefail

: "${BHH_RG:=bhh-prod-rg}"
: "${BHH_ENTORNO:=bhh-prod-env}"
: "${BHH_APP_API:=bhh-api}"
: "${BHH_APP_WEB:=bhh-web}"
: "${BHH_REPO_WEB:=MiguelDotDev/blackhellheim-web}"   # propietario/repositorio de GitHub
: "${BHH_ENTORNO_GITHUB:=produccion}"
: "${BHH_CPU:=0.25}"
: "${BHH_MEMORIA:=0.5Gi}"
: "${BHH_IMAGEN_ARRANQUE:=mcr.microsoft.com/k8se/quickstart:latest}"
# Puerto de nginx-unprivileged. El workflow solo cambia la imagen, no el puerto: se fija desde el inicio.
: "${BHH_PUERTO_WEB:=8080}"

fallar() { echo "ERROR: $1" >&2; exit 1; }

requerir_az() {
  command -v az >/dev/null 2>&1 || fallar "Falta Azure CLI (az)."
  az account show >/dev/null 2>&1 || fallar "No hay sesión de Azure: ejecuta 'az login'."
}
