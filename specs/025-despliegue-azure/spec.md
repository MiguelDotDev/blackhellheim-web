# Especificación de la funcionalidad: Despliegue continuo de la web a Azure (HU-25, parte web)

**Rama de trabajo**: `sprint/03` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-25 · **Sprint**: 3 · **Repos**: api + web (aquí solo la parte web) · **Componente**: CI · **Depende de**: HU-7, HU-8, HU-10
**Bloqueado por**: (a) HU-5 api (imagen y Compose de la API) y la parte api de HU-25 (destino de `/api`); (b) recursos de Azure creados por la desarrolladora (`[MANUAL]`). La parte api de esta historia se trabaja en el otro repositorio.
**Entrada**: «Quiero un primer despliegue continuo a Azure con la dirección por defecto, incluyendo el proxy de /api. Criterio: un push a la rama principal publica API y web como contenedores; la web carga por HTTPS y /api responde a través de ella.»

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - La web se empaqueta como contenedor (Prioridad: P1)

Quiero una imagen de contenedor que sirva la PWA compilada y reenvíe `/api` a la API.

**Prueba independiente**: construir la imagen en local, ejecutarla y pedir `/` y `/api/salud` (con un servidor de prueba de la API).

**Escenarios de aceptación**:

1. **Dado** la imagen, **Cuando** se pide `/`, **Entonces** responde la PWA; una ruta interna (`/acceso`) devuelve `index.html` (respaldo SPA).
2. **Dado** la imagen, **Cuando** se pide `/api/salud`, **Entonces** se reenvía a la API sin el prefijo `/api` ni cambios de método/cabeceras relevantes y la respuesta vuelve intacta.
3. **Dado** `sw.js`/`manifest`, **Cuando** se piden, **Entonces** no se sirven desde caché larga (el service worker debe actualizarse); los archivos con hash sí llevan caché inmutable.
4. **Dado** el contenedor, **Cuando** arranca, **Entonces** corre sin privilegios de root y no contiene código fuente ni `node_modules`.

### Historia de usuario 2 - Un push a `main` despliega (Prioridad: P1)

Quiero que un push a `main` construya la imagen, la publique y actualice el servicio en Azure con la dirección por defecto, sin secretos de larga vida en el repo.

**Prueba independiente**: tras habilitarlo (`[MANUAL]`), un merge a `main` termina con la web accesible por HTTPS.

**Escenarios de aceptación**:

1. **Dado** un push a `main`, **Cuando** el CI está en verde, **Entonces** se publica la imagen etiquetada con el SHA y se actualiza el servicio.
2. **Dado** un push a otra rama o un pull request, **Cuando** llega, **Entonces** no despliega.
3. **Dado** que el despliegue falla, **Cuando** ocurre, **Entonces** el servicio anterior sigue sirviendo y el flujo queda en rojo.
4. **Dado** el servicio desplegado, **Cuando** abro la dirección HTTPS por defecto de Azure, **Entonces** la web carga y `/api/salud` responde.

### Casos límite

- La API aún no está desplegada: `/api` responde 502 y la web sigue cargando; el despliegue no se considera sano hasta verificar `/api/salud` (verificación posterior, no bloqueante en la primera ejecución).
- Variable de destino de la API ausente: la imagen no arranca con un mensaje claro (no se asume un valor).
- Dos despliegues simultáneos: se serializan (`concurrency` sin cancelar).
- Etiqueta `latest` movible: no se usa para desplegar; se despliega por SHA.

## Requisitos *(obligatorio)*

- **FR-001**: `Dockerfile` multietapa: compila con la versión de Node de `.nvmrc` y sirve con nginx sin privilegios.
- **FR-002**: nginx MUST reenviar `/api/` a la dirección de la API definida por variable de entorno del contenedor, con respaldo SPA, cabeceras de seguridad básicas y caché correcta (escenarios 1 a 3 de la historia 1).
- **FR-003**: El build de producción MUST usar `VITE_API_URL=/api` (`.env.production`, HU-8); ninguna URL de Azure se incrusta en el código.
- **FR-004**: Flujo `.github/workflows/despliegue.yml` disparado solo por push a `main`, que exige el mismo CI en verde (mismas cuatro verificaciones), permisos mínimos (`contents: read`, `id-token: write` para OIDC) y acciones fijadas por SHA.
- **FR-005**: Autenticación contra Azure por identidad federada (OIDC); MUST NOT haber secretos ni contraseñas en el repo; los identificadores (cliente, tenant, suscripción) van en variables del repositorio no sensibles.
- **FR-006**: Pruebas automáticas MUST validar el flujo (disparadores, permisos, SHA, ausencia de `secrets.`) y la plantilla de nginx (proxy, respaldo SPA, caché de `sw.js`).
- **FR-007**: Documentación MUST explicar los recursos de Azure necesarios, las variables y cómo revertir.
- **FR-008**: Licencias de la imagen base y acciones verificadas y registradas (principio VIII).

## Criterios de éxito

- **SC-001**: Del merge a `main` a la web en línea en menos de 10 minutos.
- **SC-002**: 0 secretos en el repo; credenciales de Azure solo por OIDC.
- **SC-003**: `/` y `/api/salud` responden por HTTPS en la dirección por defecto.
- **SC-004**: Un despliegue fallido no interrumpe el servicio anterior.

## Supuestos

- Servicio objetivo: Azure Container Apps con Azure Container Registry (decisión provisional, ver plan D1); se revisa si la desarrolladora ya eligió otro servicio.
- Dominio propio y TLS personalizado quedan fuera: se usa la dirección por defecto.
- La parte api (imagen, despliegue, `API_URL` interna) vive en el repositorio del backend.
