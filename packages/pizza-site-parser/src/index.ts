import type { PluginOption } from 'vite';
import { PLiveInjectionsPlugin } from './plugins/live-injections';
import { PSiteParserPlugin } from './plugins/site-parser';

export function pizzaSitePlugin(): PluginOption[] {
  return [PSiteParserPlugin(), PLiveInjectionsPlugin()];
}

export {
  PLiveInjectionsPlugin,
  PSiteParserPlugin,
};

// expose api
export { parseComponentDocsFromTag } from './loader/utils';
export { API_REG } from './loader/api-gen/utils';
