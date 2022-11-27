<docs>
---
title: 我是测试标题
---

## zh-CN

按钮有五种类型：主按钮、次按钮、虚线按钮、文本按钮和链接按钮。主按钮在同一个操作区域最多出现一次。

## en-US

There are `primary` button, `default` button, `dashed` button, `text` button and `link` button in antd.
</docs>

<script setup>
function onClick() {
  window.alert('我点击了------');
}
</script>

<template>
  <div>简单测试</div>
  <button @click="onClick">
    1111
  </button>
</template>
