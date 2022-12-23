import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// const monacoEditorEsmPrefix = 'monaco-editor-core/esm/vs';

export default defineConfig({
  plugins: [vue(), dts() as any],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "../pizza-ui/_styles/variables/index.scss";@import "../pizza-ui/_styles/font.scss";',
      },
    },
  },
  optimizeDeps: {
    include: [resolve(__dirname, './src/components/monaco-editor/index'), '@volar/vue-language-service'],
  },
  base: '',
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'pizza-example-block',
      formats: ['es', 'cjs'],
      fileName: 'pizza-example-block',
    },
    sourcemap: false,
    rollupOptions: {
      external: ['vue'],
    },
  },
});
