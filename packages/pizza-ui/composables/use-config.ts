import { inject } from 'vue';
import { injectKey } from '../components/config-provider/context';

export const defaultClsPrefix = 'p';

export function useConfig() {
  const PConfigProvider = inject(injectKey, undefined);
  return {
    clsPrefix: PConfigProvider?.clsPrefix ?? defaultClsPrefix,
  };
}
