# Constitución de blackhellheim-web

Versión 1.1.0 · Ratificada 2026-11-05 · Última modificación: 2026-11-11

PWA de la tienda BlackHellHeim (playeras Print-On-Demand, México, MXN, español). Vue 3 + TypeScript + Vite + Pinia + Vue Router + Tailwind. La API vive en `blackhellheim-api`.

## Principios

### I. Feature-Sliced Design (NO NEGOCIABLE)
Capas en español: `aplicacion`, `paginas`, `widgets`, `funcionalidades`, `entidades`, `compartido`. Una capa solo importa de capas inferiores. Cada slice expone únicamente `index.ts`; se importa solo por ahí. Segmentos: `ui`, `modelo`, `api`, `lib`. ESLint hace cumplir estas reglas y la CI falla si se rompen.

### II. Contrato primero
El cliente de la API se genera desde el OpenAPI del backend (copia en `specs/NNN-*/contratos/`). Mientras el backend no esté listo se usa un servidor mock. Nunca se escriben a mano tipos que existan en el contrato.

### III. El precio viene siempre del backend
El frontend muestra precios, nunca los calcula ni los envía.

### IV. PWA y modo sin conexión
Pedidos, notificaciones y compras se pueden consultar sin conexión (IndexedDB). Service worker con vite-plugin-pwa/Workbox. Notificaciones con Web Push (VAPID). El carrito puede llenarse sin cuenta y se fusiona al iniciar sesión; para pagar se exige sesión.

### V. Sesión segura
Token de acceso solo en memoria; el refresh vive en cookie HttpOnly gestionada por el backend. Nada de tokens en localStorage.

### VI. Pruebas
Componentes y lógica de negocio con pruebas unitarias. Lint, verificación de tipos, pruebas y build deben pasar en CI.

### VII. Accesibilidad y diseño
Navegación por teclado, contraste suficiente y etiquetas en formularios. La identidad visual sigue el documento de diseño del proyecto.

### VIII. Solo software libre o gratuito
Toda dependencia nueva verifica su licencia antes de añadirse.

### IX. Secretos y entornos
Sin secretos en el repositorio (público). Variables en `.env.development`, `.env.test`, `.env.production`; solo se exponen las prefijadas `VITE_` y nunca contienen secretos.

### X. Diseños originales e idioma
Solo diseños propios, sin logotipos ni nombres de terceros. Especificaciones, código y commits en español. Marca: **BlackHellHeim**.

### XI. Flujo de ramas y pull requests
Se trabaja por pull request. `main`, `release` y `developer` no reciben commits directos. Solo `main` despliega. El trabajo de cada sprint vive en `sprint/NN`, con un commit y un push por historia de usuario. Los pull requests siguen la cadena `sprint/NN` → `developer` → `release` → `main`, y los controles de CI son obligatorios en cuanto existan. El detalle operativo vive en `AGENTS.md`.

## Flujo de trabajo
- Una especificación por historia (`specs/NNN-slug`, mismo número que en el backend). El contrato se copia desde el backend; no se modifica aquí.
- Flujo: `/speckit.specify` → `/speckit.clarify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.analyze` → `/speckit.implement`.
- Sprints de 1 semana; WIP máximo 2; Jira proyecto `BHH`.
- Definición de Hecho: pruebas, CI en verde, análisis estático limpio, especificación actualizada.

## Gobernanza
Esta constitución prevalece sobre otras prácticas. Cambiarla exige subir la versión y justificarlo en el commit.
