# Inicialización SDD (blackhellheim-web)

Mismo procedimiento en `blackhellheim-web`. Este zip es una **semilla**: se descomprime DESPUÉS de `specify init`, porque `specify init` crea su propia `constitution.md` plantilla y podría sobrescribir la nuestra.

## Requisitos
Python 3.11+, git, uv, y el agente (Claude Code y/o OpenCode).

## Pasos
```bash
# 1. Instalar la CLI (una vez)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify check

# 2. Crear el repositorio vacío en GitHub (público) y clonarlo
git clone https://github.com/<usuario>/blackhellheim-web.git
cd blackhellheim-web

# 3. Inicializar Spec Kit en la carpeta actual
specify init . --integration claude --force   # versiones nuevas; si tu versión es antigua usa --ai claude
#    Windows: agrega --script ps

# 4. (opcional) soporte para OpenCode
specify integration list                       # confirma los nombres disponibles
specify init . --integration opencode --force

# 5. Descomprimir esta semilla encima (acepta sobrescribir constitution.md)
unzip -o ../blackhellheim-web-sdd-semilla.zip -d .

# 6. Revisar que init no pisó nada tuyo (si pasó, restaura con git checkout -- <archivo>)
git status
head -3 .specify/memory/constitution.md   # debe decir "Constitución de blackhellheim-web" v1.1.0

# 7. Verificar en el agente y confirmar la constitución
/speckit.constitution   # revisa que respete .specify/memory/constitution.md
git add . && git commit -m "Inicializa SDD con Spec Kit y semilla del proyecto"

# 8. Ramas del flujo (antes de proteger ramas en GitHub)
git branch release && git branch developer
git push origin main release developer
git checkout -b sprint/01 && git push -u origin sprint/01
```

`docs/scrum/backlog.md` ya viene en la semilla (con el estado de partida de este repositorio). Si el del backend avanzó, no lo copies encima: el Estado de cada repo es independiente.

## Qué crea `specify init` y qué aporta la semilla
- `specify init`: `.specify/` (plantillas y scripts), carpeta de comandos del agente (`.claude/commands/`) y, al usar `/speckit.specify`, la carpeta `specs/NNN-.../`.
- Semilla: constitución en español (v1.1.0, con el flujo de ramas), `AGENTS.md` (con el flujo por HU y ramas), `CLAUDE.md`, specs 000 y 900, y `docs/` (`scrum/backlog.md`, `scrum/plantilla-sprint.md`, `legal/README.md`).
- Recomendado: agrega `.claude/settings.json` y `.claude/settings.local.json` a `.gitignore` (reglas personales de permisos).

## Notas
- Los nombres de plantillas y scripts de Spec Kit quedan en inglés; no se renombran para no romper la herramienta. Lo que escribe tu equipo va en español.
- `specify init <nombre>` falla si la carpeta ya existe; por eso se usa `.`.
- Numeración: Spec Kit numera las specs por su cuenta. Para usar el número de historia, indícalo al crear la spec; si tu versión no lo permite, renombra la carpeta y la rama después de crearla (a confirmar con tu versión instalada).
- Con OpenCode y Claude Code a la vez, `AGENTS.md` es la fuente común y `CLAUDE.md` solo la importa.
