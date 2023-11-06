<docs>
---
title: 基础用法
---

## zh-CN

设置好固定值就能用了，当然，也别忘了需要设置滚动监听的目标
</docs>

<template>
  <div id="fixedContainer" class="block-container">
    <div style="height: 600px;">
      <div class="padding-block" />
      <div style="display: inline-block; width: 50%">
        <p-affix :offset-top="50" scroll-target="#fixedContainer">
          <div class="block">
            距离顶部50px
          </div>
        </p-affix>
      </div>
      <div style="display: inline-block; width: 50%">
        <p-affix :offset-bottom="50" scroll-target="#fixedContainer">
          <div class="block">
            距离底部60px
          </div>
        </p-affix>
      </div>
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
  background-color:  transparent;
  border: 1px solid black;
}

.padding-block {
  height: 150px;
  width: 100%;
  background-color: rgba(128, 128, 128, 0.15);
}
</style>
