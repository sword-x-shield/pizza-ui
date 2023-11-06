import * as monaco from 'monaco-editor-core';
import GithubDark from 'monaco-themes/themes/GitHub Dark.json';
import GithubLight from 'monaco-themes/themes/GitHub Light.json';
import { loadWASM } from 'onigasm';
import { loadGrammars } from 'monaco-volar';
import onigasmWasm from 'onigasm/lib/onigasm.wasm?url';
import { setupMonacoEnv } from './env';

// 初始化编辑器
export const initMonacoEditor = async () => {
  monaco.editor.defineTheme('github-light', GithubLight as any);
  monaco.editor.defineTheme('github-dark', GithubDark as any);

  await Promise.all([
    setupMonacoEnv(),
    loadWASM(onigasmWasm),
  ]);
};

export const wire = async (editor: any) => {
  loadGrammars(editor);
};

initMonacoEditor();

export { monaco };
