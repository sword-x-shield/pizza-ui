<docs>
---
title: 选择是否需要轨道
---

## zh-CN

当 `showRail` 和 `show-background` 一起使用，你就能得到一个纯净的侧边栏了
</docs>

<template>
  <p-anchor :show-rail="false" :show-background="false">
    <p-anchor-link title="链接1" href="#basic">
      <p-anchor-link title="链接3" />
      <p-anchor-link title="链接4" />
    </p-anchor-link>
    <p-anchor-link title="链接2" href="#background" />
    <p-anchor-link title="链接5" href="#rail" />
  </p-anchor>
</template>
