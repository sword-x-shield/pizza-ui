import type { PluginOption } from 'vite';
import { IInjectOptions, PLiveInjectionsPlugin } from './plugins/live-injections';
import { PSiteParserPlugin } from './plugins/site-parser';
// import { ILocalSearchOption, localSearchPlugin } from './plugins/local-search';

export interface IPizzaSitePluginOption {
  liveInjectOption: IInjectOptions
  // localSearchOption: ILocalSearchOption
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
