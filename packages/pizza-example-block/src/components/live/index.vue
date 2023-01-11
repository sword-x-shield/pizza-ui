<script lang="ts" setup>
import { useRun } from './composables';
import { liveProps } from './props';

const props = defineProps(liveProps);

const EXAMPLE_ID = 'example__';

const id = `${EXAMPLE_ID}${props.fileName}`;

const { formatErrorMsg } = useRun(props, {
  componentId: id,
});
</script>

<script lang="ts">
export default {
  name: 'PLivePreview',
};
</script>

<template>
  <div v-show="show" :id="id" />
  <code v-show="formatErrorMsg" class="editor__error">{{ formatErrorMsg }}</code>
</template>
