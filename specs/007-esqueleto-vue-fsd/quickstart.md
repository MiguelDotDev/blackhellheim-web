# Guía de validación: HU-7 Esqueleto con capas

Requisitos: Node 24 (`nvm use`), npm.

## 1. Instalar y arrancar (historia 1)

```bash
npm ci
npm run dev        # abre http://localhost:5173 → página de inicio «BlackHellHeim»
```

## 2. Las cuatro verificaciones (historia 1)

```bash
npm run lint && npm run type-check && npm run test && npm run build
```
Resultado esperado: salida 0 en las cuatro.

## 3. Capas (historia 2)

`ls src` muestra exactamente: `aplicacion  compartido  entidades  funcionalidades  paginas  widgets`. La guía está en `src/LEEME.md`.

## 4. Las reglas rechazan violaciones (historia 3)

```bash
npm run test -- tests/arquitectura     # pruebas de las reglas: deben pasar
```
Prueba manual opcional: en `src/entidades/` crear `prueba.ts` con `import '../widgets'` y ejecutar `npm run lint` → error de `boundaries/dependencies` (capa superior). Borrar el archivo.

## 5. Navegación (historia 4)

Visitar `/` (inicio) y `/no-existe` («Página no encontrada» con enlace «Volver al inicio»; recorrible con Tab).
