import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import GithubDark from 'monaco-themes/themes/GitHub Dark.json';

editor.defineTheme('github-dark', GithubDark as any);

self.MonacoEnvironment = {
  getWorker(workerId, label) {
    if (label === 'html' || label === 'handlebars' || label === 'razor')
      return new HtmlWorker();

    return new EditorWorker();
  },
};

