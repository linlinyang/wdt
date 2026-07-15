/**
 * 删除索引类型
 * @example
 * RemoveIndexSignature<{[key: string]: any;bar: () => void;}>
 * // => {bar: () => void;}
 * RemoveIndexSignature<Record<string, number>>;
 * // => {}
 */
export type RemoveIndexSignature<T extends object> = {
  [K in keyof T as (string extends K ? never : (number extends K ? never : K))]: T[K]
};

/**
 * 对象类型键值增加前缀
 * @param T 目标对象
 * @param P 前缀字符串
 * @param S 是否覆盖索引签名
 * 
 * @example
 * Prefix<{foo: string; [index: number]: string}, 'prefix/'>;
 * // => {[x: `prefix/${number}`]: string; "prefix/foo": string;}
 * Prefix<{foo: string; [index: number]: string}, 'prefix/', false>;
 * // => {[x: number]: string; "prefix/foo": string;}
 */
export type Prefix<T extends object, P extends string = '', S extends boolean = true> = S extends false ? {
  [K in keyof T as (number extends K
    // 索引number
    ? number
    // 索引string
    : string extends K
      ? string
      // 固定key
      : `${ P }${ Extract<K, string | number> }`)
  ]: T[K];
} : {
  [K in keyof T as (`${ P }${ Extract<K, string | number> }`)]: T[K];
};

/**
 * Prefix逆操作，对象类型键值去除前缀
 * @param T 目标对象
 * @param P 前缀字符串
 * @param S 是否覆盖索引签名
 * 
 * @example
 * Unprefix<{"prefix/foo": string;[index: `prefix/${number}`]: string;[a: string]: string}, 'prefix/'>
 * // => {foo: string; [x: number]: string; [x: string]: string};
 * Unprefix<{"prefix/foo": string;[index: `prefix/${number}`]: string;[a: string]: string}, 'prefix/', false>;
 * // => {foo: string;[x: `prefix/${number}`]: string; [x: string]: string;}
 */
export type Unprefix<T extends object, P extends string = '', S extends boolean = true> = S extends false ? {
  [K in keyof T as (
    K extends `${ P }${ infer U }`
      ? `${ string }` extends U
        ? K
        : `${ number }` extends U
          ? K
          : U
      : K)
  ]: T[K];
} : {
  [K in keyof T as (K extends `${ P }${ infer U }` ? U : K)]: T[K];
};

/**
 * 获取数组元素联合类型
 * @param T 数组类型
 * @return element1 | element2...
 * 
 * @example
 * ArrayElement<[number, string]>
 * // => number | string
 * ArrayElement<readonly[1, 2]>
 * // => 1 | 2
 */
export type ArrayElement<T> = T extends ReadonlyArray<infer U> ? U : never;
