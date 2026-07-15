<template>
  <div class="demo">
    <VirtualScroll :listData="listData"></VirtualScroll>
  </div>
</template>

<script setup lang="ts">
import {
  VirtualScroll,
} from '@wdt/components';

// 随机生成滚动项
const getRandomIndex = (index: number) => {
  const repeatNum = Math.round(Math.random() * 100) + 1;
  const chars = Array(repeatNum).fill(index);
  return chars.join(',');
};
const listData = Array(100000)
  .fill(0)
  .map((_, index) => `第${ index }项: ${ getRandomIndex(index) }`);
</script>

<style scoped>
.demo {
  height: 300px;
  border: 1px solid var(--gray-light-0);
}

.demo :deep(.wdt-virtual-scroll__item) {
  word-break: break-all;
}
</style>
