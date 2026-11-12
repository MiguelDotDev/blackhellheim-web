#!/bin/sh
# Corre antes de la sustitución de plantillas de la imagen oficial: sin API_URL el proxy quedaría roto.
if [ -z "${API_URL:-}" ]; then
  echo "Error: falta la variable de entorno API_URL (dirección interna de la API, por ejemplo http://api:8080). El contenedor no arranca sin ella." >&2
  exit 1
fi
case "$API_URL" in
  http://*|https://*) ;;
  *) echo "Error: API_URL debe empezar por http:// o https:// (valor recibido: $API_URL)." >&2; exit 1 ;;
esac
case "$API_URL" in
  */) echo "Error: API_URL no debe terminar en «/» (la plantilla ya la añade)." >&2; exit 1 ;;
esac
