// @ts-expect-error worker
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// @ts-expect-error worker
// import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// @ts-expect-error worker
// import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// @ts-expect-error worker
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
// @ts-expect-error worker
// import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// watch 模式下重新构建会出现问题，防止开发时重新构建
if (import.meta.env.PROD) {
  self.MonacoEnvironment = {
    getWorker(workerId, label) {
      // if (label === 'json')
      //   return new JsonWorker();

      // if (label === 'css' || label === 'scss' || label === 'less')
      //   return new CssWorker();

      if (label === 'html' || label === 'handlebars' || label === 'razor')
        return new HtmlWorker();

      // if (label === 'typescript' || label === 'javascript')
      //   return new TsWorker();

      return new EditorWorker();
    },
  };
}

