import type { App } from 'vue';
import * as components from './components';

const install = (app: App) => {
  for (const key of Object.keys(components)) {
    const name = key as keyof typeof components;
    app.use(components[name]);
  }
};

export * from './components';
export { useConfig } from '../composables/use-config';

export default {
  install,
};
