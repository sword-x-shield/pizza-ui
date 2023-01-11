<script lang='ts'>
import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from 'vue';
import scrollIntoViewIfNeed, { SmoothBehaviorOptions } from 'smooth-scroll-into-view-if-needed';
import { throttle } from 'lodash-es';
import { getClsPrefix, getElement } from '@pizza-ui/utils';
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
      default: true,
    },
    offsetTarget: {
      type: [String, Object] as PropType<string | HTMLElement>,
    },
  },
  emits: {
    select: (_hash: string | undefined, _preHash: string) => true,
  },
  setup(props, { emit }) {
    const clsPrefix = getClsPrefix('anchor');
    const currentLink = ref('');
    const isScrolling = ref(false);
    const links = reactive<Record<string, HTMLElement>>({});
    const scrollContainerEle = ref<HTMLElement>();
    const barRef = ref<HTMLElement>();

    const scrollIntoView = (hash: string) => {
      const element = getElement(hash);
      if (!element) return;
      isScrolling.value = true;
      const behaviorType = props.smooth ? 'smooth' : 'auto';
      scrollIntoViewIfNeed(element, { block: 'start', behavior: behaviorType as SmoothBehaviorOptions['behavior'] }).then(() => {
        isScrolling.value = false;
      });
    };

    const handleAnchorChange = (hash: string) => {
      if (hash !== currentLink.value) currentLink.value = hash;
    };

    const addLink = (hash: string, node: HTMLElement) => {
      if (!hash) return;
      links[hash] = node;
    };

    const handleClick = (_e: MouseEvent, hash?: string) => {
      if (hash) {
        scrollIntoView(hash);
        handleAnchorChange(hash);
      }
      emit('select', hash, currentLink.value);
    };

    const setContainer = () => {
      if (props.offsetTarget) scrollContainerEle.value = getElement(props.offsetTarget);
      else scrollContainerEle.value = document.documentElement;
    };

    const getFirstInViewportEle = () => {
      if (!scrollContainerEle.value) return undefined;

      const containerRect = scrollContainerEle.value.getBoundingClientRect();

      for (const hash of Object.keys(links)) {
        const element = getElement(hash);
        if (element) {
          const { top } = element.getBoundingClientRect();
          const offsetTop = scrollContainerEle.value === document.documentElement
            ? top
            : top - containerRect.top;
          if (offsetTop >= -5 && offsetTop <= containerRect.height / 2) return element;
        }
      }
      return undefined;
    };

    const handleScroll = throttle(() => {
      if (isScrolling.value) return;
      const element = getFirstInViewportEle();
      if (element && element.id) {
        const hash = `#${element.id}`;
        handleAnchorChange(hash);
      }
    });

    const bindScrollEvent = () => {
      if (scrollContainerEle.value) document.addEventListener('scroll', handleScroll, true);
    };

    const unbindScrollEvent = () => {
      if (scrollContainerEle.value) document.removeEventListener('scroll', handleScroll, true);
    };

    watch(currentLink, () => {
      const link = links[currentLink.value];
      if (props.showRail && link && barRef.value) {
        barRef.value.style.top = `${(link.firstElementChild as HTMLElement).offsetTop}px`;
        barRef.value.style.height = `${(link.firstElementChild as HTMLElement).offsetHeight}px`;
      }
    });

    onMounted(() => {
      setContainer();

      const hash = decodeURIComponent(window.location.hash);
      if (hash) {
        scrollIntoView(hash);
        handleAnchorChange(hash);
      } else {
        handleScroll();
      }

      bindScrollEvent();
    });

    onBeforeUnmount(() => {
      unbindScrollEvent();
    });

    provide(
      anchorInjectionKey,
      reactive({
        currentLink,
        showRail: props.showRail,
        handleClick,
        addLink,
      }),
    );

    return {
      clsPrefix,
      barRef,
      currentLink,
    };
  },
});
</script>

<template>
  <div :class="`${clsPrefix}`">
    <div v-if="showRail" :class="`${clsPrefix}-rail`">
      <div
        ref="barRef"
        :class="[`${clsPrefix}-rail-bar`, currentLink !== null && `${clsPrefix}-rail-bar--active`]"
      />
    </div>
    <ul :class="`${clsPrefix}-wrap`">
      <slot />
    </ul>
  </div>
</template>

