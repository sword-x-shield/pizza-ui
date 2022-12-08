import { withInstall } from '@pizza-ui/utils';

import Anchor from './src/anchor.vue';

export const PAnchor = withInstall(Anchor);

export type PAnchorType = InstanceType<typeof Anchor>;

export default PAnchor;
