<script lang='ts'>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'AnchorLink',
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
    const cls = ref('');
    return {
      cls,
    };
  },
});
</script>

<template>
  <div :class="cls">
    <div v-if="showBackground" class="anchor-background" />
    <div class="anchor-rail">
      1
    </div>
    <ul>
      <slot />
    </ul>
  </div>
</template>
