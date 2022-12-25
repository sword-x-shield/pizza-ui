export * from './anchor';
export * from './affix';
export * from './config-provider';

declare module 'vue' {
  export interface GlobalComponents {
    PAnchor: typeof import('pizza-ui')['PAnchor']
  }
}
