import path from 'path'
import fs from 'fs-extra'
import { marked } from 'marked'
import uppercamelcase from 'uppercamelcase'
import matter from 'gray-matter'
import { fetchCode, createRenderer } from './utils'

const mdRenderer = createRenderer()

async function getExampleContentByFile(fileName,filePath) {
  const exampleCode = await fs.readFile(
    path.resolve(filePath, '..', fileName),
    'utf-8'
  )
  
  const { data } = matter(fetchCode(exampleCode,'docs').trim())

  return data
}

async function parserExampleList(code, url) {
  const originList = code.split('\n').map((example) => example.trim()).filter((example) => Boolean(example))
  const formatList = []

  for(let id of originList) {
    let fileName
    if (id.includes('.vue')) {
      fileName = id.slice(0, -4) + '.example.vue'
    } else {
      fileName = `${id}.example.md`
    }
    const variable = `${uppercamelcase(id)}Example`
    const exampleContent = await getExampleContentByFile(fileName,url)

    formatList.push({
      id,
      variable,
      title: exampleContent.title,
      tag: `<${variable} />`,
      fileName
    })
  }

  // console.log(formatList,'---')
  return formatList
}

function genExampleTemplate (exampleList, colSpan = 2) {
  return `<component-demos :span="${colSpan}">${exampleList
    .map(({ tag }) => tag)
    .join('\n')}</component-demos>`
}

function genScript (demoInfos, components = [], url, forceShowAnchor) {
  const showAnchor = !!(demoInfos.length || forceShowAnchor)
  const importStmts = demoInfos
    .map(({ variable, fileName }) => `import ${variable} from './${fileName}'`)
    .concat(components.map(({ importStmt }) => importStmt))
    .join('\n')
  const componentStmts = demoInfos
    .map(({ variable }) => variable)
    .concat(components.map(({ ids }) => ids).flat())
    .join(',\n')
  const script = `<script>
  ${importStmts}
  export default {
    components: {
      ${componentStmts}
    },
    setup () {

    }
  }
  </script>`
  return script
}

function genTemplate(tokens) {
  const docMainTemplate = marked.parser(tokens, {
    gfm: true,
    renderer: mdRenderer
  })
  console.log(docMainTemplate,'doc')
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
  </template>`
  return template
}

async function parserEntryMarkdown(
  code,
  url,
) {
  const forceShowAnchor = !!~code.search('<!--anchor:on-->')
  const colSpan = ~code.search('<!--single-column-->') ? 1 : 2
  const tokens = marked.lexer(code)
  // 解析示例
  const examplesIndex = tokens.findIndex(
    (token) => token.type === 'code' && token.lang === 'example'
  )
  let examplesList = []
  if(~examplesIndex) {
    examplesList = await parserExampleList(tokens[examplesIndex].text, url)
    tokens.splice(examplesIndex, 1, {
      type: 'html',
      pre: false,
      text: genExampleTemplate(examplesList, colSpan)
    })
  }
  const scriptCode = await genScript(examplesList,[],url,forceShowAnchor)
  const templateCode = await genTemplate(tokens)

  return `${templateCode}\n\n${scriptCode}`
}

export function genEntry() {
  return {
    name: 'pizza:vite-plugin-gen-entry',
    transform: async (code, id)=>{
      if (id.endsWith('.md')) {
        return {
          code: await parserEntryMarkdown(code, id),
          map: null,
        }
      }
    },
  }
}