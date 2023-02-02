import { HtmlTagDescriptor, PluginOption } from 'vite';

const globalPizzaLiveAppCode = `(() => {
        // 存储 exapmle 生成的所有 app 实例
        window.__p_apps__ = {};
      })();`;

export function PLiveInjectionsPlugin(options = {}): PluginOption {
  const defaultOptions = {
    importmap: {
      imports: {
        // TODO: 动态获取 vue 版本; 处理 pizza-ui
        'vue': 'https://unpkg.com/@vue/runtime-dom@3.2.45/dist/runtime-dom.esm-browser.js',
        'pizza-ui/': 'http://localhost:5173/pizza-ui/',
      },
    },
  };

  const resolvedOptions = {
    ...defaultOptions,
    ...options,
  };

  return {
    name: 'pizza:vite-plugin-live-inject',
    transformIndexHtml(html) {
      const tags: HtmlTagDescriptor[] = [];
      const { importmap } = resolvedOptions;

      tags.push({
        tag: 'script',
        children: globalPizzaLiveAppCode,
      });

      tags.push({
        tag: 'script',
        attrs: {
          async: true,
          src: 'https://unpkg.com/es-module-shims@1.5.18/dist/es-module-shims.wasm.js',
        },
      });

      tags.push({
        tag: 'script',
        attrs: {
          type: 'importmap',
        },
        children: JSON.stringify(importmap),
      });

      return {
        html,
        tags,
      };
    },
  };
}
