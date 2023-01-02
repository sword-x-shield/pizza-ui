import EditorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker';
import VueWorker from 'monaco-volar/vue.worker?worker';
import * as monaco from 'monaco-editor-core';
import GithubDark from 'monaco-themes/themes/GitHub Dark.json';
import GithubLight from 'monaco-themes/themes/GitHub Light.json';
import { loadWASM } from 'onigasm';
import { loadGrammars, prepareVirtualFiles } from 'monaco-volar';
import onigasmWasm from 'onigasm/lib/onigasm.wasm?url';

function loadMonacoEnv() {
  (self as any).MonacoEnvironment = {
    async getWorker(_: any, label: string) {
      console.log({ label });

      if (label === 'vue')
        return new VueWorker();

      return new EditorWorker();
    },
  };
}
// 初始化编辑器
export const initMonacoEditor = async () => {
  monaco.editor.defineTheme('github-light', GithubLight as any);
  monaco.editor.defineTheme('github-dark', GithubDark as any);

  await Promise.all([
    loadWASM(onigasmWasm),
    loadMonacoEnv(),
    prepareVirtualFiles(),
  ]);
};

export const wire = async (editor: any) => {
  loadGrammars(editor);
};

initMonacoEditor();

export { monaco };

