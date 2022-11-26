import { fetchCode } from './utils';
async function getContentOfExample(code) {
  return {
    template: await fetchCode(code, 'template'),
    script: await fetchCode(code, 'script'),
    scriptContent: await fetchCode(code, 'scriptContent'),
    style: await fetchCode(code, 'style'),
    docs: await fetchCode(code, 'docs'),
  };
}

async function parserExample(code) {
  // TODO 后续嵌套在 ExampleTemplate.vue 模板中，加入复制、跳转playground等功能
  const { template,script,style } = await getContentOfExample(code);
  // 先返回最初始的解析
  return `${template}\n\n${script}\n\n${style}`;
}

export function genExample() {
  return {
    name: 'pizza:vite-plugin-gen-example',
    transform: async (code, id) => {
      if (id.endsWith('.example.vue')) {
        return {
          code: await parserExample(code),
          map: null,
        };
      }
    },
  };
}
