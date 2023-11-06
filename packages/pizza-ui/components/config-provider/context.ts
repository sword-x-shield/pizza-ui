import { InjectionKey } from 'vue';

export type ThemeMode = 'light' | 'dark';
interface ConfigProviderInjection {
  /**
   * 类名前缀
   */
  clsPrefix: string
  /**
   * 主题模式
   */
  mode: ThemeMode
}

export const injectKey: InjectionKey<ConfigProviderInjection> = Symbol('PizzaConfigProvider');
