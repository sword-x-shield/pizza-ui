<script lang='ts'>
import { defineComponent } from 'vue';
import { getClsPrefix } from '@pizza-ui/utils';
export default defineComponent({
  name: 'AnchorLink',
  props: {
    title: String,
  },
  setup() {
    const clsPrefix = getClsPrefix('anchor');
    const linkCls = `${clsPrefix}-link`;
    return {
      linkCls,
    };
  },
});
</script>

<template>
  <li :class="`${linkCls}-item`">
    <a href="" :class="linkCls">{{ title }}</a>
    <slot />
  </li>
</template>
