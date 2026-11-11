# Especificación de la funcionalidad: Specs diferidos de aviso de privacidad y CFDI (HU-44)

**Rama de trabajo**: `sprint/11` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-44 · **Sprint**: 11 · **Repos**: web · **Componente**: DOC · **Depende de**: HU-1
**Bloqueado por**: nada técnico
**Entrada**: «Quiero specs diferidos de aviso de privacidad y CFDI con plantillas. Criterio: existen las carpetas y plantillas marcadas como fuera de alcance.» (parte web de una historia api + web, componente DOC)

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Carpetas diferidas con plantilla (Prioridad: P1)

1. **Dado** el repositorio, **Cuando** se listan `specs/`, **Entonces** existen `900-aviso-privacidad-diferido` y `901-cfdi-diferido`, cada una con una spec marcada «DIFERIDA».
2. **Dado** cada spec diferida, **Cuando** se lee, **Entonces** contiene motivo, qué haría la web cuando se retome y un recuadro de «fuera de alcance» sin tareas ejecutables.
3. **Dado** `docs/legal/`, **Cuando** se revisa, **Entonces** cada plantilla dice que es un documento de ejemplo, no vigente.

### Casos límite

- El aviso de privacidad (LFPDPPP) y el CFDI requieren asesoría: no se redactan textos legales reales.
- Las carpetas diferidas no tienen `plan.md` ni `tasks.md` ejecutables, para que nadie las implemente por error.
- La numeración 9xx no choca con el backlog.
- El backlog las lista como fuera de alcance, no como pendientes.

## Requisitos *(obligatorio)*

- **FR-001**: `specs/900-aviso-privacidad-diferido` MUST completarse con la plantilla de campos que tendrá (enlace en pie de página y registro, casilla de aceptación, solicitudes ARCO).
- **FR-002**: `specs/901-cfdi-diferido` MUST crearse con la misma estructura (solicitud de factura por pedido, datos fiscales, estado de la factura).
- **FR-003**: Cada una MUST llevar la marca «DIFERIDA / FUERA DE ALCANCE» arriba y no tener tareas ejecutables.
- **FR-004**: `docs/legal/` MUST tener plantillas marcadas como ejemplo no vigente.
- **FR-005**: Una prueba MUST verificar que existen las carpetas y las marcas.

## Criterios de éxito

- **SC-001**: Las dos carpetas y sus marcas existen y una prueba lo comprueba.
- **SC-002**: Ningún archivo diferido contiene tareas `- [ ]`.

## Supuestos

- La parte api crea sus propias carpetas en su repositorio.
- Los textos legales finales los redactan profesionales; fuera del alcance académico.
