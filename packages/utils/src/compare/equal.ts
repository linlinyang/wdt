import { PrimitiveType, simpleTypes, type SimpleType } from '@wdt/utils';

/**
 * 判断变量是否是string、boolean、number、bigint、symbol类型
 * @param val 待校验类型
 * @returns boolean
 * @example
 * isSimpleType('str');
 * // => true
 * isSimpleType(123);
 * // => true
 * isSimpleType(true);
 * // => true
 * isSimpleType(Symbol('foo'));
 * // => true
 * isSimpleType(BigInt(9007199254740991));
 * // => true
 */
export const isSimpleType = (val: unknown): val is SimpleType => simpleTypes.includes(typeof val as any);

/**
 * 判断变量是否是原始数据类型
 * @param val 待校验数据类型
 * isPrimitiveType(null);
 * // => true
 * isPrimitiveType(undefined);
 * // => true
 * isPrimitiveType(new Date())
 * // => false
 */
export const isPrimitiveType = (val: unknown): val is PrimitiveType => {
  if (isSimpleType(val)) {
    return true
  }

  return val === null || typeof val === 'undefined'
}