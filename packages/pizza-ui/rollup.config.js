import path from 'path';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import vuePlugin from 'rollup-plugin-vue';
import _esbuild from 'rollup-plugin-esbuild';
const esbuild = _esbuild.default || _esbuild;

const extensions = ['.mjs', '.js', '.json', '.ts'];
const commonPlugins = [
  resolve({ extensions }),
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
  terser(),
];

function bundleUmd() {
  return {
    input: path.resolve('./src/index.ts'),
    output: {
      file: 'dist/pizza-ui.js',
      format: 'umd',
      name: 'pizza-ui',
      globals: {
        vue: 'Vue',
      },
      sourcemap: false,
    },
    plugins: commonPlugins,
    external: ['vue'],
  };
}

function bundleEsm() {
  return {
    input: path.resolve('./src/index.ts'),
    output: {
      file: 'dist/pizza-ui.esm.js',
      format: 'esm',
      sourcemap: false,
    },
    plugins: commonPlugins,
    external: ['vue'],
  };
}

export default [bundleUmd(), bundleEsm()];
