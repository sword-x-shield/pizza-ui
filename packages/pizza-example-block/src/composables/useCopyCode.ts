import { Ref, reactive, toRefs } from 'vue';

export function useCopyCode(code: Ref<string>) {
  const state = reactive({
    showTip: false,
  });

  function copyCode() {
    navigator.clipboard.writeText(code.value);
    state.showTip = true;
    setTimeout(() => {
      state.showTip = false;
    }, 5 * 1000);
  }

  return {
    ...toRefs(state),
    copyCode,
  };
}
