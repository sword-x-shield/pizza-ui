<docs>
---
title: 绝对定位
---

## zh-CN

细心的你可能已经发现 `fixed` 可能会飘，大概率外部还有另外的滚动条在影响。你可以使用 `absolute` 来解决，但需要你再配合一个 `relative` 的容器
</docs>

<template>
  <div class="absolute-wrap">
    <div id="absoluteContainer" class="block-container">
      <div style="height: 600px;">
        <div class="padding-block" />
        <div style="display: inline-block; width: 50%">
          <p-affix :offset-top="50" scroll-target="#absoluteContainer" position="absolute">
            <div class="block">
              距离顶部50px
            </div>
          </p-affix>
        </div>
        <div style="display: inline-block; width: 50%">
          <p-affix :offset-bottom="50" scroll-target="#absoluteContainer" position="absolute">
            <div class="block">
              距离底部60px
            </div>
          </p-affix>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.absolute-wrap {
  position: relative;
  height: 200px;
}

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

