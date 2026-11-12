# Guía de validación: HU-8 Ambientes

Requisito: HU-7 terminada (`npm ci` funciona).

## 1. Valores por ambiente (historia 1)

```bash
cat .env.development .env.test .env.production
npm run test -- tests/ambientes src/compartido/lib
```
Esperado: `http://localhost:4010`, `http://localhost:5068` y `/api`; pruebas en verde.

## 2. Construir por ambiente

```bash
npm run build          # producción
npm run build:test     # modo prueba
```
Ambos terminan con éxito.

## 3. Sin secretos ni variables sin prefijo (historia 2)

```bash
SECRETO_DE_PRUEBA=x npm run test -- tests/ambientes
```
Esperado: verde (la variable sin prefijo no llega a la aplicación). Prueba manual opcional: añadir `CLAVE_API=abc` a `.env.test` → la prueba falla nombrando archivo y variable; revertir.

## 4. Configuración rota (historia 3)

En `.env.local` (ignorado por git) escribir `VITE_API_URL=` y arrancar `npm run dev`: debe verse el mensaje en español con la variable y el archivo. Borrar `.env.local`.

## 5. Valor personal local

`echo 'VITE_API_URL=http://localhost:9999' > .env.development.local` → `npm run dev` usa ese valor; `git status` no muestra el archivo.
