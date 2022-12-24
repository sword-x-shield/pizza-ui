import { resolve } from 'node:path';
import fs from 'fs-extra';
import { marked } from 'marked';
import uppercamelcase from 'uppercamelcase';
import matter from 'gray-matter';
import { createRenderer, fetchCode } from './utils';
import type { ExampleListType } from './type';

const mdRenderer = createRenderer();

async function getExampleContentByFile(fileName: string, filePath: string) {
  const exampleCode = await fs.readFile(
    resolve(filePath, '..', fileName),
    'utf-8',
  );

  const { data } = matter(fetchCode(exampleCode, 'docs').trim());

  return { ...data };
}

async function parserExampleList(code: string, url: string) {
  const originList = code.split('\n').map(example => example.trim()).filter(example => Boolean(example));
  const formatList = [];

  for (const id of originList) {
    let fileName;
    if (id.includes('.vue'))
      fileName = `${id.slice(0, -4)}.example.vue`;
    else
      fileName = `${id}.example.md`;

    const variable = `${uppercamelcase(id)}Example`;
    const { title } = await getExampleContentByFile(fileName, url);

    formatList.push({
      id,
      variable,
      title,
      tag: `<${variable} />`,
      fileName,
    });
  }

  return formatList;
}

function genExampleTemplate(exampleList: ExampleListType, colSpan = 2) {
  return `<component-demos :span="${colSpan}">${exampleList
    .map(({ tag }) => tag)
    .join('\n')}</component-demos>`;
}

function genScript(demoInfos: ExampleListType, components = [], forceShowAnchor: boolean) {
  const showAnchor = !!(demoInfos.length || forceShowAnchor);
  const importStmts = demoInfos
    .map(({ variable, fileName }) => `import ${variable} from './${fileName}'`)
    .concat(components.map(({ importStmt }) => importStmt))
    .join('\n');
  const componentStmts = demoInfos
    .map(({ variable }) => variable)
    .concat(components.map(({ ids }) => ids).flat())
    .join(',\n');
  const script = `<script>
  ${importStmts}
  export default {
    components: {
      ${componentStmts}
    },
    setup () {
      return {
        wrapperStyle: 'display: flex; flex-wrap: nowrap; padding: 20px',
        contentStyle: 'flex: 1;',
      }
    }
  }
  </script>`;
  return script;
}

function genTemplate(tokens: marked.TokensList) {
  const docMainTemplate = marked.parser(tokens, {
    gfm: true,
    renderer: mdRenderer,
  });

  const template = `
  <template>
    <div
      class="doc"
      :style="wrapperStyle"
    >
      <div :style="contentStyle">
        ${docMainTemplate}
      </div>
      <div style="width: 192px;" v-if="showAnchor">
      </div>
    </div>
  </template>`;
  return template;
}

export async function parserEntryMarkdown(code: string, url: string) {
  const forceShowAnchor = !!~code.search('<!--anchor:on-->');
  const colSpan = ~code.search('<!--single-column-->') ? 1 : 2;
  const tokens = marked.lexer(code);
  // 解析示例
  const examplesIndex = tokens.findIndex(token => token.type === 'code' && token.lang === 'example');
  let examplesList: ExampleListType = [];
  if (~examplesIndex) {
    examplesList = await parserExampleList((tokens[examplesIndex] as marked.Tokens.Code).text, url);
    tokens.splice(examplesIndex, 1, {
      type: 'html',
      pre: false,
      text: genExampleTemplate(examplesList, colSpan),
    } as unknown as marked.Tokens.HTML);
  }
  const scriptCode = await genScript(examplesList, [], forceShowAnchor);
  const templateCode = await genTemplate(tokens);

  return `${templateCode}\n\n${scriptCode}`;
}
