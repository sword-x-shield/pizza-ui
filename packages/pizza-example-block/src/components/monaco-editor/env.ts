import { editor, languages } from 'monaco-editor-core';
import VueWorker from 'monaco-volar/vue.worker?worker';
import EditorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker';
import * as volar from '@volar/monaco';
import type { LanguageService } from '@volar/vue-language-service';

export function setupMonacoEnv(takeoverMode = false) {
  let initialized = false;

  languages.register({ id: 'vue', extensions: ['.vue'] });
  languages.onLanguage('vue', setup);

  const languageLiseners = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'json'];
  if (takeoverMode) {
    languageLiseners.forEach(lang => languages.onLanguage(lang, setup));
  }

  async function setup() {
    if (initialized) {
      return;
    }

    initialized = true;

    (self as any).MonacoEnvironment ??= {};
    (self as any).MonacoEnvironment.getWorker ??= () => new EditorWorker();

    const getWorker = (self as any).MonacoEnvironment.getWorker;

    (self as any).MonacoEnvironment.getWorker = (_: any, label: string) => {
      if (label === 'vue') {
        return new VueWorker();
      }

      return getWorker();
    };

    const worker = editor.createWebWorker<LanguageService>({
      moduleId: 'vs/language/vue/vueWorker',
      label: 'vue',
      createData: {},
    });
    const languageId = takeoverMode
      ? languageLiseners.concat('vue')
      : ['vue'];
    const getSyncUris = () => editor.getModels().map(model => model.uri);
    volar.editor.activateMarkers(
      worker,
      languageId,
      'vue',
      getSyncUris,
      editor,
    );
    volar.editor.activateAutoInsertion(worker, languageId, getSyncUris, editor);
    await volar.languages.registerProvides(
      worker,
      languageId,
      getSyncUris,
      languages,
    );
  }
}
