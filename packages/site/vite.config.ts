import path from 'path';
import { defineConfig } from 'vite';
import createVuePlugin from '@vitejs/plugin-vue';
import siteParser from '@pizza/site-parser';

const site = siteParser();
const vuePlugin = createVuePlugin({
  include: [/\.vue$/, /\.md$/],
});
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
    ],
  },
});
