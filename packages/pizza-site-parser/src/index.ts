import type { PluginOption } from 'vite';
import { IInjectOptions, PLiveInjectionsPlugin } from './plugins/live-injections';
import { PSiteParserPlugin } from './plugins/site-parser';

export interface IPizzaSitePluginOption {
  liveInjectOption: IInjectOptions
}
export function pizzaSitePlugin(options?: IPizzaSitePluginOption): PluginOption[] {
  const { liveInjectOption } = options;
  return [PSiteParserPlugin(), PLiveInjectionsPlugin(liveInjectOption)];
}

export {
  PLiveInjectionsPlugin,
  PSiteParserPlugin,
};

// expose api
export { parseComponentDocsFromTag } from './loader/utils';
export { API_REG } from './loader/api-gen/utils';
