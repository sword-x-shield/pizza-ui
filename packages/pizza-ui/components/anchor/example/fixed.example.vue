<docs>
---
title: 固定位置
---

## zh-CN

配合 `affix` 组件使用的时候，可以实现固定的效果
</docs>

<template>
  <div style="height: 200px">
    <p-affix :offset-top="80">
      <p-anchor>
        <p-anchor-link title="基础用法" href="#basic">
          <p-anchor-link title="链接3" />
          <p-anchor-link title="链接4" />
        </p-anchor-link>
        <p-anchor-link title="固定位置" href="#fixed" />
        <p-anchor-link title="更改轴线展示" href="#rail" />
      </p-anchor>
    </p-affix>
  </div>
</template>
