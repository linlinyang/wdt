<template>
  当前选中值：{{ value }}
  <div class="wrapper">
    <SelectPanel
      v-model="value"
      mutiple
      :options="options"
    >
      <template #default="{ data, selected, disabled, index }">
        <div
          class="custom-item" 
          :class="{
            'is-selected': selected,
            'is-disabled': disabled,
            'is-even': index % 2 === 0
          }"
        ><div v-if="selected" class="custom-item-radio"></div>{{ data }}</div>
      </template>
    </SelectPanel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  SelectPanel,
} from '@wdt/components';

const options = Array(10000).fill(0).map((_, index) => index);
const value = ref<number[]>([]);
</script>

<style scoped lang="scss">
.wrapper {
  height: 300px;
  border: 1px solid var(--gray-light-0);
}

.custom-item {
  padding-left: 10px;
  cursor: pointer;

  &.is-even {
    background: #e7e7e7;
  }

  &:hover {
    background: #c9c9c9;
    color: #409eff;
  }

  &-radio {
    display: inline-block;
    margin-right: 8px;
    border-radius: 50%;
    background: radial-gradient(circle at center, #409eff, #409eff, 30%, transparent 31%,transparent 100%);
    border: 1px solid #409eff;
    width: 12px;
    height: 12px;
  }
}
</style>
