import { withInstall } from '@pizza-ui/utils';
import type { Component, Plugin } from 'vue';

import Affix from './src/affix.vue';

export const PAffix: Component & Plugin = withInstall(Affix);
export type AffixInstance = InstanceType<typeof Affix>;

export default PAffix;
