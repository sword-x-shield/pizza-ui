<script lang="ts" setup>
import { createApp, onMounted, ref } from 'vue';
import { COMP_IDENTIFIER, count, raiseCount } from './utils';
import { useRun } from './composables';
import { liveProps } from './props';

const props = defineProps(liveProps);

const previewContainerRef = ref<HTMLDivElement>(null!);
const currentCount = count;
const id = `example__${currentCount}`;
// TODO: 优化 id 如何传入问题
useRun(props, previewContainerRef, id, currentCount);
raiseCount();
</script>

<script lang="ts">
export default {
  name: 'PLive',
};
</script>

<template>
  <div :id="id" />
  <!-- <div v-show="show" ref="previewContainerRef" class="preview__container" /> -->
</template>

<style scoped>
.preview__container {
    width: 100%;
    height: 100%;
}

.preview__container :deep(iframe) {
    width: 100%;
    height: 100%;
    border: none;
    transform-origin: 0 0;
    background-color: #fff;
}
</style>
