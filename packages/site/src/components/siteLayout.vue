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
  background: gray;
}
.site-layout__content {
  width: 100%;
}
</style>
