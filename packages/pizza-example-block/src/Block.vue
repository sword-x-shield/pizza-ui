<script setup lang="ts">
import { computed, ref } from 'vue';
import { highlight, languages } from 'prismjs';
import copySvg from './icons/copy.vue';
import codeSvg from './icons/code.vue';
import playgroundSvg from './icons/playground.vue';
import { useCopyCode } from './useCopyCode';

const props = withDefaults(
  defineProps<{
    /**
     * @zh 源码字符串(需经过encodeURIComponent处理)
     */
    highlightedCode: string
    fileName: string
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
function createCodeHtml(language: string, code: string, trim?: boolean) {
  if (!(language && languages[language]))
    return '';

  try {
    return highlight(trim ? code.trim() : code, languages[language], language);
  }
  catch (err) {}
}

const decodedCode = computed(() => decodeURIComponent(props.highlightedCode));

const { showTip, copyCode } = useCopyCode(decodedCode.value);

const decodedHighlightedCode = computed(() =>
  createCodeHtml('html', decodeURIComponent(props.highlightedCode)));

const expand = ref(props.defaultExpand);
const toggleExpand = () => (expand.value = !expand.value);

const contentRef = ref<HTMLElement>();
const style = computed(() => {
  if (expand.value) {
    const height = contentRef?.value?.firstElementChild?.clientHeight;
    return { height: height ? `${height}px` : 'auto' };
  }
  return { height: 0 };
});
</script>

<template>
  <div :id="fileName" class="example-block">
    <div class="example-slot">
      <slot name="example" />
    </div>

    <div v-show="title || desc" class="example-title-desc">
      <span class="example-title">{{ title }}</span>
      <slot name="content" />
    </div>

    <div class="example-actions">
      <div class="example-platforms">
        <playgroundSvg />
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
      ref="contentRef"
      :class="`language-${lang}`"
      :style="style"
    >
      <pre :class="`language-${lang}`">
        <code :class="`language-${lang}`" v-html="decodedHighlightedCode" />
        </pre>
    </div>
  </div>
</template>

<style>
@import './index.css';
body {
  --example-border-color: #ebedf1;
  --example-bg: #ffffff;
  --example-text-1: #213547;
}

body[pizza-theme="dark"] {
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
  background-color: #f9fafb;
  margin: 0 !important;
  line-height: 1.5 !important;
  transition: height .2s;
  overflow: hidden;
}

[class*='language-'] pre {
  display: flex;
  padding: 0;
  z-index: 1;
  overflow-x: auto;
  margin: 0px;
  background: transparent;
}

[class*='language-'] code {
  display: block;
  box-sizing: border-box;
  width: fit-content;
  min-width: 100%;
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
