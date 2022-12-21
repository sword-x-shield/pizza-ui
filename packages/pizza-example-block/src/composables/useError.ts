import { computed, ref } from 'vue';

export function useError() {
  const error = ref<Error | null>(null);

  const errMsg = computed(() => {
    if (!error.value) return '';

    return error.value.name ? `${error.value.name}: ${error.value.message}` : error.value.message;
  });

  function cleanError() {
    error.value = null;
  }

  function handleError(e: Error) {
    error.value = e;
  }

  return {
    handleError,
    cleanError,
    error,
    errMsg,
  };
}
