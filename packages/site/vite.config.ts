import path from 'node:path';
import process from 'node:process';
import { defineConfig } from 'vite';
import createVuePlugin from '@vitejs/plugin-vue';
import DefineOptions from 'unplugin-vue-define-options';
import Inspect from 'vite-plugin-inspect';
import { warmup } from 'vite-plugin-warmup';
import { VitePWA } from 'vite-plugin-pwa';

// enable pizza-site-parser hmr
// https://github.com/vitejs/vite/issues/5370#issuecomment-1339022262
import { pizzaSitePlugin } from '../pizza-site-parser/dist/index';

const nowEnv = process.env.NODE_ENV;
const wramupPlugin = warmup({
  clientFiles: ['./src/**/*.vue', './index.html'],
});

const pwaPlugin = VitePWA({
  includeAssets: ['logo.ico'],
  base: '/pizza-ui',
  manifest: {
    name: 'Pizza Ui',
    short_name: 'Pizza',
    description: 'Vue3 UI Library',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  devOptions: {
    enabled: nowEnv === 'development',
    type: 'module',
    navigateFallback: 'index.html',
  },
});

const vuePlugin = createVuePlugin({
  include: [/\.vue$/, /\.md$/],
}) as any;
// https://vitejs.dev/config/
export default defineConfig({
  base: '/pizza-ui',
  plugins: [
    wramupPlugin,
    pizzaSitePlugin({
      liveInjectOption: {
        env: nowEnv,
      },
    }),
    DefineOptions.vite(),
    Inspect(),
    vuePlugin,
    pwaPlugin,
  ],
  resolve: {
    conditions: ['dev'],
    alias: [
      { find: '@/views', replacement: path.resolve('./src/views') },
      { find: '@/components', replacement: path.resolve('./src/components') },
      // match pizza-ui internal paths
      { find: /^@pizza-ui/, replacement: path.resolve('../pizza-ui') },
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
