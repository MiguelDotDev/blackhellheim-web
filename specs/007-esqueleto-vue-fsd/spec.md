# Especificación de la funcionalidad: Esqueleto de la aplicación web con capas ordenadas (HU-7)

**Rama de trabajo**: `sprint/02` (no hay rama por historia) · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-7 · **Sprint**: 2 · **Repos**: web · **Componente**: FE
**Entrada**: «Como desarrolladora quiero un esqueleto de aplicación web con navegación, estado compartido y estilos, organizado en las capas aplicacion, paginas, widgets, funcionalidades, entidades y compartido, para que cada cambio nazca ordenado. Criterio: `npm run lint` falla si una capa importa de otra superior o si se importa saltando el `index.ts` de un slice.»

## Escenarios de usuario y pruebas *(obligatorio)*

La «usuaria» de esta historia es la desarrolladora del proyecto: quien clona el repositorio y construye las pantallas de las historias siguientes.

### Historia de usuario 1 - El proyecto se instala, arranca y se verifica (Prioridad: P1)

Quiero clonar el repositorio, instalar y ver la aplicación funcionando en el navegador, con los cuatro comandos de verificación (lint, verificación de tipos, pruebas y build) disponibles y en verde.

**Por qué esta prioridad**: sin un proyecto que arranque no existe base para ninguna otra historia; además HU-8, HU-9 y HU-10 dependen de estos comandos.

**Prueba independiente**: en una copia limpia, instalar y ejecutar los cinco comandos (arranque en desarrollo y las cuatro verificaciones); todos terminan sin errores y el arranque muestra una página de inicio con la marca **BlackHellHeim**.

**Escenarios de aceptación**:

1. **Dado** una copia limpia del repositorio, **Cuando** instalo dependencias y arranco en modo desarrollo, **Entonces** la aplicación se abre en el navegador y muestra la página de inicio con la marca.
2. **Dado** el proyecto recién instalado, **Cuando** ejecuto `npm run lint`, `npm run type-check`, `npm run test` y `npm run build`, **Entonces** los cuatro terminan con éxito.
3. **Dado** el resultado del build, **Cuando** lo sirvo localmente, **Entonces** la página de inicio se ve igual que en desarrollo.

---

### Historia de usuario 2 - Las capas existen y están nombradas en español (Prioridad: P1)

Quiero encontrar la estructura ya creada con las seis capas (`aplicacion`, `paginas`, `widgets`, `funcionalidades`, `entidades`, `compartido`), con los segmentos `ui`, `modelo`, `api` y `lib` donde correspondan, y una explicación breve de qué va en cada capa.

**Por qué esta prioridad**: es el objetivo de la historia («que cada cambio nazca ordenado»); sin las capas, las reglas de importación no tienen a qué aplicarse.

**Prueba independiente**: abrir el árbol de `src/` y comprobar que existen las seis carpetas con los nombres exactos y que una página de ejemplo recorre las capas desde la aplicación hasta lo compartido.

**Escenarios de aceptación**:

1. **Dado** el proyecto instalado, **Cuando** reviso `src/`, **Entonces** existen las seis capas con esos nombres exactos, sin traducciones mezcladas.
2. **Dado** la página de inicio, **Cuando** sigo sus importaciones, **Entonces** cada una va de una capa a otra inferior y entra a cada slice por su `index.ts`.
3. **Dado** una persona nueva en el proyecto, **Cuando** lee la guía de capas, **Entonces** sabe en qué capa y segmento colocar un componente, una regla de negocio y una llamada a la API.

---

### Historia de usuario 3 - El lint rechaza importaciones que rompen la arquitectura (Prioridad: P1)

Quiero que `npm run lint` falle cuando una capa importa de otra superior, cuando un slice importa de otro slice de su misma capa, o cuando se importa un archivo interno de un slice sin pasar por su `index.ts`, y que el mensaje diga qué regla se rompió.

**Por qué esta prioridad**: es el criterio de aceptación explícito de la historia y el principio I (no negociable) de la constitución.

**Prueba independiente**: introducir a propósito cada una de las tres violaciones y comprobar que el lint falla con la regla correcta; revertir y comprobar que vuelve a pasar. Estas comprobaciones quedan automatizadas como pruebas.

**Escenarios de aceptación**:

1. **Dado** un archivo de `entidades` que importa algo de `widgets` (capa superior), **Cuando** ejecuto el lint, **Entonces** falla y el mensaje nombra la capa de origen y la de destino.
2. **Dado** una página que importa `src/entidades/producto/modelo/precio.ts` (interno del slice), **Cuando** ejecuto el lint, **Entonces** falla indicando que debe importarse desde `src/entidades/producto` (su `index.ts`).
3. **Dado** una página que importa el `index.ts` de un slice de una capa inferior, **Cuando** ejecuto el lint, **Entonces** pasa.
4. **Dado** dos slices distintos de la misma capa, **Cuando** uno importa al otro, **Entonces** el lint falla.
5. **Dado** que un slice importa sus propios archivos internos, **Cuando** ejecuto el lint, **Entonces** pasa (solo se restringe el acceso desde fuera del slice).

---

### Historia de usuario 4 - Navegación, estado compartido y estilos de base (Prioridad: P2)

Quiero que el esqueleto ya traiga navegación entre al menos dos pantallas (inicio y «no encontrada»), un lugar para el estado compartido de la aplicación y estilos de base, para que las historias siguientes solo añadan contenido.

**Por qué esta prioridad**: da utilidad real al esqueleto, pero las historias 1–3 ya entregan valor sin ella.

**Prueba independiente**: abrir la dirección raíz y una dirección inexistente; la primera muestra el inicio y la segunda una pantalla «no encontrada» con enlace de regreso.

**Escenarios de aceptación**:

1. **Dado** la aplicación en marcha, **Cuando** visito la raíz, **Entonces** veo la página de inicio.
2. **Dado** una dirección que no existe, **Cuando** la visito, **Entonces** veo una pantalla «no encontrada» en español con un enlace al inicio, operable con teclado.
3. **Dado** el esqueleto, **Cuando** una historia futura necesita estado compartido, **Entonces** encuentra ya registrado el mecanismo de estado sin tocar la configuración de arranque.

---

### Casos límite

- Una importación con ruta relativa larga (`../../..`) que sale del slice hacia otra capa: debe evaluarse igual que una importación con alias.
- Una importación hecha con alias de ruta en lugar de ruta relativa: las reglas deben aplicar a ambas formas.
- Importaciones solo de tipos: cuentan como dependencia y siguen las mismas reglas.
- Las pruebas, que viven junto al código, importan internos del slice que prueban: permitido; importar internos de otro slice no.
- `aplicacion` y `compartido` no tienen slices: se importa su contenido por segmentos, nunca de una capa superior.
- Archivo nuevo fuera de las seis capas dentro de `src/`: el lint debe avisar en lugar de ignorarlo en silencio.
- El comando de lint se ejecuta desde una copia sin dependencias instaladas: falla con el mensaje habitual del gestor de paquetes, sin pasar por falso positivo.

## Requisitos *(obligatorio)*

### Requisitos funcionales

- **FR-001**: El proyecto MUST poder instalarse y arrancarse en desarrollo con comandos documentados, y mostrar una página de inicio con la marca **BlackHellHeim** escrita así.
- **FR-002**: El proyecto MUST ofrecer los comandos `npm run lint`, `npm run type-check`, `npm run test` y `npm run build`, y los cuatro MUST terminar con éxito sobre el esqueleto entregado.
- **FR-003**: El código MUST organizarse en seis capas con estos nombres exactos: `aplicacion`, `paginas`, `widgets`, `funcionalidades`, `entidades`, `compartido`.
- **FR-004**: Dentro de cada slice los segmentos MUST llamarse `ui`, `modelo`, `api` y `lib` (solo los que hagan falta).
- **FR-005**: Cada slice MUST exponer únicamente un `index.ts` como interfaz pública; el resto de sus archivos son internos.
- **FR-006**: El lint MUST fallar si una capa importa de otra superior en la jerarquía `aplicacion` > `paginas` > `widgets` > `funcionalidades` > `entidades` > `compartido`.
- **FR-007**: El lint MUST fallar si un archivo importa un archivo interno de un slice ajeno sin pasar por su `index.ts`.
- **FR-008**: El lint MUST fallar si un slice importa de otro slice de su misma capa.
- **FR-009**: El mensaje de error del lint MUST indicar qué regla se rompió (capa superior, salto del `index.ts` o mismo nivel) y entre qué elementos.
- **FR-010**: Las reglas de importación MUST estar cubiertas por pruebas automatizadas que demuestren el caso que falla y el caso que pasa (escenarios 1–5 de la historia 3).
- **FR-011**: El esqueleto MUST incluir navegación con al menos la pantalla de inicio y una pantalla «no encontrada» accesible por teclado.
- **FR-012**: El esqueleto MUST dejar registrado un mecanismo de estado compartido, sin guardar datos sensibles ni tokens en almacenamiento persistente del navegador (principio V).
- **FR-013**: El esqueleto MUST incluir estilos de base utilizables por todas las capas, con contraste de texto suficiente en la página de inicio (principio VII).
- **FR-014**: El repositorio MUST incluir una guía breve en español de qué va en cada capa y segmento.
- **FR-015**: El esqueleto MUST NOT contener secretos, tokens ni precios, y todo texto visible, comentario y mensaje de commit MUST estar en español.
- **FR-016**: Cada dependencia nueva MUST tener su licencia verificada y registrada antes de añadirse (principio VIII).

### Entidades clave

- **Capa**: nivel de la jerarquía con un nombre fijo en español; solo puede depender de capas inferiores.
- **Slice**: unidad de código dentro de una capa (excepto `aplicacion` y `compartido`), con una interfaz pública y archivos internos.
- **Segmento**: división técnica dentro de un slice (`ui`, `modelo`, `api`, `lib`).
- **Regla de importación**: restricción verificable automáticamente sobre qué elemento puede depender de cuál.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

- **SC-001**: Una persona con las herramientas instaladas pasa de clonar a ver la página de inicio en menos de 5 minutos siguiendo solo la guía del repositorio.
- **SC-002**: Los cuatro comandos de verificación terminan con éxito en una copia limpia el 100 % de las veces.
- **SC-003**: El 100 % de las violaciones de los tres tipos (capa superior, salto del `index.ts`, mismo nivel) del conjunto de pruebas hace fallar el lint, y el 0 % de las importaciones válidas lo hace.
- **SC-004**: El conjunto completo de verificaciones corre en menos de 3 minutos en el equipo de la desarrolladora, para que se ejecute antes de cada commit.
- **SC-005**: Una persona nueva identifica la capa correcta para 5 de 5 casos de ejemplo (un botón, una regla de negocio, una llamada a la API, una pantalla, un tipo del contrato) usando solo la guía.

## Supuestos

- La pila concreta (framework, empaquetador, estilos, herramienta de reglas de importación y de pruebas) la fija el plan, respetando la constitución; esta spec no la prescribe.
- Se aplica la jerarquía estricta de capas y se **prohíbe** que dos slices de la misma capa se importen entre sí (criterio habitual de esta arquitectura). Es más estricto que el texto literal de la constitución («solo de capas inferiores») y se considera consistente con él.
- `aplicacion` y `compartido` no se dividen en slices: `aplicacion` agrupa configuración de arranque y `compartido` se organiza solo por segmentos.
- No se crean slices de negocio (productos, carrito, etc.): pertenecen a historias posteriores. Solo se incluyen los mínimos para demostrar las reglas (inicio y «no encontrada»).
- Los colores y tipografías definitivos vienen del documento de diseño del proyecto y se aplican en una historia posterior; aquí solo hay estilos de base neutros.
- No incluye PWA, sesión, cliente de API ni ambientes: son las historias 8, 9, 14 y 39.
- Los nombres de archivo de pruebas y de herramientas pueden estar en inglés cuando lo exija la herramienta; todo lo que escribe el equipo va en español.
- Depende de que la constitución v1.1.0 siga vigente.
