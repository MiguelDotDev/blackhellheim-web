# Tareas: Marca (HU-11)

**Pruebas**: primero. **Bloqueado por**: documento de diseño. Esta HU tiene tareas `[MANUAL]`.

## Fase 1: Preparación

- [X] T001 [MANUAL] Entregar el documento de diseño: paleta (hex y roles), tipografías (nombre, pesos), logo y monograma en SVG (originales, sin elementos de terceros) — entregado en `docs/diseno/marca.md`; SVG provisionales en `docs/diseno/`
- [X] T002 [FE] Verificar la licencia de la(s) fuente(s) y de `@fontsource/<fuente>` y su árbol (`npm ls --all --parseable`), instalarlas y registrar en `plan.md`; si no es libre, detener

## Fase 2: Tokens y fuentes (US1, US2)

- [X] T003 [FE] Escribir primero `src/compartido/lib/contraste.test.ts` y `tests/marca/contraste.test.ts` (pares declarados ≥ 4.5 o 3 para texto grande; falla con el valor real mientras no existan)
- [X] T004 [FE] Implementar `contraste.ts`, `marca.css` (`@theme` con colores, fuentes, radios; `@font-face`/importes con `font-display: swap`, importado desde `src/aplicacion/estilos/principal.css`; definir también los tokens de tema oscuro si el documento de diseño los trae) y la tabla de pares
- [X] T005 [FE] Escribir primero `tests/marca/sin-literales.test.ts` (sin `#hex`/`rgb(` fuera de `marca.css`; sin dominios de fuentes externos en código ni en `index.html`; cada `@font-face` declara `font-display: swap` y formato `woff2`); sustituir literales del esqueleto por tokens y dejarla en verde

## Fase 3: Logo y monograma (US3)

- [X] T006 [FE] Escribir primero pruebas de `LogoMarca` y `Monograma` (nombre accesible «BlackHellHeim», variantes claro/oscuro, `currentColor`)
- [X] T007 [FE] Implementar los componentes, exportarlos por `compartido/ui/index.ts`, usarlos en el encabezado/inicio y en `index.html` (favicon desde el monograma); retirar o adaptar `TituloMarca`

## Fase 4: Cierre

- [X] T008 [FE] `npm run lint`, `type-check`, `test`, `build` en verde; comprobar en el `dist` que no hay peticiones externas de fuentes (`grep -r "fonts.g" dist`)
- [ ] T009 [FE] Fila de HU-11 en `backlog.md`: Spec y Estado = Hecha (solo si T001 está hecho); commit `HU-11: marca`; avisar «HU-11 terminada. Haz push a sprint/04»
- [ ] T010 [MANUAL] Revisar a ojo el esqueleto con la marca y aprobar

## Dependencias

T001 → T002 → T003–T005 → T006–T007 → T008–T010.
