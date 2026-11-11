# Guía de validación: HU-10 CI del frontend

## 1. Configuración (local)

```bash
npm run test -- tests/ci        # valida ramas, matriz, permisos, tiempo, secretos y SHAs
```

## 2. Reproducir cada verificación en local (FR-003, historia 4)

```bash
npm ci
npm run lint && npm run type-check && npm run test && npm run build
```

## 3. Ejecución real (manual, requiere GitHub)

1. `git push origin sprint/02` → en la pestaña Actions aparece «CI frontend» con 4 controles `verificar (…)` en verde; cada uno < 10 min.
2. Abrir un pull request `sprint/02` → `developer`: aparecen los mismos 4 controles.
3. Prueba negativa (rama temporal `sprint/99-prueba-ci`, luego borrarla): romper a propósito, en commits separados, un import entre capas (lint), un tipo (type-check), una aserción (test) y un import inexistente (build); cada commit pone en rojo solo el control correspondiente.
4. Ajustes → Ramas: exigir los 4 controles y pull request en `main`, `release` y `developer`; comprobar que un PR en rojo no se puede unir.

## 4. Leer un fallo

En el pull request, pulsar «Details» del control en rojo; la salida es la del comando `npm run <verificación>`.
