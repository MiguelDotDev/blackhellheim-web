#!/usr/bin/env bash
# Crea la Container App del web en el grupo y entorno del API. Idempotente; no ejecutar sin revisar.
# Requiere que el API ya exista (ver docs/despliegue-azure.md): nginx resuelve API_URL al arrancar.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
source ./variables.sh
requerir_az

az containerapp show -n "$BHH_APP_API" -g "$BHH_RG" -o none 2>/dev/null \
  || fallar "No existe '$BHH_APP_API' en '$BHH_RG': crea primero el API (crear-recursos.sh del backend)."

# La región se toma del entorno existente, no se fija aquí.
region="$(az containerapp env show -n "$BHH_ENTORNO" -g "$BHH_RG" --query location -o tsv)"
[[ -n "$region" ]] || fallar "No se pudo leer la región del entorno '$BHH_ENTORNO'."

# Dirección interna del API: dentro del entorno basta el nombre corto de la app, sin barra final.
api_url="http://$BHH_APP_API"

# Imagen de arranque: la imagen real de GHCR no existe hasta el primer despliegue desde main.
# El puerto de ingreso ya es 8080 (el de nginx); el workflow solo hace `update --image`, no toca puerto ni
# variables. Hasta ese primer despliegue la app responderá error porque la imagen de arranque escucha en el 80.
az containerapp show -n "$BHH_APP_WEB" -g "$BHH_RG" -o none 2>/dev/null \
  || az containerapp create -n "$BHH_APP_WEB" -g "$BHH_RG" --environment "$BHH_ENTORNO" \
       --image "$BHH_IMAGEN_ARRANQUE" --ingress external --target-port "$BHH_PUERTO_WEB" \
       --revisions-mode single --cpu "$BHH_CPU" --memory "$BHH_MEMORIA" \
       --min-replicas 0 --max-replicas 1 \
       --env-vars "API_URL=$api_url" -o none

echo "Región del entorno: $region · API_URL=$api_url"
echo "URL pública del web: https://$(az containerapp show -n "$BHH_APP_WEB" -g "$BHH_RG" --query properties.configuration.ingress.fqdn -o tsv)"
