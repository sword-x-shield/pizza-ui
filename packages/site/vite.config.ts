import path from 'path';
import { defineConfig } from 'vite';
import createVuePlugin from '@vitejs/plugin-vue';
import siteParser from '@pizza/site-parser';

const site = siteParser();
const vuePlugin = createVuePlugin({
  include: [/\.vue$/, /\.md$/],
}) as any;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    site,
    vuePlugin,
  ],
  resolve: {
    alias: [
      { find: '@/views', replacement: path.resolve('./src/views') },
      { find: '@/components', replacement: path.resolve('./src/components') },
      { find: /^@pizza\/(.*)/, replacement: path.resolve('../pizza-$1/src') },
    ],
  },
  optimizeDeps: {
    include: ['monaco-volar/vue.worker'],
  },
  server: {
    host: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "../pizza-ui/_styles/variables/index.scss";@import "../pizza-ui/_styles/font.scss";',
      },
    },
  },
});
