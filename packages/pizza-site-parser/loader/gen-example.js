import matter from 'gray-matter';
import { marked } from 'marked';
import { createRenderer, fetchCode, genVueComponent } from './utils';

const mdRenderer = createRenderer();

function getFileName(filePath) {
  const dirs = filePath.split('/');
  const fileNameWithExtension = dirs[dirs.length - 1];
  return fileNameWithExtension.split('.')[0];
}

async function getContentOfExample(code, filePath) {
  // get content
  const { data, content: matterContent } = await matter(await fetchCode(code, 'docs').trim());
  const tokens = marked.lexer(matterContent);
  const cnSplitIndex = tokens.findIndex(h => h.type === 'heading' && h.text === 'zh-CN');
  const enSplitIndex = tokens.findIndex(h => h.type === 'heading' && h.text === 'en-US');
  const cnContentTokens = tokens.slice(cnSplitIndex + 1, enSplitIndex);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const enContentTokens = tokens.slice(enSplitIndex + 1);
  // 暂时默认为中文，后续根据全局语言切换content
  const content = await marked.parser(cnContentTokens, {
    renderer: mdRenderer,
  });

  // get language
  const script = await fetchCode(code, 'script');
  let languageType = 'js';
  if (script.includes('lang="ts"')) languageType = 'ts';

  // get template
  const templateContent = await fetchCode(code, 'templateContent');
  const template = await fetchCode(code, 'template');

  // get style
  const style = await fetchCode(code, 'style');

  return {
    title: data.title,
    language: languageType,
    fileName: await getFileName(filePath),
    template: templateContent,
    script,
    style,
    content,
    code: `${template}\n\n${script}\n\n${style}`,
  };
}

async function parserExample(code, filePath) {
  const genParts = await getContentOfExample(code, filePath);
  const example = genVueComponent(genParts);
  return example;
}

export function genExample() {
  return {
    name: 'pizza:vite-plugin-gen-example',
    transform: async (code, id) => {
      if (id.endsWith('.example.vue')) {
        return {
          code: await parserExample(code, id),
          map: null,
        };
      }
    },
  };
}
