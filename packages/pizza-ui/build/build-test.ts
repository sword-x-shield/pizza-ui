import path from 'path';
import { OutputOptions, RollupBuild, rollup } from 'rollup';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import vuePlugin from '@vitejs/plugin-vue';
import _esbuild from 'rollup-plugin-esbuild';
import defineOptions from 'unplugin-vue-define-options/rollup';
import fs from 'fs-extra';
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

const outputOptionsList: Array<OutputOptions> = [
  {
    format: 'es',
    dir: 'output/es',
    entryFileNames: '[name].js',
    preserveModules: true,
    // preserveModulesRoot: 'components',
  },
  {
    format: 'commonjs',
    dir: 'output/lib',
    entryFileNames: '[name].js',
    preserveModules: true,
    // preserveModulesRoot: 'components',
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
];

async function build() {
  try {
    const bundle = await rollup({
      input: path.relative(process.cwd(), './components/index.ts'),
      external: ['vue'],
      plugins: [
        resolve({ extensions }),
        alias({
          entries: [{ find: '@pizza-ui', replacement: path.resolve(process.cwd(), './') }],
        }),
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

    await fs.move('output/lib/packages/pizza-ui', 'lib', { overwrite: true });
    await fs.move('output/es/packages/pizza-ui', 'es', { overwrite: true });
    await fs.remove('output');
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
