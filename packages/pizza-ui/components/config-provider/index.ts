import { withInstall } from '@pizza-ui/utils';
import type { Component, Plugin } from 'vue';

import ConfigProvider from './src/config-provider.vue';

export const PConfigProvider: Component & Plugin = withInstall(ConfigProvider);

export default PConfigProvider;
