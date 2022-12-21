<script lang='ts'>
import { defineComponent, inject, onMounted, ref } from 'vue';
import { getClsPrefix } from '@pizza-ui/utils';
import { anchorInjectionKey } from './context';
export default defineComponent({
  name: 'AnchorLink',
  props: {
    title: String,
    href: String,
  },
  setup(props) {
    const clsPrefix = getClsPrefix('anchor');
    const linkCls = `${clsPrefix}-link`;
    const linkRef = ref<HTMLElement>();

    const context = inject(anchorInjectionKey, undefined);

    onMounted(() => {
      if (props.href && linkRef.value) context?.addLink(props.href, linkRef.value);
    });

    const handleClick = (e: MouseEvent) => context?.handleClick(e, props.href);

    return {
      linkCls,
      context,
      linkRef,
      handleClick,
    };
  },
});
</script>

<template>
  <li ref="linkRef" :class="`${linkCls}-item`">
    <a
      :href="href"
      :class="[linkCls, { [`${linkCls}-active`]: context?.currentLink === href }]"
      @click="handleClick"
    >
      {{ title }}
    </a>
    <slot />
  </li>
</template>
