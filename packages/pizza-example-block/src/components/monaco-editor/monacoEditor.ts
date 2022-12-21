import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import GithubDark from 'monaco-themes/themes/GitHub Dark.json';

editor.defineTheme('github-dark', GithubDark as any);

// watch 模式下重新构建会出现问题，防止开发时重新构建
if (import.meta.env.PROD) {
  self.MonacoEnvironment = {
    getWorker(workerId, label) {
      if (label === 'html' || label === 'handlebars' || label === 'razor')
        return new HtmlWorker();

      return new EditorWorker();
    },
  };
}

