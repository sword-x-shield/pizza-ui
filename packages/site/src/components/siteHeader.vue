<script lang="ts" setup>
import { useRouter } from 'vue-router';

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
</script>

<template>
  <div class="site-header__container">
    <div class="site-header__left">
      <div tag="div" class="site-header__logo" @click="router.push('/')">
        <img src="../assets/Pizza.png" width="35" height="35" style="padding: 5px;">
        <span>Pizza UI</span>
      </div>
      <div class="site-header__menu">
        <button>文档</button>
        <button @click=" router.push('/components')">
          组件
        </button>
        <input type="input" placeholder="搜索">
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
        <div class="mode__trigger" @click="emit('toggle-mode')">
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
  // padding: 0 32px;
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
