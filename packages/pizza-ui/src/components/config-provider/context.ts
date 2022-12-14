import { InjectionKey } from 'vue';

interface ConfigProviderInjection {
  prefix: string
}

export const injectKey: InjectionKey<ConfigProviderInjection> = Symbol('PizzaConfigProvider');
