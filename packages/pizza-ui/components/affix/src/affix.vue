<script lang='ts'>
import { defineComponent } from 'vue';
import { getClsPrefix } from '@pizza-ui/utils';

export default defineComponent({
  name: 'Affix',
  setup() {
    const clsPrefix = getClsPrefix('affix');

    return {
      clsPrefix,
    };
  },
});
</script>

<template>
  <div :class="clsPrefix">
    <slot />
  </div>
</template>

