import { onMounted, watch } from 'vue';
import { CompilerError } from 'vue/compiler-sfc';
import { useError } from '../../../composables';
import { LiveProps } from '../props';
import { compileFile } from '../utils';

export interface UseRunOptions {
  /**
   * 默认值为 '__sfc__' + new Date().getTime()
   */
  componentId?: string
}

export const COMP_IDENTIFIER = '__sfc__';

export function useRun(props: Readonly<LiveProps>, options: UseRunOptions = {}) {
  const defaultOptions = {
    componentId: `${COMP_IDENTIFIER}${new Date().getTime()}`,
  };

  const { componentId } = {
    ...defaultOptions,
    ...options,
  };

  let scriptElement: HTMLScriptElement;
  let styleElement: HTMLStyleElement;

  const { errors, formatErrorMsg, cleanError, handleError } = useError<CompilerError>();
  // TODO: 应该要收集所有 script / style 标签，离开当前组件页面时清空
  function createModuleScript(blob: Blob) {
    if (scriptElement)
      document.body.removeChild(scriptElement);

    scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'module');
    scriptElement.src = URL.createObjectURL(blob);
    document.body.appendChild(scriptElement);
  }

  function updateStyle(id: string, content: string) {
    if (styleElement) {
      styleElement.textContent = content;
      return;
    }

    styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    styleElement.setAttribute('data-p-style-id', id);
    styleElement.textContent = content;
    document.head.appendChild(styleElement);
  }

  async function runCompileCodeInlineScript() {
    if (props.code) {
      try {
      // 1. 编译 Vue 单文件组件，生成
        const { js, css } = await compileFile(props.code, componentId);

        // 2. 处理待执行的 js
        const codeToEval = [
          `import { ${
            false ? 'createSSRApp' : 'createApp'
          } as _createApp } from "vue";
        `,
          `
        import Pizza from "pizza-ui/pizza-ui.esm.js";
        `,
          js,
          `
            ;const _mount = () => {
              const AppComponent = ${componentId};
              if(window.__p_apps__['${componentId}']) {
                console.log('卸载 ${componentId}')
                window.__p_apps__['${componentId}'].unmount();
              }

              AppComponent.name = 'Repl'
              const app = window.__p_apps__['${componentId}'] = _createApp(AppComponent)
              app.use(Pizza)
              app.config.unwrapInjectedRef = true
              app.config.errorHandler = e => console.error(e)
              app.mount('#${componentId}')
            }
            if (window.__ssr_promise__) {
              window.__ssr_promise__.then(_mount)
            } else {
              _mount()
            }`,
        ];

        // module script 是异步的，转成 blob 再进行后续操作
        const blob = new Blob([codeToEval.join('')], { type: 'text/javascript' });
        // 3. 创建 js 标签
        createModuleScript(blob);

        // 4. 创建 style 标签
        updateStyle(componentId, css);

        cleanError();

        return js;
      } catch (error) {
        if (Array.isArray(error))
          handleError(error[0]);
        else
          handleError(error);

        return '';
      }
    }
    return '';
  }

  watch(() => props.code, () => {
    runCompileCodeInlineScript();
  });

  onMounted(() => {
    runCompileCodeInlineScript();
  });

  return {
    runCompileCodeInlineScript,
    errors,
    formatErrorMsg,
  };
}
