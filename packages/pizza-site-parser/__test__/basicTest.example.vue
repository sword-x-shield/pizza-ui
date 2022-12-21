<docs>
---
title: 我是测试标题
---

## zh-CN

There are `primary` button, `default` button, `dashed` button, `text` button and `link` button in antd.
- 使用方式111
- 使用方式222

## en-US

There are `primary` button, `default` button, `dashed` button, `text` button and `link` button in antd.
</docs>

<script setup lang="ts">
function onClick() {
  window.alert('我点击了------');
}
</script>

<template>
  <div>
    简单测试
  </div>
  <button class="test-text" @click="onClick">
    1111
  </button>
</template>

<style scoped>
.test-text {
  color: red;
}
</style>
