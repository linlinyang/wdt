<template>
  当前滚动项下标：<DocInput type="number" v-model="index"></DocInput>
  <div class="demo">
    <VirtualScroll v-model:index="index" :listData="listData"></VirtualScroll>
  </div>
</template>

<script setup lang="ts">
import {
  VirtualScroll,
} from '@wdt/components';
import {
  ref,
} from 'vue';

const index = ref<number>(0);
// 随机生成滚动项
const getRandomIndex = (randomIndex: number) => {
  const repeatNum = Math.round(Math.random() * 100) + 1;
  const chars = Array(repeatNum).fill(randomIndex);
  return chars.join(',');
};
const listData = Array(100000)
  .fill(0)
  .map((_, randomIndex) => `第${ randomIndex }项: ${ getRandomIndex(randomIndex) }`);

</script>

<style scoped>
.demo {
  height: 300px;
  border: 1px solid var(--gray-light-0);
  margin-top: 5px;
}

.demo :deep(.wdt-virtual-scroll__item) {
  word-break: break-all;
}
</style>
