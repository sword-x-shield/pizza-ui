<script lang='ts' setup>
/**
 * @slot default
 * 默认插槽
 */
import { onBeforeUnmount, onMounted, provide, reactive, ref, watch } from 'vue';
import scrollIntoViewIfNeed, { SmoothBehaviorOptions } from 'smooth-scroll-into-view-if-needed';
import { throttle } from 'lodash-es';
import { getClsPrefix, getElement } from '@pizza-ui/components/_utils';
import { anchorInjectionKey } from './context';

const props = withDefaults(defineProps<{
    /**
     * 是否展示轨道
    */
    showRail?: boolean
    /**
     * 是否展示背景
     */
    showBackground?: boolean
    /**
     * 尺寸
     */
    size?: string
    /**
     * 是否开启流畅滚动
     */
    smooth?: boolean
    /**
     * 滚动目标容器
     */
    offsetTarget?: string | HTMLElement
}>(), {
  showRail: true,
  showBackground: true,
  size: 'default',
  smooth: true,
});

const emit = defineEmits({
  /**
 * 选中目标
 * @arg {string | undefined} _hash hash 值
 * @arg {string} _preHash 上一次 hash 值
 */
  select: (_hash: string | undefined, _preHash: string) => true,
});

defineOptions({
  name: 'Anchor',
});

const clsPrefix = getClsPrefix('anchor');
const currentLink = ref('');
const isScrolling = ref(false);
const links = reactive<Record<string, HTMLElement>>({});
const scrollContainerEle = ref<HTMLElement>();
const barRef = ref<HTMLElement>();

const scrollIntoView = (hash: string) => {
  const element = getElement(hash);
  if (!element) {
    return;
  }
  isScrolling.value = true;
  const behaviorType = props.smooth ? 'smooth' : 'auto';
  scrollIntoViewIfNeed(element, { block: 'start', behavior: behaviorType as SmoothBehaviorOptions['behavior'] }).then(() => {
    isScrolling.value = false;
  });
};

const handleAnchorChange = (hash: string) => {
  if (hash !== currentLink.value) {
    currentLink.value = hash;
  }
};

const addLink = (hash: string, node: HTMLElement) => {
  if (!hash) {
    return;
  }
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
  if (props.offsetTarget) {
    scrollContainerEle.value = getElement(props.offsetTarget);
  } else {
    scrollContainerEle.value = document.documentElement;
  }
};

const getFirstInViewportEle = () => {
  if (!scrollContainerEle.value) {
    return undefined;
  }

  const containerRect = scrollContainerEle.value.getBoundingClientRect();

  for (const hash of Object.keys(links)) {
    const element = getElement(hash);
    if (element) {
      const { top } = element.getBoundingClientRect();
      const offsetTop = scrollContainerEle.value === document.documentElement
        ? top
        : top - containerRect.top;
      if (offsetTop >= -5 && offsetTop <= containerRect.height / 2) {
        return element;
      }
    }
  }
  return undefined;
};

const handleScroll = throttle(() => {
  if (isScrolling.value) {
    return;
  }
  const element = getFirstInViewportEle();
  if (element && element.id) {
    const hash = `#${element.id}`;
    handleAnchorChange(hash);
  }
});

const bindScrollEvent = () => {
  if (scrollContainerEle.value) {
    document.addEventListener('scroll', handleScroll, true);
  }
};

const unbindScrollEvent = () => {
  if (scrollContainerEle.value) {
    document.removeEventListener('scroll', handleScroll, true);
  }
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

