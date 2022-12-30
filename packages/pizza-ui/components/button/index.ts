import { withInstall } from '@pizza-ui/utils';
import type { Component, Plugin } from 'vue';

import Button from './src/button.vue';

export const PButton: Component & Plugin = withInstall(Button);
export default PButton;
