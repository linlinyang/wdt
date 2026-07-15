import { clone } from '@wdt/utils'

const num1 = 123
const num2 = Infinity
const num3 = NaN
const undef = undefined
const date = new Date()
const str1 = 'str1'
const str2 = ''
const regexg1 = /^regexp1$/
const regexp2 = new RegExp('^(?<foo>regexp2)$')
const symbol1 = Symbol('symbol1')
const symbol2 = Symbol.for('symbol2')
const bgint = 123456789n
const func = () => 'func'
const obj: Record<string, any> = {
  num1,
  num2,
  num3,
  undef,
  date,
  str1,
  str2,
  regexg1,
  regexp2,
  symbol1,
  symbol2,
  bgint
}
// 循环引用
obj.circular = obj
it('正常拷贝功能', () => {
  // 数值类型
  expect(clone(num1)).toBe(num1);
  expect(clone(num2)).toBe(num2);
  expect(clone(num3)).NaN;
  // undefined类型
  expect(clone(undef)).toBeUndefined();
  // 日期类型
  expect(clone(date)).not.toBe(date);
  expect(clone(date).getTime()).toBe(date.getTime());
  // 字符串类型
  expect(clone(str1)).toBe(str1)
  expect(clone(str2)).toBe(str2)
  // 正则类型
  expect(clone(regexg1)).not.toBe(regexg1)
  expect(clone(regexg1).source).toBe(regexg1.source)
  expect(clone(regexp2)).not.toBe(regexp2)
  expect(clone(regexp2).source).toBe(regexp2.source)
  // symbol类型
  expect(clone(symbol1)).toBe(symbol1)
  expect(clone(symbol2)).toBe(symbol2)
  // null类型
  expect(clone(null)).toBe(null)
  // bigint类型
  expect(clone(bgint)).toBe(bgint)
  // 函数类型
  expect(clone(func).toString()).toBe(func.toString())
  // 对象类型
  const clonedObj = clone(obj)
  expect(clonedObj).not.toBe(obj)
  clonedObj.num1 = 456
  expect(obj.num1).toBe(num1)
  expect(clonedObj.num1).toBe(456)
  clonedObj.undef = null
  expect(obj.undef).toBe(undef)
  expect(clonedObj.undef).toBe(null)
  clonedObj.date = 1000
  expect(obj.date).toBe(date)
  expect(clonedObj.date).toBe(1000)
  clonedObj.str1 = 'foo'
  expect(obj.str1).toBe(str1)
  expect(clonedObj.str1).toBe('foo')
  clonedObj.str2 = 'foo'
  expect(obj.str2).toBe(str2)
  expect(clonedObj.str1).toBe('foo')
  clonedObj.regexg1 = /^regexp2$/
  expect(obj.regexg1.source).toBe(regexg1.source)
  expect(clonedObj.regexg1.source).not.toBe(regexg1.source)
  clonedObj.regexp2 = new RegExp('^(?<foo>regexp1)$')
  expect(obj.regexp2.source).toBe(regexp2.source)
  expect(clonedObj.regexp2.source).not.toBe(regexp2.source)
  clonedObj.symbol1 = Symbol('symbol1')
  expect(obj.symbol1).toBe(symbol1)
  expect(clonedObj.symbol1).not.toBe(symbol1)
  clonedObj.symbol2 = Symbol.for('symbol3')
  expect(obj.symbol2).toBe(symbol2)
  expect(clonedObj.symbol2).toBe(Symbol.for('symbol3'))
})