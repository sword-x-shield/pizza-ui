<script lang="ts" setup>
import siteFooter from './siteFooter.vue';
</script>

<template>
  <div class="site-layout">
    <div class="site-layout__menu">
      111
    </div>
    <div class="site-layout__content">
      <router-view />
      <site-footer />
    </div>
  </div>
</template>

<style scoped>
.site-layout {
  display: flex;

}

.site-layout__menu {
  width: 250px;
  background: var(--p-color-bg-1);
}
.site-layout__content {
  width: 100%;
  background-color: var(--p-color-bg-0);
  color: var(--p-color-text-0);
}
</style>
