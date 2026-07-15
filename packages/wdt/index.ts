export * from '@wdt/components';
export * from '@wdt/hooks';
export * from '@wdt/utils';
export * from '@wdt/defines';
import type { App } from 'vue';
import { components } from './componens';

// 全局注册校验
const INSTALL_KEY = Symbol('install');

export const install = (app: App): void => {
  // 避免重复安装
  if ((app as any)[INSTALL_KEY]) {
    return;
  }
  (app as any)[INSTALL_KEY] = true;
  components.forEach((component) => {
    app.component(component.name, component);
  });
};

/* global __VERSION__ */
export const version = __VERSION__;
