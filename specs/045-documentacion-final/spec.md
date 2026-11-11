# Especificación de la funcionalidad: Documentación final y evidencia de cada sprint (HU-45)

**Rama de trabajo**: `sprint/11` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-45 · **Sprint**: 11 · **Repos**: web · **Componente**: DOC · **Depende de**: HU-1 y todas las HU del proyecto
**Bloqueado por**: todas las HU que se documenten; contenido de revisión y retrospectiva de la desarrolladora
**Entrada**: «Quiero la documentación final y la evidencia de cada sprint. Criterio: README, evidencias SDD, revisiones y retrospectivas en ambos repos.» (parte web de una historia api + web, componente DOC)

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - README completo (Prioridad: P1)

1. **Dado** un colaborador nuevo, **Cuando** lee el README, **Entonces** encuentra requisitos, comandos, ambientes, mock y cliente, CI, despliegue, PWA y estructura FSD.
2. **Dado** cada sección, **Cuando** se sigue, **Entonces** los comandos funcionan tal como están escritos.

### Historia de usuario 2 - Evidencia SDD y del sprint (Prioridad: P1)

1. **Dado** cada HU hecha, **Cuando** se revisa, **Entonces** tiene su carpeta de spec con spec, plan y tareas y su fila en el backlog.
2. **Dado** cada sprint, **Cuando** termina, **Entonces** existe un documento con meta, historias, revisión (qué se demostró) y retrospectiva (qué funcionó, qué mejorar, acuerdos), según `plantilla-sprint.md`.
3. **Dado** el repositorio, **Cuando** se audita, **Entonces** el informe resume los hallazgos de análisis y las decisiones por HU.

### Casos límite

- Los contenidos de revisiones y retrospectivas los escribe la desarrolladora: no se inventan.
- Documentos que referencian HU no hechas: se marcan como pendientes, no como logradas.
- Comandos del README desactualizados: una prueba ejecuta los de verificación.
- Ambos repositorios deben tener la misma estructura de evidencias.

## Requisitos *(obligatorio)*

- **FR-001**: README MUST cubrir los temas de la historia 1 y se verifica con una revisión de comandos contra `package.json`.
- **FR-002**: MUST existir `docs/scrum/sprint-NN.md` por sprint, creado desde `plantilla-sprint.md` (con las secciones de revisión y retrospectiva).
- **FR-003**: El contenido de revisión y retrospectiva MUST quedar como `[MANUAL]` hasta que la desarrolladora lo escriba.
- **FR-004**: MUST existir un índice de evidencias SDD (`docs/scrum/evidencias-sdd.md`) con enlaces a cada spec, plan, tareas e informes.
- **FR-005**: Una prueba MUST validar que los scripts del README existen en `package.json` y que cada spec hecha tiene sus tres archivos.

## Criterios de éxito

- **SC-001**: El 100 % de los comandos del README existen.
- **SC-002**: Cada HU con Estado = Hecha enlaza spec, plan y tareas.
- **SC-003**: Todos los sprints tienen su documento.

## Supuestos

- La documentación del backend vive en su repo; aquí solo la parte web.
- Las horas reales y notas de Jira las aporta la desarrolladora.
