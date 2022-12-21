<script lang='ts'>
import { PropType, defineComponent, onMounted, ref } from 'vue';
import { throttle } from 'lodash-es';
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

    const handleScroll = throttle(() => {
      // TODO top bottom计算
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

    return {
      clsPrefix,
      affixRef,
    };
  },
});
</script>

<template>
  <div
    ref="affixRef"
    :class="[position === 'fixed' ? `${clsPrefix}` : `${clsPrefix}-absolute`]"
  >
    <slot />
  </div>
</template>

