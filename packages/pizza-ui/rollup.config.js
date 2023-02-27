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
const externalPlugin = () => ({
  name: 'vite:external-node_modules',
  async resolveId(source, importer) {
    const result = await this.resolve(source, importer, {
      skipSelf: true,
      custom: { 'node-resolve': {} },
    });

    if (result && /node_modules/.test(result.id))
      return false;

    return null;
  },
});
const treeShakeSetting = () => ({
  moduleSideEffects: ['vue', 'loadsh-es', 'smooth-scroll-into-view-if-needed'],
});

const commonPlugins = ({
  minify,
} = {
  minify: true,
}) => ([
  resolve({ extensions }),
  alias({
    entries: [{ find: '@pizza-ui', replacement: path.resolve(__dirname, '.') }],
  }),
  externalPlugin(),
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
    treeshake: treeShakeSetting(),
    plugins: commonPlugins({
      minify: false,
    }),
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
    treeshake: treeShakeSetting(),
    plugins: commonPlugins({
      minify: false,
    }),
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
        preserveModulesRoot: 'components',
      },
      {
        format: 'commonjs',
        dir: 'lib',
        entryFileNames: '[name].js',
        preserveModules: true,
        preserveModulesRoot: 'components',
      },
    ],
    plugins: commonPlugins({
      minify: false,
    }),
    treeshake: treeShakeSetting(),
  };
}

export default [bundleUmd(), bundleUmdMin(), bundleOrigin()];
