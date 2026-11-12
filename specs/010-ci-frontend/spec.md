# Especificación de la funcionalidad: Integración continua del frontend (HU-10)

**Rama de trabajo**: `sprint/02` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-10 · **Sprint**: 2 · **Repos**: web · **Componente**: CI · **Depende de**: HU-7
**Entrada**: «Como desarrolladora quiero integración continua con lint, verificación de tipos, pruebas y build, para que ningún cambio con errores llegue sin que yo lo note. Criterio: cada push y cada pull request corren las cuatro verificaciones. Disparadores: pull requests hacia `main`, `release`, `developer` y `sprint/**`, y push a esas ramas; permisos mínimos, menos de 10 minutos, sin secretos.»

## Escenarios de usuario y pruebas *(obligatorio)*

La «usuaria» es la desarrolladora, que sube cambios a ramas de sprint y abre pull requests a lo largo de la cadena `sprint/NN` → `developer` → `release` → `main`.

### Historia de usuario 1 - Las cuatro verificaciones corren solas (Prioridad: P1)

Quiero que cada cambio subido o propuesto ejecute automáticamente el lint, la verificación de tipos, las pruebas y el build, y que cada una muestre su propio resultado (verde o rojo).

**Por qué esta prioridad**: es el objetivo de la historia y el principio VI de la constitución.

**Prueba independiente**: subir un cambio correcto y ver cuatro resultados verdes; subir uno con un error de cada tipo y ver fallar solo la verificación correspondiente.

**Escenarios de aceptación**:

1. **Dado** un cambio sin errores, **Cuando** se sube, **Entonces** aparecen cuatro resultados (lint, tipos, pruebas, build) y los cuatro terminan en éxito.
2. **Dado** un cambio con un error de estilo o de arquitectura de capas, **Cuando** se sube, **Entonces** falla la verificación de lint y el resto siguen mostrando su propio resultado.
3. **Dado** un cambio con un error de tipos, de prueba o de construcción, **Cuando** se sube, **Entonces** falla la verificación correspondiente y la ejecución completa se marca como fallida.
4. **Dado** que una verificación falla, **Cuando** reviso el resultado, **Entonces** identifico cuál fue y veo su salida completa sin descargar nada.

---

### Historia de usuario 2 - Corre en las ramas y pull requests de la cadena de trabajo (Prioridad: P1)

Quiero que las verificaciones se disparen con cada push a `main`, `release`, `developer` y cualquier rama `sprint/**`, y con cada pull request cuyo destino sea una de esas ramas.

**Por qué esta prioridad**: define dónde protege la CI; sin los disparadores correctos habría pull requests sin verificar.

**Prueba independiente**: comprobar la configuración contra la lista de ramas y observar una ejecución real por push y otra por pull request.

**Escenarios de aceptación**:

1. **Dado** un push a `sprint/02`, **Cuando** llega, **Entonces** se ejecutan las cuatro verificaciones.
2. **Dado** un push a `developer`, `release` o `main`, **Cuando** llega, **Entonces** se ejecutan las cuatro verificaciones.
3. **Dado** un pull request de `sprint/02` hacia `developer` (o de `developer` a `release`, o de `release` a `main`), **Cuando** se abre o recibe nuevos cambios, **Entonces** se ejecutan las cuatro verificaciones.
4. **Dado** un push a una rama que no sigue la cadena (por ejemplo, `experimento`), **Cuando** llega, **Entonces** no se ejecutan (evita ruido y consumo).

---

### Historia de usuario 3 - Segura, rápida y sin secretos (Prioridad: P1)

Quiero que el flujo tenga permisos mínimos (solo lectura del repositorio), no use secretos, termine en menos de 10 minutos y no pueda quedarse colgado, porque el repositorio es público y los pull requests pueden venir de cualquier persona.

**Por qué esta prioridad**: lo piden explícitamente la historia y el principio IX; un flujo con privilegios en un repositorio público es una puerta de ataque.

**Prueba independiente**: revisar automáticamente la configuración (permisos, límite de tiempo, ausencia de secretos, terceros fijados) y comprobar en una ejecución real que cada verificación dura menos de 10 minutos.

**Escenarios de aceptación**:

1. **Dado** la configuración del flujo, **Cuando** la reviso, **Entonces** declara únicamente permiso de lectura del contenido del repositorio.
2. **Dado** la configuración del flujo, **Cuando** busco secretos, **Entonces** no hay ninguna referencia a secretos y el flujo no se dispara con privilegios elevados por pull requests de terceros.
3. **Dado** una verificación que se cuelga, **Cuando** pasan 10 minutos, **Entonces** se cancela y se marca como fallida.
4. **Dado** que subo varios cambios seguidos al mismo pull request, **Cuando** llega el siguiente, **Entonces** se cancela la ejecución obsoleta del mismo pull request.
5. **Dado** una acción de terceros usada por el flujo, **Cuando** reviso la configuración, **Entonces** está fijada a una versión inmutable y tiene licencia libre verificada.

---

### Historia de usuario 4 - Los resultados se pueden exigir antes de unir cambios (Prioridad: P2)

Quiero poder exigir que las cuatro verificaciones pasen antes de unir un pull request a `developer`, `release` o `main`, y tener documentado cómo reproducir un fallo en mi máquina.

**Por qué esta prioridad**: cumple el principio XI («los controles de CI son obligatorios en cuanto existan»), pero requiere acciones de administración fuera del código.

**Prueba independiente**: intentar unir un pull request con una verificación en rojo y ver que se bloquea; seguir la documentación para reproducir el fallo localmente.

**Escenarios de aceptación**:

1. **Dado** un pull request con una verificación fallida, **Cuando** intento unirlo, **Entonces** el repositorio lo impide.
2. **Dado** un fallo en CI, **Cuando** sigo la documentación, **Entonces** ejecuto el mismo comando en local y obtengo el mismo resultado.

---

### Casos límite

- Un pull request y un push a la misma rama (por ejemplo, `sprint/02` con un PR abierto) generan dos ejecuciones: es lo esperado, y la cancelación solo aplica a ejecuciones obsoletas del mismo contexto.
- Pull request desde un fork: corre con permisos de solo lectura y sin secretos (no hay ninguno).
- La instalación de dependencias falla (red o paquete retirado): las cuatro verificaciones fallan con un mensaje de instalación, no con un falso verde.
- Diferencia de versión de herramientas entre local y CI: el flujo usa la misma versión de Node que el repositorio declara.
- Dependencias sin archivo de bloqueo: la instalación reproducible falla y lo dice; el archivo de bloqueo debe estar versionado.
- Una verificación pasa localmente pero falla en CI por variables de ambiente o rutas: se corrige el código o la configuración, nunca se desactiva la verificación.
- Rama `sprint/**` con barras anidadas (`sprint/02/ajuste`): también se verifica.

## Requisitos *(obligatorio)*

### Requisitos funcionales

- **FR-001**: Cada push a `main`, `release`, `developer` y `sprint/**` MUST ejecutar lint, verificación de tipos, pruebas y build.
- **FR-002**: Cada pull request con destino `main`, `release`, `developer` o `sprint/**` MUST ejecutar las mismas cuatro verificaciones.
- **FR-003**: Cada verificación MUST ejecutar el mismo comando que usa la desarrolladora en local (`npm run lint`, `npm run type-check`, `npm run test`, `npm run build`).
- **FR-004**: Cada verificación MUST mostrar un resultado propio, y el fallo de una MUST NOT impedir que las demás terminen y muestren el suyo.
- **FR-005**: Si cualquiera de las cuatro falla, la ejecución completa MUST considerarse fallida.
- **FR-006**: El flujo MUST declarar permisos mínimos: solo lectura del contenido del repositorio.
- **FR-007**: El flujo MUST NOT usar secretos ni dispararse con privilegios elevados desde pull requests de terceros.
- **FR-008**: Cada verificación MUST tener un límite de tiempo de 10 minutos como máximo; una ejecución normal MUST terminar en menos de 5.
- **FR-009**: El flujo MUST instalar dependencias de forma reproducible desde el archivo de bloqueo y usar la versión de Node declarada por el repositorio.
- **FR-010**: Las acciones de terceros MUST fijarse a una versión inmutable, ser software libre y tener su licencia verificada y registrada (principio VIII).
- **FR-011**: Una ejecución obsoleta del mismo pull request MUST cancelarse cuando llegue una nueva.
- **FR-012**: Pruebas automatizadas MUST verificar la configuración del flujo: ramas, las cuatro verificaciones, permisos, límite de tiempo, ausencia de secretos y terceros fijados.
- **FR-013**: La documentación MUST explicar cómo leer un fallo, cómo reproducirlo en local y cómo exigir las verificaciones antes de unir.
- **FR-014**: Las cuatro verificaciones MUST quedar configuradas como obligatorias para unir pull requests a `developer`, `release` y `main` (acción de administración del repositorio, manual).

### Entidades clave

- **Flujo de CI**: definición versionada de las verificaciones y sus disparadores.
- **Verificación**: una de las cuatro comprobaciones (lint, tipos, pruebas, build), con resultado propio.
- **Ejecución**: instancia del flujo para un push o pull request concretos.
- **Regla de protección de rama**: configuración del repositorio que exige verificaciones y pull request antes de unir.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

- **SC-001**: El 100 % de los push y pull requests a las ramas de la cadena dispara las cuatro verificaciones.
- **SC-002**: Cada verificación termina en menos de 10 minutos (el flujo la corta) y, en uso normal, en menos de 5.
- **SC-003**: El flujo tiene 0 referencias a secretos y solo el permiso de lectura de contenido.
- **SC-004**: Un error provocado a propósito de cada uno de los cuatro tipos hace fallar la verificación correspondiente (4 de 4 en una prueba real).
- **SC-005**: Desde un pull request, la desarrolladora identifica cuál verificación falló en menos de 1 minuto.
- **SC-006**: Un pull request con una verificación en rojo no se puede unir a `developer`, `release` ni `main` una vez configuradas las reglas de protección.

## Supuestos

- El repositorio está en GitHub y es público (constitución IX); la plataforma de CI es la integrada del repositorio. El mecanismo concreto va en el plan.
- Los pull requests de forks son poco probables (equipo de una persona) pero se tratan con la misma cautela.
- No incluye despliegue (HU-25 y HU-40), análisis estático externo ni escaneo de código (el backend tiene SonarQube y CodeQL en su HU-6; aquí no se piden).
- No incluye cobertura de pruebas ni publicación de artefactos.
- Las reglas de protección de ramas y la habilitación de la CI en el repositorio son acciones de administración que solo la desarrolladora puede hacer: quedan como tareas manuales y la historia no se considera «Hecha» hasta completarlas.
- Depende de la HU-7 (scripts, `.nvmrc`, archivo de bloqueo). Las HU-8 y HU-9 amplían las pruebas que correrán, sin cambiar el flujo.
- Las pruebas de este repositorio no necesitan red externa ni servicios; las que levantan el mock usan un puerto libre local.
