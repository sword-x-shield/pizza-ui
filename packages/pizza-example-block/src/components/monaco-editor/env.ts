import * as monaco from 'monaco-editor-core';
import VueWorker from 'monaco-volar/vue.worker?worker';
import EditorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker';
import * as volar from '@volar/monaco';
import type { LanguageService } from '@volar/vue-language-service';

export function setupMonacoEnv(takeoverMode = false) {
  let initialized = false;

  monaco.languages.register({ id: 'vue', extensions: ['.vue'] });
  monaco.languages.onLanguage('vue', setup);

  if (takeoverMode) {
    languages.onLanguage('javascript', setup);
    languages.onLanguage('typescript', setup);
    languages.onLanguage('javascriptreact', setup);
    languages.onLanguage('typescriptreact', setup);
    languages.onLanguage('json', setup);
  }

  async function setup() {
    if (initialized)
      return;

    initialized = true;

    (self as any).MonacoEnvironment ??= {};
    (self as any).MonacoEnvironment.getWorker ??= () => new EditorWorker();

    const getWorker = (self as any).MonacoEnvironment.getWorker;

    (self as any).MonacoEnvironment.getWorker = (_: any, label: string) => {
      console.error(label);
      if (label === 'vue')
        return new VueWorker();

      return getWorker();
    };

    const worker = monaco.editor.createWebWorker<LanguageService>({
      moduleId: 'vs/language/vue/vueWorker',
      label: 'vue',
      createData: {},
    });
    const languageId = takeoverMode
      ? [
        'vue',
        'javascript',
        'typescript',
        'javascriptreact',
        'typescriptreact',
        'json',
      ]
      : ['vue'];
    const getSyncUris = () => monaco.editor.getModels().map(model => model.uri);
    volar.editor.activateMarkers(
      worker,
      languageId,
      'vue',
      getSyncUris,
      monaco.editor,
    );
    volar.editor.activateAutoInsertion(worker, languageId, getSyncUris, monaco.editor);
    await volar.languages.registerProvides(
      worker,
      languageId,
      getSyncUris,
      monaco.languages,
    );
  }
}
