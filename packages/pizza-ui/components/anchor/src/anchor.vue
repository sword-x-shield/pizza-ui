<script lang='ts'>
import { defineComponent, nextTick, onMounted, provide, reactive, ref } from 'vue';
import { getClsPrefix } from '@pizza-ui/utils';
import { anchorInjectionKey } from './context';
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
    smooth: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const clsPrefix = getClsPrefix('anchor');
    const currentLink = ref('');
    const links = reactive<Record<string, HTMLElement>>({});

    function scrollIntoView(hash: string): void {
      const selector = hash[0] === '#' ? `[id='${hash.slice(1)}']` : hash;
      const element = document.querySelector(selector) ?? undefined;
      if (!element) return;
      element.scrollIntoView({
        behavior: props.smooth ? 'smooth' : 'auto',
      });
    }

    function handleAnchorChange(hash: string) {
      if (hash !== currentLink.value) currentLink.value = hash;
      nextTick(() => {
        emit('change', hash);
      });
    }

    const addLink = (hash: string, node: HTMLElement) => {
      if (!hash) return;
      links[hash] = node;
    };

    const handleClick = (e: MouseEvent, hash?: string) => {
      if (hash) {
        scrollIntoView(hash);
        handleAnchorChange(hash);
      }
      emit('select', hash, currentLink.value);
    };

    onMounted(() => {
      const hash = decodeURIComponent(window.location.hash);
      if (hash) {
        scrollIntoView(hash);
        handleAnchorChange(hash);
      }
      // else {
      //   handleScroll();
      // }

      // bindScrollEvent();
    });

    provide(
      anchorInjectionKey,
      reactive({
        currentLink,
        handleClick,
        addLink,
      }),
    );

    return {
      clsPrefix,
    };
  },
});
</script>

<template>
  <div :class="`${clsPrefix}`">
    <div v-if="showBackground" :class="`${clsPrefix}-background`" />
    <div :class="`${clsPrefix}-rail`" />
    <ul :class="`${clsPrefix}-wrap`">
      <slot />
    </ul>
  </div>
</template>

