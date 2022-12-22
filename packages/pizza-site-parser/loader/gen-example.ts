import matter from 'gray-matter';
import { marked } from 'marked';
import { createRenderer, fetchCode, genVueComponent } from './utils';
import type { ComponentPartsType } from './type';

const mdRenderer = createRenderer();

function getFileName(filePath: string) {
  const dirs = filePath.split('/');
  const fileNameWithExtension = dirs[dirs.length - 1];
  return fileNameWithExtension.split('.')[0];
}

async function getContentOfExample(code: string, filePath: string): Promise<ComponentPartsType> {
  // get content
  const { data, content: matterContent } = await matter(await fetchCode(code, 'docs').trim());
  const tokens = marked.lexer(matterContent);
  const cnSplitIndex = tokens.findIndex(h => h.type === 'heading' && h.text === 'zh-CN');
  const enSplitIndex = tokens.findIndex(h => h.type === 'heading' && h.text === 'en-US');
  const endIndex = ~enSplitIndex ? enSplitIndex : tokens.length;
  const cnContentTokens = tokens.slice(cnSplitIndex + 1, endIndex);
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
  const template = await fetchCode(code, 'template');

  // get style
  const style = await fetchCode(code, 'style');

  return {
    title: data.title,
    language: languageType,
    fileName: await getFileName(filePath),
    script,
    style,
    content,
    code: `${template}\n\n${script}\n\n${style}`,
  };
}

export async function parserExample(code: string, filePath: string) {
  const genParts = await getContentOfExample(code, filePath);
  const example = genVueComponent(genParts);
  return example;
}
