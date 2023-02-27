<script lang='ts' setup>
/**
 * @slot default
 * 默认插槽
 */
import { inject, onMounted, ref } from 'vue';
import { getClsPrefix } from '@pizza-ui/components/_utils';
import { anchorInjectionKey } from './context';

const props = defineProps<{
  /** 标题 */
  title: string
  /** 链接 */
  href?: string
}>();

defineOptions({
  name: 'AnchorLink',
});

const clsPrefix = getClsPrefix('anchor');
const linkCls = `${clsPrefix}-link`;
const linkRef = ref<HTMLElement>();

const context = inject(anchorInjectionKey, undefined);

onMounted(() => {
  if (props.href && linkRef.value) context?.addLink(props.href, linkRef.value);
});

const handleClick = (e: MouseEvent) => context?.handleClick(e, props.href);
</script>

<template>
  <li ref="linkRef" :class="`${linkCls}-item`">
    <a
      :href="href"
      :class="[linkCls, {
        [`${linkCls}-active-line`]: context?.currentLink === href && context?.showRail,
        [`${linkCls}-active`]: context?.currentLink === href && !context?.showRail,
      }]"
      @click="handleClick"
    >
      {{ title }}
    </a>
    <slot />
  </li>
</template>
