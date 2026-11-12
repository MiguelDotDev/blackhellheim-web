# Etapa 1: compilar con la versión de Node de .nvmrc (la prueba tests/despliegue/imagen.test.ts vigila que coincidan).
# Licencias: node (MIT), nginxinc/nginx-unprivileged y nginx (BSD-2-Clause).
FROM node:24-alpine AS compilar
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Modo producción: .env.production fija VITE_API_URL=/api (mismo origen, sin URLs de Azure en el código).
RUN npm run build

# Etapa 2: nginx sin privilegios (usuario nginx, puerto 8080).
FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY --from=compilar /app/dist /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/cabeceras-seguridad.conf /etc/nginx/snippets/cabeceras-seguridad.conf
# El bit de ejecución viene de git (modo 755), así no se exige BuildKit.
COPY nginx/exigir-api-url.sh /docker-entrypoint.d/05-exigir-api-url.sh
EXPOSE 8080
# API_URL es obligatoria (se define en la Container App); no hay valor por defecto a propósito.
