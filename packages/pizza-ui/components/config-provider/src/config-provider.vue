<script lang='ts'>
import { PropType, defineComponent, getCurrentInstance, provide, reactive, toRefs } from 'vue';
import { defaultClsPrefix } from '@pizza-ui/components/_composables';
import { ThemeMode, injectKey } from '../context';
export default defineComponent({
  name: 'ConfigProvider',
  props: {
    /**
     * 模式
     */
    mode: {
      type: String as PropType<ThemeMode>,
      default: 'light',
    },
    /**
     * 是否全局生效
     */
    global: {
      type: Boolean,
      default: false,
    },
    /**
     * 类名前缀
     */
    clsPrefix: {
      type: String,
      default: defaultClsPrefix,
    },
  },
  setup(props) {
    const config = reactive(toRefs(props));

    if (props.global) {
      const instance = getCurrentInstance();
      if (instance) instance.appContext.app.provide(injectKey, config);
    } else {
      provide(injectKey, config);
    }
  },
});
</script>

<template>
  <slot />
</template>
