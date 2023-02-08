import { withInstall } from '@pizza-ui/components/_utils';
import { App } from 'vue';
import type{ Component, Plugin } from 'vue';

import Anchor from './src/anchor.vue';
import AnchorLink from './src/anchor-link.vue';

export const PAnchor = withInstall(Anchor);
export const PAnchorLink = withInstall(AnchorLink);
const _Anchor: Component & Plugin = {
  ...Anchor,
  Link: AnchorLink,
  install: (app: App) => {
    [PAnchor.install, PAnchorLink.install].forEach(installFn => installFn && installFn(app));
  },
};

export type AnchorInstance = InstanceType<typeof Anchor>;
export type AnchorLinkInstance = InstanceType<typeof PAnchorLink>;

export default _Anchor;
