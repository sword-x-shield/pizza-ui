import { parserEntryMarkdown } from '../loader/gen-entry';
import { parserExample } from '../loader/gen-example';

export function PSiteParserPlugin() {
  return {
    name: 'pizza:vite-plugin-site-parser',
    transform: async (code: string, id: string) => {
      if (id.endsWith('.example.vue')) {
        return {
          code: await parserExample(code, id),
          map: null,
        };
      }

      if (id.endsWith('.md')) {
        return {
          code: await parserEntryMarkdown(code, id),
          map: null,
        };
      }
    },
  };
}
