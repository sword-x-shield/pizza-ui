export * from './components/anchor';

declare module 'vue' {
  export interface GlobalComponents {
    PAnchor: typeof import('@pizza/ui')['PAnchor']
  }
}
