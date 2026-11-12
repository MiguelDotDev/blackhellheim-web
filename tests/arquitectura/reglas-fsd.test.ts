import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { ESLint } from 'eslint'
import { afterAll, describe, expect, it } from 'vitest'

const raiz = join(import.meta.dirname, '..', '..')
// Una sola raíz temporal: el resolutor de alias cachea el tsconfig del primer directorio que ve.
const cwd = mkdtempSync(join(tmpdir(), 'fsd-'))

afterAll(() => {
  rmSync(cwd, { recursive: true, force: true })
})

type Archivos = Record<string, string>

/** Crea un árbol temporal con las seis capas, lo lintea con el eslint.config.js real y devuelve los mensajes. */
async function lintear(archivos: Archivos, objetivo: string) {
  rmSync(join(cwd, 'src'), { recursive: true, force: true })
  const base: Archivos = {
    'tsconfig.json': JSON.stringify({
      compilerOptions: { baseUrl: '.', paths: { '@/*': ['src/*'] }, module: 'esnext', moduleResolution: 'bundler' },
      include: ['src'],
    }),
    'package.json': '{"type":"module"}',
    ...Object.fromEntries(
      ['aplicacion', 'paginas', 'widgets', 'funcionalidades', 'entidades', 'compartido'].map((c) => [
        `src/${c}/.gitkeep`,
        '',
      ]),
    ),
  }
  for (const [ruta, contenido] of Object.entries({ ...base, ...archivos })) {
    const destino = join(cwd, ruta)
    mkdirSync(dirname(destino), { recursive: true })
    writeFileSync(destino, contenido)
  }
  const eslint = new ESLint({ cwd, overrideConfigFile: join(raiz, 'eslint.config.js') })
  // El resolutor de alias busca el tsconfig desde process.cwd().
  const previo = process.cwd()
  process.chdir(cwd)
  try {
    const [resultado] = await eslint.lintFiles([objetivo])
    return resultado!.messages
  } finally {
    process.chdir(previo)
  }
}

const errores = (m: Awaited<ReturnType<typeof lintear>>) => m.filter((x) => x.severity === 2)

const slice = (ruta: string, extra: Archivos = {}): Archivos => ({
  [`${ruta}/index.ts`]: `export const x = 1\n`,
  [`${ruta}/ui/interno.ts`]: `export const i = 1\n`,
  ...extra,
})

describe('reglas FSD', () => {
  it('escenario 1: capa inferior importa de una superior', async () => {
    const m = errores(
      await lintear(
        { ...slice('src/widgets/barra'), 'src/entidades/producto/index.ts': `import '../../widgets/barra'\n` },
        'src/entidades/producto/index.ts',
      ),
    )
    expect(m.map((x) => x.ruleId)).toEqual(['boundaries/dependencies'])
    expect(m[0]!.message).toMatch(/entidades/)
    expect(m[0]!.message).toMatch(/widgets/)
    expect(m[0]!.message).toMatch(/superior/i)
  })

  it('escenario 2: importa un interno de otro slice sin pasar por index.ts', async () => {
    const m = errores(
      await lintear(
        { ...slice('src/entidades/producto'), 'src/paginas/inicio/index.ts': `import '../../entidades/producto/ui/interno'\n` },
        'src/paginas/inicio/index.ts',
      ),
    )
    expect(m.map((x) => x.ruleId)).toEqual(['boundaries/dependencies'])
    expect(m[0]!.message).toMatch(/index\.ts/)
  })

  it('escenario 3: importa por index.ts de una capa inferior (alias y ruta relativa larga)', async () => {
    const entidad = slice('src/entidades/producto')
    expect(
      errores(await lintear({ ...entidad, 'src/paginas/inicio/index.ts': `import '@/entidades/producto'\n` }, 'src/paginas/inicio/index.ts')),
    ).toEqual([])
    expect(
      errores(await lintear({ ...entidad, 'src/paginas/inicio/ui/a.ts': `import '../../../entidades/producto'\n` }, 'src/paginas/inicio/ui/a.ts')),
    ).toEqual([])
  })

  it('alias @/ también detecta el salto del index.ts y la capa superior', async () => {
    const a = errores(
      await lintear({ ...slice('src/entidades/producto'), 'src/paginas/inicio/index.ts': `import '@/entidades/producto/ui/interno'\n` }, 'src/paginas/inicio/index.ts'),
    )
    expect(a.map((x) => x.ruleId)).toEqual(['boundaries/dependencies'])
    const b = errores(
      await lintear({ ...slice('src/paginas/inicio'), 'src/compartido/ui/index.ts': `import '@/paginas/inicio'\n` }, 'src/compartido/ui/index.ts'),
    )
    expect(b.map((x) => x.ruleId)).toEqual(['boundaries/dependencies'])
  })

  it('escenario 4: un slice importa de otro slice de su misma capa', async () => {
    const m = errores(
      await lintear(
        { ...slice('src/entidades/pedido'), 'src/entidades/producto/index.ts': `import '../pedido'\n` },
        'src/entidades/producto/index.ts',
      ),
    )
    expect(m.map((x) => x.ruleId)).toEqual(['boundaries/dependencies'])
    expect(m[0]!.message).toMatch(/misma capa|mismo nivel/i)
  })

  it('escenario 5: un slice importa sus propios internos', async () => {
    const m = errores(
      await lintear(
        { ...slice('src/entidades/producto'), 'src/entidades/producto/modelo/m.ts': `import '../ui/interno'\n` },
        'src/entidades/producto/modelo/m.ts',
      ),
    )
    expect(m).toEqual([])
  })

  it('importación solo de tipos sigue las mismas reglas', async () => {
    const m = errores(
      await lintear(
        { ...slice('src/widgets/barra'), 'src/entidades/producto/index.ts': `import type { x } from '../../widgets/barra'\nexport type T = typeof x\n` },
        'src/entidades/producto/index.ts',
      ),
    )
    expect(m.map((x) => x.ruleId)).toEqual(['boundaries/dependencies'])
  })

  it('archivo nuevo fuera de las seis capas: avisa', async () => {
    const m = await lintear({ 'src/suelto/a.ts': `export const a = 1\n` }, 'src/suelto/a.ts')
    expect(m.some((x) => x.ruleId === 'boundaries/no-unknown-files' && x.severity >= 1)).toBe(true)
  })
})
