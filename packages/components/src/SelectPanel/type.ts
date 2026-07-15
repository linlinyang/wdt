import { type SimpleType } from '@wdt/utils';
import type { Sizes } from '@wdt/components';
import { isNil } from 'lodash-es';

// 对象形式下拉项
export interface RawSelectOption<T> {
  // 选中值
  value: T;
  // 展示值
  label?: string | number;
  // 选项是否禁用
  disabled?: boolean;
  // 其他属性
  [key: string]: any;
}

// 下拉项数据格式
export type SelectPanelOption<T> = RawSelectOption<T> | T;

// 选中值
export type SelectValue<T extends SimpleType> = T | T[];

// 选中值集合
export type SelectSetValue<T extends SimpleType> = SelectValue<T> | Set<T>;

// 组件属性
export type Props<T extends SimpleType, O = SelectPanelOption<T>> = Partial<{
  // 当前选中值
  modelValue: SelectValue<T>;
  // 选择面板可选项列表
  options: Array<O>;
  // 组件是否可用
  disabled: boolean;
  // 是否支持多选
  mutiple: boolean;
  // 多选选中上限个数
  multipleLimit: number;
  // 组件尺寸
  size: Sizes;
  // 无内容时展示文案
  emptyText: string;
}>;

// 定义组件触发事件类型
export interface EmitFunc<T extends SimpleType> {
  // 支持v-model
  (e: 'update:modelValue', val: SelectValue<T>): void;
  // 选中项切换事件
  (e: 'change', val: SelectValue<T>, oldVal?: SelectValue<T>): void;
}
/**
 * 将目标值转换为数组
 * @param val 目标值
 * @returns 数组
 * @example
 * toArray(null)
 * // => []
 * toArray()
 * // => []
 * toArray(new Set(1, '2', true))
 * // => [1, '2', true]
 */
export const toArray = <T>(val?: T | T[] | Set<T> | null): T[] => {
  if (isNil(val)) {
    return [];
  }

  if (val instanceof Set) {
    return [...val];
  }

  if (Array.isArray(val)) {
    return val;
  }

  return [val];
};

// 格式化组件传入值
export const normalizeModelValue = <T extends SimpleType>(
  props: Props<T>
) => {
  const {
    mutiple,
    modelValue,
  } = props;

  if (mutiple) {
    return new Set(toArray(modelValue).slice(0, props.multipleLimit ?? Infinity));
  }

  return Array.isArray(modelValue) ? modelValue[0] : modelValue;
};

// 基础组件上下文
export interface BaseContext<T extends SimpleType> {
  readonly props: Props<T>;
  readonly emitFn: EmitFunc<T>;
  selectedValue: ReturnType<typeof normalizeModelValue<T>>;
  readonly getOptionItemValue: (optItem: SelectPanelOption<T>) => T;
  readonly isMutiple: (val?: T | Set<T>) => val is Set<T>;
}

// 自定义组件上下文
export interface Context<T extends SimpleType> {
  base: BaseContext<T>;
  readonly isOptionSelected: (optItem: SelectPanelOption<T>) => boolean;
  readonly isOptionDisabled: (optItem: SelectPanelOption<T>) => boolean;
  readonly setSelectedVal: (val: SelectSetValue<T>, oldVal?: SelectSetValue<T>) => void;
}

// 默认插槽属性
export interface DefaultSlotProps<T extends SimpleType, O extends SelectPanelOption<T>> {
  // 当前项数据
  data: O;
  // 是否被选中
  selected: boolean;
  // 是否禁用
  disabled: boolean;
  // 当前项下标
  index: number;
}

// 组件导出实例
export interface SelectPanelInstance {
  /**
   * 全选或全不选当前过滤下拉项
   * @param checkAll 是否全选
   */
  checkAllOrNot: (checkAll?: boolean) => void;
  // 反选当前选中项
  reverseCheck: () => void;
}
