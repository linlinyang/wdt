import { isSimpleType } from '@wdt/utils';

it('基本类型测试：', () => {
  expect(isSimpleType('')).toBe(true);
  expect(isSimpleType(0)).toBe(true);
  expect(isSimpleType(true)).toBe(true);
  expect(isSimpleType(Symbol(''))).toBe(true);
  expect(isSimpleType(BigInt(1111))).toBe(true);
  expect(isSimpleType(BigInt(9007199254740991))).toBe(true);
});

it('异常测试：', () => {
  expect(isSimpleType([])).toBe(false);
  expect(isSimpleType({})).toBe(false);
  expect(isSimpleType(new Date())).toBe(false);
  expect(isSimpleType(/reg/i)).toBe(false);
  expect(isSimpleType(() => {})).toBe(false);
  expect(isSimpleType(null)).toBe(false);
  expect(isSimpleType(undefined)).toBe(false);
});

it('类型测试：', () => {
  expectTypeOf(isSimpleType).returns.toBeBoolean();
});
