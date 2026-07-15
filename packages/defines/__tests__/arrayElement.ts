import type { ArrayElement } from '@wdt/defines';

it('正常功能', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const numArr = [1, 2, 3];
  expectTypeOf<ArrayElement<typeof numArr>>().toEqualTypeOf<number>();
  // 元组
  expectTypeOf<ArrayElement<[1, 2, 3]>>().toEqualTypeOf<1 | 2 | 3>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const readonlyNumArr = [1, 2, 3] as const; // readonly数组
  expectTypeOf<ArrayElement<typeof readonlyNumArr>>().toEqualTypeOf<1 | 2 | 3>();
});

it('异常功能', () => {
  expectTypeOf<ArrayElement<string>>().toEqualTypeOf<never>();
  expectTypeOf<ArrayElement<boolean | number>>().toEqualTypeOf<never>();
});
