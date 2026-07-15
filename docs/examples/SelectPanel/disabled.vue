<template>
  <div class="wrapper">
    <SelectPanel
      :options="options"
      disabled
    ></SelectPanel>
  </div>
</template>

<script setup lang="ts">
import {
  SelectPanel,
} from '@wdt/components';

const options = Array(10000).fill(0).map((_, index) => index);
</script>

<style scoped>
.wrapper {
  height: 300px;
  border: 1px solid var(--gray-light-0);
}
</style>
