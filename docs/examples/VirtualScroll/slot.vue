<template>
  <div class="demo">
    <VirtualScroll :listData="listData">
      <template #default="{ data }">
        <div class="cell">
          <span class="cell-first">第{{ data.index }}项：</span>
          <span>{{ data.text }}</span>
          <DocButton @click="onRemove(data.index)">删除</DocButton>
        </div>
      </template>
    </VirtualScroll>
  </div>
</template>

<script setup lang="ts">
import { VirtualScroll } from '@wdt/components';
import { shallowRef } from 'vue';

// 随机生成滚动项
const getRandomIndex = (index: number) => {
  const repeatNum = Math.round(Math.random() * 100) + 1;
  const chars = Array(repeatNum).fill(index);
  return chars.join(',');
};
const listData = shallowRef(Array(100000).fill(0).map((_, index) => ({
  text: getRandomIndex(index),
  index: index,
})));

const onRemove = (rmIndex: number) => {
  listData.value = listData.value.filter(({ index }) => rmIndex !== index);
};
</script>

<style scoped>
.demo {
  height: 300px;
}

.cell {
  word-break: break-all;
  box-sizing: border-box;
}

.cell-first {
  font-size: 20px;
}
</style>
