<script lang='ts' setup>
import type { CSSProperties } from 'vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { isUndefined, throttle } from 'lodash-es';
import { getClsPrefix, getElement } from '@pizza-ui/components/_utils';

export type AffixPosition = 'fixed' | 'absolute';

const props = withDefaults(defineProps<{
  offsetTop?: number
  offsetBottom?: number
  scrollTarget?: string | HTMLElement | Document | Window
  position?: AffixPosition
}>(), {
  offsetTop: 0,
  position: 'fixed',
});

defineOptions({
  name: 'Affix',
});

const clsPrefix = getClsPrefix('affix');
const affixRef = ref<HTMLElement>();
const container = ref<HTMLElement | Document | Window>();
const fixedStyles = ref<CSSProperties>();
const fixedStatus = ref(false);

const handleScroll = throttle(() => {
  if (!affixRef.value) {
    return;
  }

  const { offsetTop, offsetBottom, position } = props;
  const offsetType = isUndefined(offsetBottom) ? 'top' : 'bottom';
  const affixRect = affixRef.value.getBoundingClientRect();
  const containerRect = container.value instanceof HTMLElement ? container.value.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
  const positionType = position === 'absolute' ? 'absolute' : 'fixed';
  let isFixed = false;
  let newFixedStyles = {};
  const newPlaceholderStyles: CSSProperties = {
    width: `${affixRef.value.offsetWidth}px`,
    height: `${affixRef.value.offsetHeight}px`,
  };
  if (offsetType === 'top') {
    isFixed = affixRect.top - containerRect.top < (offsetTop || 0);
    newFixedStyles = isFixed
      ? {
          position: positionType,
          top: positionType === 'fixed' ? `${containerRect.top + (offsetTop || 0)}px` : `${offsetTop || 0}px`,
        }
      : {};
  } else {
    isFixed = containerRect.bottom - affixRect.bottom < (offsetBottom || 0);
    newFixedStyles = isFixed
      ? {
          position: positionType,
          bottom: positionType === 'fixed' ? `${window.innerHeight - containerRect.bottom + (offsetBottom || 0)}px` : `${offsetBottom || 0}px`,
        }
      : {};
  }

  fixedStyles.value = {
    ...newFixedStyles,
    ...(isFixed ? newPlaceholderStyles : {}),
  };
}, 200);

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
  }
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
