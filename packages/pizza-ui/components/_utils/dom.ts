import { isString } from 'lodash-es';

export const getElement = (
  target: string | HTMLElement | undefined,
  container?: Document | HTMLElement,
): HTMLElement | undefined => {
  if (isString(target)) {
    const selector = target[0] === '#' ? `[id='${target.slice(1)}']` : target;
    return (container ?? document).querySelector<HTMLElement>(selector) ?? undefined;
  }
  return target;
};
