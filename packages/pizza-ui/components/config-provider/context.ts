import { InjectionKey } from 'vue';

interface ConfigProviderInjection {
  clsPrefix: string
}

export const injectKey: InjectionKey<ConfigProviderInjection> = Symbol('PizzaConfigProvider');
