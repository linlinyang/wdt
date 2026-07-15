<template>
  <div class="select-header">
    <p :title="toString(value)" class="select-header-value">当前选中值：{{ value }}</p>
    <div class="select-header-row">
      <span>过滤列表项: </span>
      <DocInput v-model="searchKey" placeholder="关键字"></DocInput>
      <DocButton @click="selectPanelRef?.checkAllOrNot(true)">全选</DocButton>
      <DocButton @click="selectPanelRef?.checkAllOrNot(false)">全不选</DocButton>
      <DocButton @click="selectPanelRef?.reverseCheck()">反选</DocButton>
    </div>
  </div>
  <div class="wrapper">
    <SelectPanel
      v-model="value"
      ref="selectPanelRef"
      mutiple
      :options="filteredOptions"
    ></SelectPanel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { SelectPanel, type SelectPanelInstance } from '@wdt/components';
import { toString } from 'lodash-es';

const options = Array(10000).fill(0).map((_, index) => ({
  value: index,
  label: `列表项-${ index }`,
}));
const value = ref<number[]>([]);
const searchKey = ref<string>();
const filteredOptions = computed(() => options.filter((optItem) => {
  const label = optItem.label.trim().toLowerCase();
  const trimedSearchKey = searchKey.value?.trim().toLowerCase();
  return !trimedSearchKey || label.includes(trimedSearchKey);
}));
const selectPanelRef = ref<SelectPanelInstance>();
</script>

<style scoped lang="scss">
.wrapper {
  height: 300px;
  display: flex;
  flex-flow: column nowrap;
  border: 1px solid var(--gray-light-0);

  :deep(.wdt-select-panel) {
    flex: 1 1 auto;
    min-height: 0;
  }
}

.select-header {
  margin-bottom: 20px;

  &-value {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  :deep(.doc-input) {
    margin-right: 10px;
  }
}
</style>
