// 默认组件命名空间
export const defaultNamespace = 'wdt';

// 状态命名前缀
const isStatePrefix = 'is-';

/**
 * 生成bem格式类名
 * @param namespace 命名空间
 * @example
 * getBEMClsName('wdt', 'input', '', 'inner', '')
 * // => wdt-input__inner
 * getBEMClsName('wdt', 'input', '', '', 'suffix')
 * // => wdt-input--suffix
 */
const getBEMClsName = (
  namespace: string,
  block: string,
  blockSuffix?: string,
  element?: string,
  modifier?: string,
): string => {
  let clsName: string = `${ namespace }-${ block }`;

  if (blockSuffix) {
    clsName = `${ clsName }-${ blockSuffix }`;
  }

  if (element) {
    clsName = `${ clsName }__${ element }`;
  }

  if (modifier) {
    clsName = `${ clsName }--${ modifier }`;
  }

  return clsName;
};

/**
 * 返回状态类名
 * @param name 状态名
 */
function is(name: string): string;
/**
 * 当前状态是指定状态是，返回状态类名
 * @param name 状态名
 * @param state 指定状态
 */
function is(name: string, state: boolean): string;
function is(name: string, state: boolean = true): string {
  return state ? `${ isStatePrefix }${ name }` : '';
}

interface NamespaceAlias {
  b: (blockSuffix?: string) => string;
  e: (element?: string) => string;
  m: (modifier?: string) => string;
  be: (blockSuffix?: string, element?: string) => string;
  bm: (blockSuffix?: string, modifier?: string) => string;
  em: (element?: string, modifier?: string) => string;
  bem: (blockSuffix?: string, element?: string, modifier?: string) => string;
  is: {
    (name: string): string;
    (name: string, state: boolean): string;
  };
}
export const useNamespace = (
  block: string,
  namespace: string = defaultNamespace,
): NamespaceAlias => {
  const b = (blockSuffix: string = ''): string => getBEMClsName(namespace, block, blockSuffix);
  const e = (element?: string): string => element ? getBEMClsName(namespace, block, '', element) : '';
  const m = (modifier?: string): string => modifier ? getBEMClsName(namespace, block, '', '', modifier) : '';
  const be = (
    blockSuffix: string = '',
    element: string = '',
  ): string => blockSuffix && element ? getBEMClsName(namespace, block, blockSuffix, element) : '';
  const bm = (
    blockSuffix: string = '',
    modifier: string = '',
  ): string => blockSuffix && modifier ? getBEMClsName(namespace, block, blockSuffix, modifier) : '';
  const em = (
    element: string = '',
    modifier: string = '',
  ): string => element && modifier ? getBEMClsName(namespace, block, '', element, modifier) : '';
  const bem = (
    blockSuffix: string = '',
    element: string = '',
    modifier: string = '',
  ) => {
    if (blockSuffix && element && modifier) {
      return getBEMClsName(namespace, block, blockSuffix, element, modifier);
    }

    return '';
  };

  return {
    b,
    e,
    m,
    be,
    bm,
    em,
    bem,
    is,
  };
};
