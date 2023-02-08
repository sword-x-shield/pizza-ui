import path from 'path';
import { OutputOptions, Plugin, RollupBuild, rollup } from 'rollup';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import vuePlugin from '@vitejs/plugin-vue';
import _esbuild from 'rollup-plugin-esbuild';
import defineOptions from 'unplugin-vue-define-options/rollup';
const esbuild = _esbuild.default || _esbuild;

const extensions = ['.mjs', '.js', '.json', '.ts', '.vue'];
const commonPlugins = ({
  minify,
} = {
  minify: true,
}) => ([
  resolve({ extensions }),
  alias({
    entries: [{ find: '@pizza-ui', replacement: path.resolve(__dirname, '.') }],
  }),
  defineOptions(),
  vuePlugin(),
  esbuild({
    tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
    target: 'esnext',
    sourceMap: true,
  }),
  babel({
    extensions,
    babelHelpers: 'bundled',
  }),
  commonjs(),
  replace({
    values: {
      // eslint-disable-next-line quotes
      'process.env.NODE_ENV': `'development'`,
    },
    preventAssignment: true,
  }),
  minify && terser(),
]);

function externalPlugin(): Plugin {
  return {
    name: 'vite:external-node_modules',
    async resolveId(source: string, importer) {
      const result = await this.resolve(source, importer, {
        skipSelf: true,
        custom: { 'node-resolve': {} },
      });

      if (result && /node_modules/.test(result.id))
        return false;

      return null;
    },
  };
}

const outputOptionsList: Array<OutputOptions> = [
  {
    format: 'es',
    dir: 'es',
    entryFileNames: '[name].js',
    preserveModules: true,
    preserveModulesRoot: 'components',
  },
  {
    format: 'commonjs',
    dir: 'lib',
    entryFileNames: '[name].js',
    preserveModules: true,
    preserveModulesRoot: 'components',
  },
  {
    file: 'dist/pizza-ui.js',
    format: 'umd',
    name: 'pizza-ui',
    globals: {
      vue: 'Vue',
    },
    sourcemap: true,
  },
  {
    file: 'dist/pizza-ui.min.js',
    format: 'umd',
    name: 'pizza-ui',
    plugins: [terser()],
    globals: {
      vue: 'Vue',
    },
    sourcemap: true,
  },
];

async function build() {
  try {
    const bundle = await rollup({
      input: path.relative(process.cwd(), './components/index.ts'),
      plugins: [
        resolve({ extensions }),
        alias({
          entries: [{ find: '@pizza-ui', replacement: path.resolve(process.cwd(), './') }],
        }),
        externalPlugin(),
        vuePlugin(),
        esbuild({
          tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
          target: 'esnext',
          sourceMap: true,
        }),
        babel({
          extensions,
          babelHelpers: 'bundled',
        }),
        commonjs(),
      ],
    });
    await generateOutputs(bundle);
  } catch (error) {
    console.error('build error:', error);
  }
}

async function generateOutputs(bundle: RollupBuild) {
  for (const outputOptions of outputOptionsList) {
    try {
      await bundle.write(outputOptions);
    } catch (error) {
      console.error('bundle.writ error:', error);
    }
  }
}

build();
