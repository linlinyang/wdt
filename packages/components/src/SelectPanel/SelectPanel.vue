<!-- 选择面板组件 -->
<template>
  <div
    :class="[
      ns.b(),
      ns.is('empty', options.length === 0),
      ns.is('mutiple', mutiple),
      ns.m(getComSize(size))
    ]"
  >
    <template v-if="options.length > 0">
      <VirtualScroll :listData="options">
        <template #default="{ data, index }">
          <div
            :class="ns.e('wrap')"
            @click="selectOption(data)"
          >
            <slot
              :data="data"
              :selected="context.isOptionSelected(data)"
              :disabled="context.isOptionDisabled(data)"
              :index="index"
            >
              <div
                :class="[
                  ns.e('item'),
                  ns.is('selected', context.isOptionSelected(data)),
                  ns.is('disabled', context.isOptionDisabled(data))
                ]"
              >
                {{ isSimpleType(data) ? data : (data.label ?? data.value) }}
              </div>
            </slot>
          </div>
        </template>
      </VirtualScroll>
    </template>
    <slot name="emptyText" v-else>{{ emptyText }}</slot>
  </div>
</template>

<script setup lang="ts" generic="T extends SimpleType, O extends SelectPanelOption<T>">
import {
  type Props,
  type EmitFunc,
  normalizeModelValue,
  type DefaultSlotProps,
  type SelectPanelInstance,
  type SelectPanelOption,
} from './type';
import { type SimpleType, isSimpleType } from '@wdt/utils';
import { watch } from 'vue';
import { VirtualScroll } from '@wdt/components';
import {
  buildContext,
  useCheckAllOrNot,
  useReverseCheck,
  useSelectOption,
  useLimitMultipleSelection,
} from './state';
import { useNamespace, getComSize } from '../utils';

// 定义组件属性
const props = withDefaults(defineProps<Props<T, O>>(), {
  options: () => ([]),
  disabled: false,
  mutiple: false,
  multipleLimit: Infinity,
  size: 'default',
  emptyText: '暂无数据',
});
// 定义组件事件
const emits = defineEmits<EmitFunc<T>>();
defineOptions({
  name: 'WSelectPanel',
});
// 定义组件插槽
defineSlots<{
  // 选择项
  default(defaultProps: DefaultSlotProps<T, O>): any;
  // 列表项为空
  emptyText(): any;
}>();
const ns = useNamespace('select-panel');
// 组件通用属性上下文
const context = buildContext(props, emits);
// 全选/全不选当前过滤后的列表项
const checkAllOrNot = useCheckAllOrNot(context);
// 反选当前选中项
const reverseCheck = useReverseCheck(context);
// 选中操作
const selectOption = useSelectOption(context);
// 限制多选
const limitMultipleSelection = useLimitMultipleSelection(context);
// 传入选中值变化，更新当前选中值
watch(() => props.modelValue, () => {
  context.base.selectedValue = normalizeModelValue(props);
});
watch(() => props.multipleLimit, () => {
  limitMultipleSelection();
});
// 对外暴露接口
defineExpose<SelectPanelInstance>({
  checkAllOrNot,
  reverseCheck,
});
</script>
