<script lang='ts'>
import { defineComponent } from 'vue';
import { getClsPrefix } from '@pizza-ui/utils';
export default defineComponent({
  name: 'Anchor',
  props: {
    showRail: {
      type: Boolean,
      default: true,
    },
    showBackground: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: 'default',
    },
  },
  setup() {
    const clsPrefix = getClsPrefix('anchor');
    return {
      clsPrefix,
    };
  },
});
</script>

<template>
  <div :class="`${clsPrefix}`">
    <div v-if="showBackground" :class="`${clsPrefix}-background`" />
    <div :class="`${clsPrefix}-rail`">
      1
    </div>
    <ul>
      <slot />
    </ul>
  </div>
</template>

