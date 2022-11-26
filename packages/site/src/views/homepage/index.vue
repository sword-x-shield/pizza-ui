<script lang="ts" setup>
import { useRouter } from 'vue-router';
import siteFooterVue from '@/components/siteFooter.vue';
const router = useRouter();
function goToUse() {
  router.push('/components');
}
</script>

<template>
  <div class="home-container">
    <a href="https://github.com/sword-x-shield/pizza-ui" target="_blank">
      <img src="../../assets/Pizza.png" alt="Pizza logo">
    </a>
    <h1>Pizza UI</h1>
    <h2>It's a useless ui library!!!</h2>
    <button @click="goToUse">
      Go to use ->
    </button>
  </div>
  <siteFooterVue />
</template>

<style scoped>
@import '../../style/index.css';

.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 64px);
}
</style>
