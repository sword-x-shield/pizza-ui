<script lang='ts'>
import type { CSSProperties, PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { isUndefined, throttle } from 'lodash-es';
import { getClsPrefix, getElement } from '@pizza-ui/utils';

export type AffixPosition = 'fixed' | 'absolute'

export default defineComponent({
  name: 'Affix',
  props: {
    offsetTop: {
      type: Number,
      default: 0,
    },
    offsetBottom: {
      type: Number,
    },
    scrollTarget: {
      type: [String, Object, Function] as PropType<
        string | HTMLElement| Document | Window
      >,
    },
    position: {
      type: String as PropType<AffixPosition>,
      default: 'fixed',
    },
  },
  setup(props) {
    const clsPrefix = getClsPrefix('affix');
    const affixRef = ref<HTMLElement>();
    const container = ref<HTMLElement | Document | Window>();
    const fixedStyles = ref<CSSProperties>();
    const fixedStatus = ref(false);

    const handleScroll = throttle(() => {
      if (!affixRef.value) return;
      const { offsetTop, offsetBottom, position } = props;
      const offsetType = isUndefined(offsetBottom) ? 'top' : 'bottom';
      const affixRect = affixRef.value.getBoundingClientRect();
      const containerRect = container.value instanceof HTMLElement ? container.value.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
      const positionType = position === 'absolute' ? 'absolute' : 'fixed';
      let isFixed = false;
      let newFixedStyles = {};
      if (offsetType === 'top') {
        isFixed = affixRect.top - containerRect.top < (offsetTop || 0);
        newFixedStyles = isFixed
          ? {
            position: positionType,
            top: positionType === 'fixed' ? `${containerRect.top + (offsetTop || 0)}px` : null,
            bottom: positionType === 'fixed' ? null : `${containerRect.top + (offsetTop || 0)}px`,
          }
          : {};
      }
      else {
        isFixed = containerRect.bottom - affixRect.bottom < (offsetBottom || 0);
        newFixedStyles = isFixed
          ? {
            position: positionType,
            bottom: `${
              window.innerHeight - containerRect.bottom + (offsetBottom || 0)
            }px`,
          }
          : {};
      }

      fixedStyles.value = { ...newFixedStyles };
    });

    const init = () => {
      const { scrollTarget } = props;
      container.value = (scrollTarget
        && scrollTarget !== document
        && getElement(scrollTarget as string | HTMLElement)
      ) || document;

      if (container.value) {
        container.value.addEventListener('scroll', handleScroll);
        handleScroll();
      }
    };

    onMounted(() => {
      init();
    });

    onBeforeUnmount(() => {
      if (container.value) {
        container.value.removeEventListener('scroll', handleScroll);
        handleScroll();
      }
    });

    return {
      clsPrefix,
      affixRef,
      fixedStyles,
      fixedStatus,
    };
  },
});
</script>

<template>
  <div
    ref="affixRef"
  >
    <div :style="fixedStyles" :class="clsPrefix">
      <slot />
    </div>
  </div>
</template>

