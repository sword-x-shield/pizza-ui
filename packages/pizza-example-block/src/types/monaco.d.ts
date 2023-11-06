declare module 'monaco-volar/vue.worker?worker' {
  // has something wrong!!
  // import { VueWorker } from 'monaco-volar/dist/vueWorker'
  export default class {}
}

declare module 'monaco-editor-core/esm/vs/editor/editor.worker?worker' {
  import Worker from 'monaco-editor-core/esm/vs/editor/editor.worker';

  export default Worker;
}

declare module 'onigasm/lib/onigasm.wasm?url'
