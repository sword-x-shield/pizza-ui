<script lang="ts" setup>

</script>

<template>
  <div class="site-footer__container">
    <div class="site-footer__link">
      <h3>资源</h3>
      <span>资源1</span>
      <span>资源1</span>
      <span>资源1</span>
    </div>
    <div class="site-footer__link">
      <h3>帮助</h3>
      <span>帮助1</span>
      <span>帮助1</span>
      <span>帮助1</span>
    </div>
    <div class="site-footer__link">
      <h3>社区</h3>
      <span>GitHub</span>
      <span>微信群</span>
    </div>
  </div>
</template>

<style scoped>
.site-footer__container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--p-color-bg-2);
  color: var(--p-color-text-0);
}

.site-footer__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 0 0;
  padding: 0 50px;
}
</style>
