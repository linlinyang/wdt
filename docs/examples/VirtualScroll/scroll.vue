<template>
  <div class="scroll">
    <span>指定</span>
    <DocInput type="number" v-model="index"></DocInput>
    项滚动至视窗
    <input
      v-model="align"
      type="radio"
      id="start"
      name="align"
      value="start"
      checked
    />
    <label for="start">start</label>
    <input
      v-model="align"
      type="radio"
      id="center"
      name="align"
      value="center"
    />
    <label for="center">center</label>
    <input
      v-model="align"
      type="radio"
      id="end"
      name="align"
      value="end"
    />
    <label for="end">end</label>
    处
    <DocButton @click="onScoll">点击滚动</DocButton>
  </div>
  <div class="demo">
    <VirtualScroll :listData="listData" ref="virtualScrollRef">
      <template #default="{ data, index: innerIndex }">
        <div class="cell"><span class="cell-first">第{{ innerIndex }}项：</span>{{ data }}</div>
      </template>
    </VirtualScroll>
  </div>
</template>

<script setup lang="ts">
import {
  VirtualScroll,
  Align,
  VirtualScrollInstance,
} from '@wdt/components';
import {
  ref,
  shallowRef,
} from 'vue';

const index = ref<number>(0);
const align = ref<Align>('start');
const virtualScrollRef = shallowRef<VirtualScrollInstance>();
const onScoll = () => {
  virtualScrollRef.value?.scrollToIndex(index.value, align.value);
};
// 随机生成滚动项
const getRandomIndex = (randomIndex: number, max: number = 100) => {
  const repeatNum = Math.round(Math.random() * max) + 1;
  const chars = Array(repeatNum).fill(randomIndex);
  return chars.join(',');
};
const listData = Array(100000)
  .fill(0)
  .map((_, randomIndex) => getRandomIndex(randomIndex));

</script>

<style scoped>
.demo {
  height: 300px;
  border: 1px solid #666;
  margin-top: 15px;
}

.cell {
  word-break: break-all;
  box-sizing: border-box;
}

.cell-first {
  font-size: 20px;
}
</style>
