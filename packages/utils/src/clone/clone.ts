import { PrimitiveType, isPrimitiveType } from "@wdt/utils"
import { isNil } from 'lodash-es'

const hasOwnProperty = Object.prototype.hasOwnProperty

// 修改标识
const SET_FLAG = Symbol('setFlag')
// 是否被克隆
const isCloned = <T>(value: T) => hasOwnProperty.call(value, SET_FLAG)
const copies = new Map()
function copyGetter<T extends object>(target: T, key: string | symbol) {
  // 设置修改标志
  if (key === SET_FLAG) {
    return target
  }

  const copyedTarget = copies.get(target) ?? target
  const value = Reflect.get(copyedTarget, key)
  const proto = Object.getPrototypeOf(copyedTarget)
  // 原型链上的方法
  if (typeof value === 'function' && hasOwnProperty.call(proto, key)) {
    return value.bind(copyedTarget)
  }

  return getCopyTarget(value)
}

const shallowCopy = <T extends object>(target: T) => {
  if (copies.has(target)) {
    return copies.get(target)
  }

  const copy = Array.isArray(target) ? [...target] : {...target}
  copies.set(target, copy)
  return copy
}

function copySetter<T extends object>(target: T, key: string | symbol, val: keyof T) {
  const copy = shallowCopy(target)
  const newVal = getCopyTarget(val)
  Reflect.set(copy, key, newVal)
  return true
}

const getCopyTarget = <T>(target: T): T => {
  if (isNil(target) || isCloned(target)) {
    return target
  }

  // 函数类型直接返回
  if (target && typeof target === 'object') {
    return new Proxy(target, {
      get: copyGetter,
      set: copySetter
    })
  }
  
  return target
}

/**
 * 高性能深拷贝
 * @param target 待拷贝数据
 */
export const clone = <T>(target: T): T => {
  // 原始类型，直接返回
  if (isPrimitiveType(target)) {
    return target
  }
  
  if (typeof target === 'object') {
    return getCopyTarget(target)
  }

  return target
}
