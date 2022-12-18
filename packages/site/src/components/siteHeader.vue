<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

type ThemeMode = 'light' | 'dark'

const router = useRouter();

function goToGithub() {
  window.open('https://github.com/sword-x-shield/pizza-ui');
}

const mode = ref<ThemeMode>('light');
function handleToggleMode() {
  mode.value = mode.value === 'light' ? 'dark' : 'light';
  const body = document.body;
  body.setAttribute('pizza-theme', mode.value);
}
</script>

<template>
  <div class="site-header__container">
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
    <div class="site-header__link">
      <button @click="goToGithub">
        GitHub
      </button>
      <button>
        Playground
      </button>
      <div>0.0.1</div>
      <div class="mode__trigger" @click="handleToggleMode">
        {{ mode === 'dark' ? '🌛' : '🌝' }}
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
.site-header__container{
  border-bottom: 1px solid rgb(var(--pizza-gray-2));
  display: grid;
  grid-template-columns: calc(272px - 32px) 1fr auto;
  align-items: center;
  padding: 0 32px;
  background-color: var(--pizza-color-bg-0);
  color: var(--pizza-color-text-0);
  @include font-size(3);
}

.site-header__logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: $font-size-large;
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
