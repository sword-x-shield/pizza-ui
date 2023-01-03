<script lang="ts" setup>
import { useRun } from './composables';
import { liveProps } from './props';

const props = defineProps(liveProps);

const EXAMPLE_ID = 'example__';
console.log(props);
const id = `${EXAMPLE_ID}${props.fileName}`;

useRun(props, {
  componentId: id,
});
</script>

<script lang="ts">
export default {
  name: 'PLive',
};
</script>

<template>
  <div :id="id" />
</template>

<style scoped>

</style>
