import { inject } from 'vue';
import { injectKey } from '../src/components/config-provider/context';

export const defaultClsPrefix = 'p';

export function usePrefix() {
  const PConfigProvider = inject(injectKey, undefined);
  return PConfigProvider?.prefix ?? defaultClsPrefix;
}
