import path from 'path';
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

function bundleUmd() {
  return {
    input: path.resolve('./components/index.ts'),
    output: {
      file: 'dist/pizza-ui.js',
      format: 'umd',
      name: 'pizza-ui',
      globals: {
        vue: 'Vue',
      },
      sourcemap: true,
    },
    plugins: commonPlugins({
      minify: false,
    }),
    external: ['vue'],
  };
}

function bundleUmdMin() {
  return {
    input: path.resolve('./components/index.ts'),
    output: {
      file: 'dist/pizza-ui.min.js',
      format: 'umd',
      name: 'pizza-ui',
      globals: {
        vue: 'Vue',
      },
      sourcemap: true,
    },
    plugins: commonPlugins({
      minify: false,
    }),
    external: ['vue'],
  };
}

function bundleOrigin() {
  return {
    input: path.relative(process.cwd(), './components/index.ts'),
    output: [
      {
        format: 'es',
        dir: 'es',
        entryFileNames: '[name].js',
        preserveModules: true,
        preserveModulesRoot: 'pizza-ui',
      },
      {
        format: 'commonjs',
        dir: 'lib',
        entryFileNames: '[name].js',
        preserveModules: true,
      },
    ],
    plugins: [
      resolve({ extensions }),
      alias({
        entries: [{ find: '@pizza-ui', replacement: path.resolve(__dirname, './') }],
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
  };
}

export default [bundleUmd(), bundleUmdMin(), bundleOrigin()];
