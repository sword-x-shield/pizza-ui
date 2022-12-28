import { useConfig } from '@pizza-ui/composables';

interface PizzaOption {
  componentPrefix: string
}

export const componentPrefix = 'P';

export const getClsPrefix = (componentName?: string): string => {
  const { clsPrefix } = useConfig();

  if (componentName)
    return `${clsPrefix}-${componentName}`;

  return clsPrefix;
};

export const getComponentPrefix = (options?: PizzaOption) => {
  return options?.componentPrefix ?? componentPrefix;
};
