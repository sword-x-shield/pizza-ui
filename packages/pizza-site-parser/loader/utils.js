import { marked } from 'marked';

const scriptRE = /<script[^>]*>([\s\S]*)<\/script>/;
const scriptContentRE = /(?<=<script[^>]*>)([\s\S]*)(?=<\/script>)/;
const templateRE = /<template[^>]*>([\s\S]*)<\/template>/;
const styleRE = /<style[^>]*>([\s\S]*)<\/style>/;
const docsRE = /(?<=<docs>)([\s\S]*)(?=<\/docs>)/;
const reObj = {
  script: scriptRE,
  style: styleRE,
  docs: docsRE,
  template: templateRE,
  scriptContent: scriptContentRE,
};

export function fetchCode(src, type) {
  if (type === 'template')
    src = src.split('<script')[0];

  const matches = src.match(reObj[type]);
  return matches ? matches[0] : '';
}

export function createRenderer(wrapCodeWithCard = true) {
  const renderer = new marked.Renderer();
  const overrides = {
    table(header, body) {
      if (body) body = `<tbody>${body}</tbody>`;
      return (
        '<div class="md-table-wrapper"><p-table single-column class="md-table">\n'
        + `<thead>\n${
          header
        }</thead>\n${
          body
        }</p-table>\n`
        + '</div>'
      );
    },

    tablerow(content) {
      return `<tr>\n${content}</tr>\n`;
    },

    tablecell(content, flags) {
      const type = flags.header ? 'th' : 'td';
      const tag = flags.align
        ? `<${type} align="${flags.align}">`
        : `<${type}>`;
      return `${tag + content}</${type}>\n`;
    },

    code: (code, language) => {
      if (language.startsWith('__'))
        language = language.replace('__', '');

      const isLanguageValid = !!(language && hljs.getLanguage(language));
      if (!isLanguageValid)
        throw new Error(`MdRendererError: ${language} is not valid for code - ${code}`);

      const highlighted = hljs.highlight(code, { language }).value;
      const content = `<p-code><pre v-pre>${highlighted}</pre></p-code>`;
      return wrapCodeWithCard
        ? `<p-card embedded :bordered="false" class="md-card" content-style="padding: 0;">
            <p-scrollbar x-scrollable content-style="padding: 16px;">
              ${content}
            </p-scrollbar>
          </p-card>`
        : content;
    },
    heading: (text, level) => {
      const id = text.replace(/ /g, '-');
      return `<p-h${level} id="${id}">${text}</p-h${level}>`;
    },
    blockquote: (quote) => {
      return `<p-blockquote>${quote}</p-blockquote>`;
    },
    hr: () => '<p-hr />',
    paragraph: (text) => {
      return `<p-p>${text}</p-p>`;
    },
    link(href, title, text) {
      if (/^(http:|https:)/.test(href))
        return `<p-a href="${href}" target="_blank">${text}</p-a>`;

      return `<router-link to="${href}" #="{ navigate, href }" custom><p-a :href="href" @click="navigate">${text}</p-a></router-link>`;
    },
    list(body, ordered, start) {
      const type = ordered ? 'p-ol' : 'p-ul';
      const startatt = ordered && start !== 1 ? ` start="${start}"` : '';
      return `<${type}${startatt}>\n${body}</${type}>\n`;
    },
    listitem(text) {
      return `<p-li>${text}</p-li>`;
    },
    codespan(code) {
      return `<p-text code>${code}</p-text>`;
    },
    strong(text) {
      return `<p-text strong>${text}</p-text>`;
    },
    checkbox(checked) {
      return `<p-checkbox :checked="${checked}" style="vertical-align: -2px; margin-right: 8px;" />`;
    },
  };

  Object.keys(overrides).forEach((key) => {
    renderer[key] = overrides[key];
  });
  return renderer;
}
