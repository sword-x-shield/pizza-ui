import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const monacoEditorEsmPrefix = 'monaco-editor/esm/vs';

const monacoEditorWorker = [
  `${monacoEditorEsmPrefix}/language/json/json.worker`,
  `${monacoEditorEsmPrefix}/language/css/css.worker`,
  `${monacoEditorEsmPrefix}/language/html/html.worker`,
  `${monacoEditorEsmPrefix}/language/typescript/ts.worker`,
  `${monacoEditorEsmPrefix}/editor/editor.worker`,
];

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
    include: [...monacoEditorWorker, resolve(__dirname, './src/components/monaco-editor/index')],
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
      manualChunks: {
        jsonWorker: [`${monacoEditorEsmPrefix}/language/json/json.worker`],
        cssWorker: [`${monacoEditorEsmPrefix}/language/css/css.worker`],
        htmlWorker: [`${monacoEditorEsmPrefix}/language/html/html.worker`],
        tsWorker: [`${monacoEditorEsmPrefix}/language/typescript/ts.worker`],
        editorWorker: [`${monacoEditorEsmPrefix}/editor/editor.worker`],
      },
    },
  },
});
