import { InjectionKey } from 'vue';

export interface AnchorContext {
  currentLink: string
  showRail: boolean
  addLink(hash: string, node: HTMLElement): void
  handleClick(e: Event, hash?: string): void
}

export const anchorInjectionKey: InjectionKey<AnchorContext>
  = Symbol('PizzaAnchor');
