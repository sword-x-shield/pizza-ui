import { inject } from 'vue';
import { injectKey } from '../components/config-provider/context';

export const defaultClsPrefix = 'p';

export function useConfig() {
  const defaultProvide = {
    clsPrefix: defaultClsPrefix,
    mode: 'light',
  };
  const PConfigProvider = inject(injectKey, defaultProvide);

  return PConfigProvider;
}
