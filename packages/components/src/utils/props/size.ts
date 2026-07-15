import type { Sizes } from '@wdt/components';
import { isNil } from 'lodash-es';

/**
 * 获取组件尺寸名称
 * default被视为无效组件名
 */
export const getComSize = (size?: Sizes): Sizes | undefined => {
  if (isNil(size) || size === 'default') {
    return undefined;
  }

  return size;
};
