import { isSimpleType, type SimpleType } from '@wdt/utils';
import {
  type Props,
  type EmitFunc,
  type BaseContext,
  type Context,
  type SelectPanelOption,
  normalizeModelValue,
  type SelectSetValue,
  type SelectPanelInstance,
} from './type';
import { shallowReactive } from 'vue';
import {
  cloneDeep,
  isNil,
} from 'lodash-es';

/**
 * 构建组件上下文
 * @param props 组件传入属性
 */
const buildBaseContext = <T extends SimpleType>(
  props: Props<T>,
  emitFn: EmitFunc<T>
): BaseContext<T> => shallowReactive<BaseContext<T>>({
  props,
  emitFn,
  selectedValue: normalizeModelValue(props),
  getOptionItemValue: (optItem: SelectPanelOption<T>) => isSimpleType(optItem) ? optItem : optItem.value,
  isMutiple: (val?: T | Set<T>): val is Set<T> => Boolean(props.mutiple),
});

// 判断传入的下拉项是否被选中
const useIsOptionSelected = <T extends SimpleType>(
  baseContext: BaseContext<T>,
) => (optItem: SelectPanelOption<T>): boolean => {
  const { selectedValue } = baseContext;

  // 当前没有选中任何值
  if (isNil(selectedValue)) {
    return false;
  }

  const optionItemValue = baseContext.getOptionItemValue(optItem);
  // 多选时，选中项为set集合
  if (selectedValue instanceof Set) {
    return selectedValue.has(optionItemValue);
  }

  // 单选
  return selectedValue === optionItemValue;
};

// 判断传入的下拉项是否disabled
const useIsOptionDisabled = <T extends SimpleType>(
  baseContext: BaseContext<T>,
): Context<T>['isOptionDisabled'] => (optItem: SelectPanelOption<T>): boolean => {
  const {
    selectedValue,
    props,
    isMutiple,
  } = baseContext;
  // 选项配置禁用
  const optItemDisabled = isSimpleType(optItem) ? false : optItem.disabled;

  if (props.disabled || optItemDisabled) {
    return true;
  }

  // 单选不禁用
  if (!isMutiple(selectedValue)) {
    return false;
  }

  const multipleLimit = props.multipleLimit ?? Infinity;
  return selectedValue.size >= multipleLimit;
};

// 更新选中值
const useSetSelectedVal = <T extends SimpleType>(
  baseContext: BaseContext<T>,
): Context<T>['setSelectedVal'] => (
  val: SelectSetValue<T>,
  oldVal?: SelectSetValue<T>,
): void => {
  baseContext.selectedValue = Array.isArray(val) ? new Set(val) : val;
  const newValue = val instanceof Set ? [...val] : val;
  const oldValue = oldVal instanceof Set ? [...oldVal] : oldVal;
  baseContext.emitFn('update:modelValue', newValue);
  baseContext.emitFn('change', newValue, oldValue);
};

// 填充组件上下文
export const buildContext = <T extends SimpleType>(
  props: Props<T>,
  emitFn: EmitFunc<T>
): Context<T> => {
  const baseContext = buildBaseContext(props, emitFn);
  return {
    base: baseContext,
    isOptionSelected: useIsOptionSelected(baseContext),
    isOptionDisabled: useIsOptionDisabled(baseContext),
    setSelectedVal: useSetSelectedVal(baseContext),
  };
};

// 全选/全不选当前过滤后的列表项
export const useCheckAllOrNot = <T extends SimpleType>(
  context: Context<T>,
): SelectPanelInstance['checkAllOrNot'] => (isCheckAll: boolean = true): void => {
  const {
    base: {
      selectedValue,
      props,
      isMutiple
    },
    setSelectedVal,
  } = context;

  const options = props.options ?? [];
  const multipleLimit = props.multipleLimit ?? Infinity;
  if (!isMutiple(selectedValue) || options.length === 0) {
    // 禁止单选全选/全不选操作
    return;
  }

  const newSelectedValue = cloneDeep(selectedValue);
  const oldValue = [...selectedValue];
  options.forEach((optItem) => {
    const optionItemValue = context.base.getOptionItemValue(optItem);
    if (isCheckAll) {
      if (newSelectedValue.size < multipleLimit) {
        newSelectedValue.add(optionItemValue);
      }
    } else {
      newSelectedValue.delete(optionItemValue);
    }
  });
  setSelectedVal(newSelectedValue, oldValue);
};

// 反选当前选中项
export const useReverseCheck = <T extends SimpleType>(
  context: Context<T>,
): SelectPanelInstance['reverseCheck'] => (): void => {
  const {
    base: {
      selectedValue,
      props,
      isMutiple
    },
    setSelectedVal,
  } = context;

  const options = props.options ?? [];
  const multipleLimit = props.multipleLimit ?? Infinity;
  if (!isMutiple(selectedValue) || options.length === 0) {
    // 禁止单选反选
    return;
  }

  const newSelectedValue = cloneDeep(selectedValue);
  const oldValue = [...selectedValue];
  options.forEach((optItem) => {
    const optionItemValue = context.base.getOptionItemValue(optItem);
    if (newSelectedValue.has(optionItemValue)) {
      newSelectedValue.delete(optionItemValue);
    } else {
      if (newSelectedValue.size < multipleLimit) {
        newSelectedValue.add(optionItemValue);
      }
    }
  });
  setSelectedVal(newSelectedValue, oldValue);
};

export const useLimitMultipleSelection = <T extends SimpleType>(
  context: Context<T>,
) => (): void => {
  const {
    base: {
      isMutiple,
      selectedValue,
      props
    },
    setSelectedVal
  } = context;
  const multipleLimit = props.multipleLimit ?? Infinity;
  if (!isMutiple(selectedValue)) {
    return;
  }

  if (selectedValue.size > multipleLimit) {
    const newSelectedValue = [...cloneDeep(selectedValue)];
    const oldValue = [...selectedValue];
    setSelectedVal(newSelectedValue.slice(0, multipleLimit), oldValue);
  }
};

// 选中列表项操作
// 选中列表项操作
export const useSelectOption = <T extends SimpleType>(
  context: Context<T>,
) => (optItem: SelectPanelOption<T>): void => {
  const {
    base: {
      selectedValue,
      getOptionItemValue,
      isMutiple
    },
    setSelectedVal,
  } = context;

  if (context.isOptionDisabled(optItem)) {
    return;
  }

  let newSelectedValue = cloneDeep(selectedValue);
  const optionItemValue = getOptionItemValue(optItem);
  if (isMutiple(newSelectedValue)) {
    // 多选，增加选中项
    if (newSelectedValue.has(optionItemValue)) {
      newSelectedValue.delete(optionItemValue);
    } else {
      newSelectedValue.add(optionItemValue);
    }
  } else {
    // 单选，切换选中项
    newSelectedValue = optionItemValue;
  }
  setSelectedVal(newSelectedValue, selectedValue);
};
