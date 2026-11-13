# Especificación de la funcionalidad: Marca reconocible (HU-11)

**Rama de trabajo**: `sprint/04` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-11 · **Sprint**: 4 · **Repos**: web · **Componente**: FE · **Depende de**: HU-7
**Bloqueado por**: el documento de diseño del proyecto (paleta, tipografías, logo y monograma). No existe en este repo ni se inventa; la desarrolladora lo entrega (`[MANUAL]`).
**Entrada**: «Como cliente, quiero una marca reconocible: tokens, fuentes locales, logo y monograma. Criterio: tokens de Tailwind, logo SVG y monograma entregados y usados en el esqueleto.»

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Tokens de diseño en Tailwind (Prioridad: P1)

Quiero colores, tipografías, espaciados y radios definidos una sola vez como tokens de Tailwind (`@theme`) y usados por las pantallas del esqueleto.

**Prueba independiente**: cambiar un token y ver el cambio en el esqueleto; prueba automática de contraste.

1. **Dado** los tokens, **Cuando** compilo, **Entonces** existen las utilidades de color, fuente y espaciado de la marca.
2. **Dado** los pares texto/fondo de uso real, **Cuando** se calcula el contraste, **Entonces** cumplen WCAG AA (4.5:1 texto normal, 3:1 grande).
3. **Dado** el esqueleto (inicio, no encontrada, encabezado), **Cuando** lo reviso, **Entonces** no hay colores ni fuentes literales fuera de los tokens.

### Historia de usuario 2 - Fuentes locales (Prioridad: P1)

Quiero tipografías alojadas en el propio sitio, sin pedirlas a terceros.

1. **Dado** la app, **Cuando** carga, **Entonces** ninguna petición va a dominios de fuentes externos (Google Fonts u otros).
2. **Dado** una fuente que tarda, **Cuando** el navegador la espera, **Entonces** se muestra texto con una fuente de respaldo (`font-display: swap`) sin saltos graves.
3. **Dado** las fuentes, **Cuando** reviso su licencia, **Entonces** es libre (OFL u otra) y está registrada.

### Historia de usuario 3 - Logo y monograma (Prioridad: P1)

Quiero el logo en SVG y el monograma usables como componentes y como iconos de la PWA.

1. **Dado** el encabezado, **Cuando** se muestra, **Entonces** usa el logo SVG con texto alternativo «BlackHellHeim» (o `aria-label`).
2. **Dado** espacios pequeños (pestaña, icono de aplicación), **Cuando** se muestra, **Entonces** se usa el monograma.
3. **Dado** fondos claros y oscuros, **Cuando** se muestra el logo, **Entonces** hay variante legible en ambos.

### Casos límite

- Fuente que no carga: el respaldo del sistema mantiene la lectura.
- SVG con colores incrustados: deben usar `currentColor` o tokens para respetar el tema.
- La marca siempre se escribe **BlackHellHeim** (sin variantes de mayúsculas).
- Solo diseños y nombres propios, sin logotipos de terceros (principio X).

## Requisitos *(obligatorio)*

- **FR-001**: Tokens en un único archivo CSS con `@theme` (colores, tipografías, tamaños, radios) a partir del documento de diseño.
- **FR-002**: Fuentes en formato `woff2` servidas desde el propio origen (paquete `@fontsource/*` o archivos en `src/`), con `font-display: swap` y solo los pesos y subconjuntos usados.
- **FR-003**: Componentes `LogoMarca` y `Monograma` en `compartido/ui` exportados por `index.ts`, en SVG, con variantes claro/oscuro; `TituloMarca` se sustituye o los usa.
- **FR-004**: Icono y favicon derivados del monograma (los iconos de instalación PWA se generan cuando se haga la PWA, HU-39).
- **FR-005**: Prueba de contraste automática sobre los pares declarados.
- **FR-006**: Prueba que falla si el código fuente referencia dominios de fuentes externos o literales de color fuera de los tokens (excepto el archivo de tokens).
- **FR-007**: Licencia de cada fuente/paquete nuevo verificada y registrada (principio VIII).

## Criterios de éxito

- **SC-001**: 0 peticiones a dominios externos para fuentes al cargar la página.
- **SC-002**: 100 % de los pares de color declarados cumplen AA.
- **SC-003**: Logo y monograma se muestran en el esqueleto y no hay colores literales fuera de los tokens.

## Supuestos

- El documento de diseño define la paleta, las fuentes y los archivos de logo/monograma; hasta tenerlos, las tareas de código dependientes quedan bloqueadas.
- La optimización de rendimiento fina y la revisión de accesibilidad global son HU-41.
