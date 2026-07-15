<template>
  当前选中值：{{ value }}
  <div class="wrapper">
    <SelectPanel
      v-model="value"
      mutiple
      :options="options"
    ></SelectPanel>
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

<style scoped>
.wrapper {
  height: 300px;
  border: 1px solid var(--gray-light-0);
}
</style>
