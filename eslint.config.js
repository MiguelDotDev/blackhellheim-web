import js from '@eslint/js'
import boundaries from 'eslint-plugin-boundaries'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Capas FSD de arriba abajo. Una capa solo puede importar de las inferiores.
const capas = ['aplicacion', 'paginas', 'widgets', 'funcionalidades', 'entidades', 'compartido']
const conSlice = ['paginas', 'widgets', 'funcionalidades', 'entidades']

const politicas = [
  // 1) Mensajes de rechazo (el último que coincide decide; las excepciones van después).
  ...capas.flatMap((capa, i) =>
    capas.slice(0, i).map((superior) => ({
      from: { element: { type: capa } },
      disallow: { to: { element: { type: superior } } },
      message: `La capa «${capa}» no puede importar de la capa superior «${superior}»: una capa solo importa de capas inferiores.`,
    })),
  ),
  ...conSlice.map((capa) => ({
    from: { element: { type: capa } },
    disallow: { to: { element: { type: capa } } },
    message: `Un slice de «${capa}» no puede importar de otro slice de la misma capa: comparte por una capa inferior.`,
  })),
  ...conSlice.flatMap((capa, i) =>
    conSlice.slice(i + 1).map((inferior) => ({
      from: { element: { type: capa } },
      disallow: { to: { element: { type: inferior }, file: { categories: 'interno' } } },
      message: `Importa «${inferior}» por su index.ts, no por archivos internos (origen: «${capa}»).`,
    })),
  ),
  // 2) Excepciones permitidas.
  ...capas.slice(0, -1).map((capa, i) => ({
    from: { element: { type: capa } },
    allow: {
      to: {
        element: { types: conSlice.filter((c) => capas.indexOf(c) > i) },
        file: { categories: 'interfaz-publica' },
      },
    },
  })),
  { from: { element: { types: capas.slice(0, -1) } }, allow: { to: { element: { type: 'compartido' } } } },
  { from: { element: { type: 'aplicacion' } }, allow: { to: { element: { type: 'aplicacion' } } } },
  { from: { element: { type: 'compartido' } }, allow: { to: { element: { type: 'compartido' } } } },
  ...conSlice.map((capa) => ({
    from: { element: { type: capa } },
    allow: { to: { element: { type: capa, captured: { slice: '{{ from.element.captured.slice }}' } } } },
  })),
]

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', 'coverage/', 'src/compartido/api/generado/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['src/**/*.{ts,vue}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': { typescript: { alwaysTryTypes: true } },
      'boundaries/ignore': ['src/main.ts', 'src/vite-env.d.ts'],
      'boundaries/elements': [
        { type: 'aplicacion', pattern: 'src/aplicacion' },
        ...conSlice.map((capa) => ({ type: capa, pattern: `src/${capa}/*`, capture: ['slice'] })),
        { type: 'compartido', pattern: 'src/compartido' },
      ],
      'boundaries/files': [
        { pattern: '**/src/*/*/**', category: 'interno' },
        { pattern: '**/src/*/*/index.ts', category: 'interfaz-publica' },
      ],
    },
    rules: {
      'boundaries/dependencies': [2, { default: 'disallow', policies: politicas }],
      'boundaries/no-unknown-files': 1,
    },
  },
)
