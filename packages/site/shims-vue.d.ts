declare module '*.vue' {
  import { DefineComponent } from 'vue';

  const component: DefineComponent<NonNullable<unknown>, NonNullable<unknown>, any>;
  export default component;
}

declare namespace global {
  interface ImportMeta {
    env: Record<string, unknown>
    globEager<T = unknown>(globPath: string): Record<string, T>
  }
}
