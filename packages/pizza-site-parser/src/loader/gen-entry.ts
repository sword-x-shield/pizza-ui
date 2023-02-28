import { dirname, join, resolve } from 'node:path';
import fs from 'fs-extra';
import { marked } from 'marked';
import uppercamelcase from 'uppercamelcase';
import { parse as parseComponent } from 'vue-docgen-api';
import matter from 'gray-matter';
import { createRenderer, fetchCode, replaceDocPlaceholder } from './utils';
import type { ExampleListType } from './type';
import { API_REG } from './api-gen';

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
    if (id.includes('.vue')) fileName = `${id.slice(0, -4)}.example.vue`;
    else fileName = `${id}.example.md`;

    const variable = `${uppercamelcase(id)}Example`;
    const { title } = await getExampleContentByFile(fileName, url);
    formatList.push({
      id: id.replace('.vue', ''),
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
        wrapperStyle: 'display: flex; flex-wrap: nowrap; padding: 0 20px',
        contentStyle: 'flex: 1; margin-right: 36px;',
        showAnchor: ${showAnchor}
      }
    }
  }
  </script>`;
  return script;
}

function genExampleAnchorTemplate(tokens: marked.TokensList, exampleList: ExampleListType, hasApi: boolean) {
  const linksWithApi = [
    {
      id: 'API',
      title: 'API',
    },
  ].concat(tokens
    .filter(token => token.type === 'heading' && token.depth === 3)
    .map(token => ({
      id: (token as marked.Tokens.Heading).text.replace(/ /g, '-'),
      title: (token as marked.Tokens.Heading).text,
    })));
  const links = (hasApi ? exampleList.concat(linksWithApi as ExampleListType) : exampleList).map(({ id, title }) => `<p-anchor-link title="${title}" href="#${id}"/>`);

  return `
    <p-anchor
      :show-rail="false"
      style="width: 192px; position: sticky; top: 80px; max-height: calc(100vh - 32px - 64px); height: auto;"
    >
      ${links.join('\n')}
    </p-anchor>
  `;
}

function genPageAnchorTemplate(tokens: marked.TokensList) {
  // TODO - simple md file
  return '';
}

function genTemplate(tokens: marked.TokensList, exampleList: ExampleListType, hasApi: boolean) {
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
${
  exampleList.length
    ? genExampleAnchorTemplate(tokens, exampleList, hasApi)
    : genPageAnchorTemplate(tokens)
}
      </div>
    </div>
  </template>`;
  return template;
}

export async function parserEntryMarkdown(code: string, url: string) {
  let resultCode = code;

  const forceShowAnchor = !!~resultCode.search('<!--anchor:on-->');
  const hasApi = !!~resultCode.search('## API');
  const colSpan = ~resultCode.search('<!--single-column-->') ? 1 : 2;

  // 替换占位符
  resultCode = await replaceDocPlaceholder({
    dir: join(dirname(url), '../src'),
    code: resultCode,
    parser: parseComponent,
    placeholderMatchers: API_REG,
    lang: 'zh',
  });

  const tokens = marked.lexer(resultCode);
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
  const templateCode = await genTemplate(tokens, examplesList, hasApi);

  return `${templateCode}\n\n${scriptCode}`;
}
