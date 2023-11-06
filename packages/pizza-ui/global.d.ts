declare module 'vue' {
  export interface GlobalComponents {
    PAffix: typeof import('pizza-ui')['PAffix']
    PAnchorLink: typeof import('pizza-ui')['PAnchorLink']
    PAnchor: typeof import('pizza-ui')['PAnchor']
    PButton: typeof import('pizza-ui')['PButton']
    PConfigProvider: typeof import('pizza-ui')['PConfigProvider']
  }
}

export {};
