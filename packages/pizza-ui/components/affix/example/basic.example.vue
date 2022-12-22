<docs>
---
title: 基础用法
---

## zh-CN

引入组件，就是这么见到
</docs>

<template>
  <div id="containerRef" class="block-container">
    <div style="height: 600px;">
      <div class="padding-block" />
      <p-affix :offset-top="50" scroll-target="#containerRef">
        <div class="block">
          我是固定盒子
        </div>
      </p-affix>
    </div>
  </div>
</template>

<style>
.block-container {
  width: 100%;
  height: 200px;
  background-color: rgba(128, 128, 128, 0.3);
  border-radius: 3px;
  overflow: auto;
}

.block {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 30px;
  text-align: center;
  margin-left: 30px;
  background-color:  #fff;
  border: 1px solid black;
}

.padding-block {
  height: 150px;
  width: 100%;
  background-color: rgba(128, 128, 128, 0.15);
}
</style>

