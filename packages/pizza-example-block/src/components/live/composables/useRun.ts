import { Ref, onMounted, ref, watch } from 'vue';
import { LiveProps } from '../props';
import { COMP_IDENTIFIER, compileFile } from '../utils';

export function useRun(props: Readonly<LiveProps>, target: Ref<HTMLElement>, id: string, currentCount: number) {
  let scriptElement: HTMLScriptElement;

  // TODO: 应该要收集所有 script 标签，离开当前组件页面时清空
  function createModuleScript(blob: Blob) {
    if (scriptElement)
      document.body.removeChild(scriptElement);

    scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'module');
    scriptElement.onload = () => {
      console.warn('加载成功');
    };
    scriptElement.src = URL.createObjectURL(blob);
    document.body.appendChild(scriptElement);
  }

  async function runCompileCodeInlineScript() {
    if (props.code) {
      // 1. 编译 Vue 单文件组件，生成
      const { js } = await compileFile(props.code, currentCount);

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
              const AppComponent = ${COMP_IDENTIFIER}${currentCount};
              if(window.__p_apps__['${COMP_IDENTIFIER}${currentCount}']) {
                console.log('卸载 ${COMP_IDENTIFIER}${currentCount}')
                window.__p_apps__['${COMP_IDENTIFIER}${currentCount}'].unmount();
              }

              AppComponent.name = 'Repl'
              const app = window.__p_apps__['${COMP_IDENTIFIER}${currentCount}'] = _createApp(AppComponent)
              app.use(Pizza)
              app.config.unwrapInjectedRef = true
              app.config.errorHandler = e => console.error(e)
              app.mount('#${id}')
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

      return js;
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
  };
}
