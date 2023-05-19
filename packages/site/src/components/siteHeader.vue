<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { onKeyStroke } from '@vueuse/core';
import siteSearchButton from './siteSearchButton.vue';
import siteSearchBox from './siteSearchBox.vue';

withDefaults(defineProps<{
  mode: 'light' | 'dark'
}>(), {
  mode: 'light',
});

const emit = defineEmits(['toggle-mode']);

const router = useRouter();

function goToGithub() {
  window.open('https://github.com/sword-x-shield/pizza-ui');
}

const metaKey = ref('\'Meta\'');
onMounted(() => {
  // meta key detect (same logic as in @docsearch/js)
  metaKey.value = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
    ? '\'⌘\''
    : '\'Ctrl\'';
});

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement;
  const tagName = element.tagName;

  return (
    element.isContentEditable
    || tagName === 'INPUT'
    || tagName === 'SELECT'
    || tagName === 'TEXTAREA'
  );
}

const showSearch = ref(false);
onKeyStroke('k', (event) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
    showSearch.value = true;
    console.log(111);
  }
});

onKeyStroke('/', (event) => {
  if (!isEditingContent(event)) {
    event.preventDefault();
    showSearch.value = true;
  }
});
</script>

<template>
  <div class="site-header__container">
    <div class="site-header__left">
      <div tag="div" class="site-header__logo" @click="router.push('/pizza-ui')">
        <img src="../assets/pizza-logo.png" width="110" height="40" style="padding: 5px;">
      </div>
      <div class="site-header__menu" :style="{ '--p-meta-key': metaKey }">
        <button>文档</button>
        <button @click=" router.push('/pizza-ui/components')">
          组件
        </button>
        <siteSearchButton placeholder="Search" style="flex: 1;" @click="showSearch = true" />
        <siteSearchBox v-if="showSearch" placeholder="Search" @close="showSearch = false" />
      </div>
    </div>
    <div class="site-header__right">
      <div class="site-header__link">
        <button @click="goToGithub">
          GitHub
        </button>
        <button>
          Playground
        </button>
        <div>0.0.1</div>
        <div class="mode__trigger" @click="emit('toggle-mode', $event)">
          {{ mode === 'dark' ? '🌛' : '🌝' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../style/index.css';
@import 'pizza-ui/_styles/variables/index.scss';
@import 'pizza-ui/_styles/font.scss';
button {
  padding: 5px;
}

.site-header__left {
  display: flex;
  padding-left: 32px;
}

.site-header__right {
  padding-right: 32px;
}

.site-header__container{
  position: fixed;
  z-index: 999;
  width: 100%;
  border-bottom: 1px solid rgb(var(--p-gray-2));
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--p-color-bg-0);
  color: var(--p-color-text-0);
  @include font-size(3);
}

.site-header__logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: $font-size-large;
  margin-right: 80px;
}

.site-header__menu {
  display: flex;
  align-items: center;
}

.site-header__menu > * {
  margin-right: 20px;
}

.site-header__link {
  display: flex;
  align-items: center;

  .mode__trigger {
    cursor: pointer;
    user-select: none;
  }
}

.site-header__link > * {
  margin-left: 15px;
}
</style>
