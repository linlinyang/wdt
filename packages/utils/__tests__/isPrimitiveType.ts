import { isPrimitiveType } from '@wdt/utils';

it('基本类型测试：', () => {
  expect(isPrimitiveType('')).toBe(true);
  expect(isPrimitiveType(0)).toBe(true);
  expect(isPrimitiveType(true)).toBe(true);
  expect(isPrimitiveType(Symbol(''))).toBe(true);
  expect(isPrimitiveType(BigInt(1111))).toBe(true);
  expect(isPrimitiveType(BigInt(9007199254740991))).toBe(true);
  expect(isPrimitiveType(null)).toBe(true);
  expect(isPrimitiveType(undefined)).toBe(true);
});

it('异常测试：', () => {
  expect(isPrimitiveType([])).toBe(false);
  expect(isPrimitiveType({})).toBe(false);
  expect(isPrimitiveType(new Date())).toBe(false);
  expect(isPrimitiveType(/reg/i)).toBe(false);
  expect(isPrimitiveType(() => {})).toBe(false);
});

it('类型测试：', () => {
  expectTypeOf(isPrimitiveType).returns.toBeBoolean();
});
