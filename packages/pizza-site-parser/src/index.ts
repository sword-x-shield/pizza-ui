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
