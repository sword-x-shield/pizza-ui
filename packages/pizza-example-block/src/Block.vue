<script setup lang="ts">
import { computed, ref } from 'vue';
import copySvg from './Icons/copy.vue';
import codeSvg from './Icons/code.vue';
import SfcPlayground from './SfcPlayground.vue';
import { useCopyCode } from './useCopyCode';

const props = withDefaults(
  defineProps<{
    /**
     * @zh 源码字符串(需经过encodeURIComponent处理)
     */
    code: string
    highlightedCode: string
    title?: string
    desc?: string
    lang?: string
    defaultExpand?: boolean
    importMap?: Record<string, string>
  }>(),
  {
    lang: 'vue',
    defaultExpand: false,
    importMap: () => ({}),
  },
);

const decodedCode = computed(() => decodeURIComponent(props.code));

const { showTip, copyCode } = useCopyCode(decodedCode.value);

const decodedHighlightedCode = computed(() =>
  decodeURIComponent(props.highlightedCode));

const expand = ref(props.defaultExpand);
const toggleExpand = () => (expand.value = !expand.value);
</script>

<template>
  <div class="example-block">
    <div class="example-slot vp-raw">
      <slot />
    </div>

    <div v-show="title || desc" class="example-title-desc">
      <span class="example-title">{{ title }}</span>
      <span class="example-desc">{{ desc }}</span>
    </div>

    <div class="example-actions">
      <div class="example-platforms">
        <sfc-playground :content="decodedCode" :import-map="importMap" />
      </div>
      <div class="example-buttons">
        <div class="example-actions-copy">
          <span v-show="showTip" class="example-actions-tip">复制成功!</span>
          <copySvg v-show="!showTip" title="复制" @click="copyCode" />
        </div>
        <codeSvg
          class="example-actions-expand"
          title="展开"
          @click="toggleExpand()"
        />
      </div>
    </div>
    <div
      v-show="expand"
      :class="`language-${lang} extra-class`"
      v-html="decodedHighlightedCode"
    />
  </div>
</template>

<style scoped>
.example-block {
  --example-border-color: #ebedf1;
  --example-bg: #ffffff;
  --example-text-1: #213547;
}

.dark .example-block {
  --example-border-color: #6b6c6d;
  --example-bg: #242424;
  --example-text-1: rgba(255, 255, 255, .87);
}

.example-block {
  border: 1px solid var(--example-border-color);
  border-radius: 1px;
  margin-bottom: 24px;

  color: var(--example-text-1);
  background-color: var(--example-bg);
}

div[class*='language-'] {
  border-radius: 0px;
  margin: 0 !important;
  line-height: 1.5 !important;
}

[class*='language-'] pre {
  padding: 0;
}

[class*='language-'] code {
  padding: 1em;
}

.example-slot {
  padding: 40px 24px;
}

.example-actions {
  display: flex;
  height: 40px;
  padding: 0 8px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px dashed var(--example-border-color);
}

.example-buttons {
  display: flex;
  align-items: center;
}

.example-actions-expand,
.example-actions-copy {
  margin: 0 0 0 16px;
  cursor: pointer;
  color: #666;
}
.example-actions-tip {
  font-size: 12px;
  color: #3eaf7c;
}

.extra-class {
  border-top: 1px dashed var(--example-border-color);
  box-sizing: border-box;
}

.example-platforms {
  display: flex;
  align-items: center;
}

.example-title-desc {
  border-top: 1px dashed var(--example-border-color);
  padding: 1.2em 1em 1em;
  color: var(--example-text-1);
  position: relative;
  font-size: 14px;
}

.example-title {
  position: absolute;
  top: 0;
  left: 1em;
  transform: translateY(-50%);
  background: var(--example-bg);
  font-weight: 500;
}
</style>
