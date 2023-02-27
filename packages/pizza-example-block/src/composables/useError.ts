import { Ref, computed, ref } from 'vue';
import { CompilerError } from 'vue/compiler-sfc';

export function useError<T extends Error>() {
  const errors = ref<Ref<T> | null | string>(null);

  const formatErrorMsg = computed(() => {
    if (!errors.value) return '';

    if (typeof errors.value === 'string') {
      return errors.value;
    } else {
      let msg = errors.value.message;
      const loc = (errors.value as unknown as CompilerError).loc;
      if (loc && loc.start)
        msg = `(${loc.start.line}:${loc.start.column}) ${msg}`;

      return msg;
    }
  });

  function cleanError() {
    errors.value = null;
  }

  function handleError(e: T) {
    errors.value = e;
  }

  return {
    handleError,
    cleanError,
    errors,
    formatErrorMsg,
  };
}
