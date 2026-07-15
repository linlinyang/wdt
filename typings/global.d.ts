declare module 'vue' {
  export interface GlobalComponents {
    WVirtualScroll: typeof import('wdt')['VirtualScroll'];
    WSelectPanel: typeof import('wdt')['SelectPanel'];
  }
}
