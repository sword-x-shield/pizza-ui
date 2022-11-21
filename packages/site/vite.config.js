import { defineConfig } from 'vite';
import createVuePlugin from '@vitejs/plugin-vue';
import { genEntry as genEntryPlugin, genExample as genExamplePlugin } from '@pizza/site-parser';

const genEntry = genEntryPlugin();
const genExample = genExamplePlugin();
const vuePlugin = createVuePlugin({
  include: [/\.vue$/, /\.md$/],
});
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    genEntry,
    genExample,
    vuePlugin,
  ],
});
