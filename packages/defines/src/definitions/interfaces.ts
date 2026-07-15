/**
 * 字典模式-字符串索引
 * @example
 * const obj: Dictionary<string> = {
 *   'some-keys': 'some-values'
 * }
 */
export interface Dictionary<T> {
  [index: string]: T;
}

/**
 * 字典模式-数值索引
 * @example
 * const arr: NumericDictionary<number> = [1, 2, 3];
 * const str: NumericDictionary<string> = 'foo';
 * const obj: NumericDictionary<string> = {
 *   1: 'foo',
 *   2: 'bar'
 * }
 */
export interface NumericDictionary<T> {
  [index: number]: T;
}
