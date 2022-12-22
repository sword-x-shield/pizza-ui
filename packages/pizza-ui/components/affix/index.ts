import { withInstall } from '@pizza-ui/utils';

import Affix from './src/affix.vue';

export const PAffix = withInstall(Affix);
export type AffixInstance = InstanceType<typeof Affix>;

export default PAffix;
