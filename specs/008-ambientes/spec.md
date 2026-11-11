# Especificación de la funcionalidad: Ambientes de desarrollo, prueba y producción (HU-8)

**Rama de trabajo**: `sprint/02` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-8 · **Sprint**: 2 · **Repos**: web · **Componente**: FE · **Depende de**: HU-7
**Entrada**: «Como desarrolladora quiero ambientes de desarrollo, prueba y producción para que la URL del API cambie según `.env.development`, `.env.test` y `.env.production`. Criterio: la URL del API cambia según el entorno, y solo se exponen variables con prefijo `VITE_` sin secretos.»

## Escenarios de usuario y pruebas *(obligatorio)*

La «usuaria» es la desarrolladora, que trabaja en local, prueba y publica la aplicación contra destinos distintos sin editar código.

### Historia de usuario 1 - La URL del API cambia según el ambiente (Prioridad: P1)

Quiero elegir el ambiente (desarrollo, prueba o producción) y que la aplicación use automáticamente la URL del API de ese ambiente, definida en su archivo de configuración.

**Por qué esta prioridad**: es el criterio principal de la historia y condición para que el cliente de la API (HU-9) y el despliegue (HU-25) apunten al lugar correcto.

**Prueba independiente**: leer la configuración de cada ambiente y comprobar que la URL del API es la esperada y distinta en los tres; construir y arrancar la aplicación en cada ambiente sin cambiar ningún archivo de código.

**Escenarios de aceptación**:

1. **Dado** el ambiente de desarrollo, **Cuando** arranco la aplicación, **Entonces** la URL del API es la definida en `.env.development`.
2. **Dado** el ambiente de prueba, **Cuando** ejecuto las pruebas o construyo en modo prueba, **Entonces** la URL del API es la definida en `.env.test`.
3. **Dado** el ambiente de producción, **Cuando** construyo la versión final, **Entonces** la URL del API es la definida en `.env.production`.
4. **Dado** los tres archivos, **Cuando** los comparo, **Entonces** los tres valores son distintos entre sí.

---

### Historia de usuario 2 - Solo se exponen variables públicas y sin secretos (Prioridad: P1)

Quiero que a la aplicación del navegador solo lleguen variables con prefijo `VITE_` y que ningún archivo de configuración del repositorio contenga secretos, porque el repositorio es público y todo lo que llega al navegador es visible para cualquiera.

**Por qué esta prioridad**: es la segunda mitad del criterio y el principio IX (secretos y entornos) de la constitución; una fuga es irreversible una vez publicada.

**Prueba independiente**: definir una variable sin prefijo en el entorno del equipo y comprobar que no aparece en la aplicación; ejecutar la comprobación automática sobre los tres archivos y ver que rechaza nombres o valores con aspecto de secreto.

**Escenarios de aceptación**:

1. **Dado** una variable sin el prefijo `VITE_` (en el sistema o en un archivo de ambiente), **Cuando** construyo la aplicación, **Entonces** esa variable no está disponible para el código de la aplicación.
2. **Dado** un archivo de ambiente con una variable cuyo nombre no empieza por `VITE_`, **Cuando** corren las pruebas, **Entonces** fallan e indican el archivo y el nombre.
3. **Dado** un archivo de ambiente con una variable cuyo nombre sugiere un secreto (clave, token, contraseña, secreto) o una URL con credenciales incrustadas, **Cuando** corren las pruebas, **Entonces** fallan.
4. **Dado** que quiero un valor personal para mi máquina, **Cuando** lo escribo en un archivo local de sobrescritura, **Entonces** ese archivo no puede subirse al repositorio por accidente.

---

### Historia de usuario 3 - Error claro si la configuración falta o es inválida (Prioridad: P2)

Quiero que, si la URL del API falta o tiene un formato inválido, la aplicación falle de inmediato con un mensaje en español que diga qué variable corregir, en lugar de hacer peticiones a ninguna parte.

**Por qué esta prioridad**: evita depurar fallos silenciosos, pero las historias 1 y 2 ya cumplen el criterio sin ella.

**Prueba independiente**: probar la lectura de configuración con valor ausente, vacío y mal formado, y ver el mensaje esperado en cada caso.

**Escenarios de aceptación**:

1. **Dado** que la URL del API no está definida o está vacía, **Cuando** la aplicación lee su configuración, **Entonces** falla con un mensaje en español que nombra la variable y el archivo de ambiente a revisar.
2. **Dado** un valor que no es una dirección completa ni una ruta absoluta, **Cuando** la aplicación lee su configuración, **Entonces** falla con un mensaje que explica los formatos válidos.
3. **Dado** una URL válida terminada en barra, **Cuando** se lee, **Entonces** se normaliza sin la barra final para evitar rutas dobles.

---

### Casos límite

- Ambiente desconocido (por ejemplo, un modo inventado): usa solo las variables comunes y falla con el mensaje de la historia 3 si falta la URL.
- Un valor personal local sobrescribe al del ambiente: es el comportamiento esperado, pero nunca debe viajar al repositorio.
- Una variable con prefijo correcto pero con aspecto de secreto (`VITE_CLAVE_API`): las pruebas la rechazan (todo lo `VITE_` es público en el navegador).
- Comillas, espacios o comentarios en los archivos de ambiente: la lectura no debe romperse ni incluirlos en el valor.
- Los tres archivos ya existen en el repositorio y sin valores reales de producción sensibles: la URL de producción es pública por naturaleza.

## Requisitos *(obligatorio)*

### Requisitos funcionales

- **FR-001**: El repositorio MUST incluir los archivos de configuración `.env.development`, `.env.test` y `.env.production`.
- **FR-002**: Cada archivo MUST definir la URL del API de su ambiente, y las tres URL MUST ser distintas entre sí.
- **FR-003**: El código de la aplicación MUST obtener la URL del API únicamente de la configuración de ambiente; MUST NOT haber direcciones del API escritas en el código.
- **FR-004**: Solo las variables cuyo nombre empiece por `VITE_` MUST estar disponibles para el código de la aplicación.
- **FR-005**: Los archivos de ambiente versionados MUST NOT contener secretos (claves, tokens, contraseñas, credenciales incrustadas en URL).
- **FR-006**: Los archivos de sobrescritura local MUST quedar excluidos del repositorio.
- **FR-007**: La aplicación MUST validar la URL del API al leerla y fallar con un mensaje en español que nombre la variable cuando falte, esté vacía o tenga formato inválido.
- **FR-008**: La URL leída MUST normalizarse sin barra final.
- **FR-009**: Debe existir una forma documentada de construir la aplicación para cada ambiente (desarrollo, prueba, producción).
- **FR-010**: Pruebas automatizadas MUST demostrar: que las tres URL difieren, que no hay variables sin prefijo ni secretos en los archivos, y que una variable sin prefijo no llega a la aplicación.
- **FR-011**: La documentación MUST explicar qué contiene cada ambiente y cómo usar valores personales locales.

### Entidades clave

- **Ambiente**: modo de ejecución con nombre (desarrollo, prueba, producción) y su propia configuración.
- **Configuración de ambiente**: conjunto de variables públicas de un ambiente; hoy contiene la URL del API.
- **URL del API**: dirección base a la que la aplicación pide datos; puede ser absoluta (con servidor) o una ruta del mismo origen.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

- **SC-001**: Cambiar de ambiente cambia la URL del API en los 3 ambientes con 0 ediciones de código.
- **SC-002**: La comprobación automática encuentra 0 variables sin prefijo y 0 secretos en los archivos de ambiente del repositorio, y detecta el 100 % de los casos sintéticos de prueba (nombre sin prefijo, nombre sospechoso, URL con credenciales).
- **SC-003**: Con la configuración rota, el mensaje de error aparece en el primer arranque y nombra la variable el 100 % de las veces.
- **SC-004**: Una persona nueva configura un valor personal local en menos de 2 minutos leyendo solo la documentación.

## Supuestos

- Los ambientes se corresponden con los tres «modos» de la herramienta de empaquetado: desarrollo (por defecto al arrancar), prueba (modo de las pruebas) y producción (construcción final).
- Valores iniciales, decididos aquí por no venir en la historia: **desarrollo** apunta al servidor mock local de la HU-9; **prueba** apunta a la API real levantada en local (la dirección que publica el contrato del backend); **producción** usa una ruta del mismo origen (`/api`), porque la especificación 000 prevé que el contenedor de la aplicación reenvíe `/api` a la API sin CORS. Los valores exactos van en el plan.
- Si más adelante existe un ambiente de prueba desplegado con dirección propia, se cambia el valor del archivo en la historia de despliegue (HU-25); esta historia no lo inventa.
- La única variable pública necesaria hoy es la URL del API; futuras variables públicas (por ejemplo, la clave pública de notificaciones) se añaden en sus historias siguiendo las mismas reglas.
- Cualquier valor secreto (si algún día hiciera falta) vive en el backend, nunca en esta aplicación.
- No incluye el cliente de la API (HU-9) ni el despliegue (HU-25); solo deja la URL disponible y validada.
- Depende de la HU-7 (proyecto, comandos y estructura de capas).
