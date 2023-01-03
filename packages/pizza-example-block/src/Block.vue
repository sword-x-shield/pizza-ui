<script setup lang="ts">
import { computed, ref } from 'vue';
import { VueLivePreview } from 'vue-live';
import { useConfig } from 'pizza-ui';
import copySvg from './Icons/copy.vue';
import codeSvg from './Icons/code.vue';
import refreshSvg from './Icons/refresh.vue';
import playgroundSvg from './icons/playground.vue';
import MonacoEditor from './components/monaco-editor/index';
import { useCopyCode, useError } from './composables';
import PLive from './components/live/index.vue';

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

const config = useConfig();

const { cleanError, handleError, errMsg } = useError();

const decodedCode = ref(decodeURIComponent(props.highlightedCode));

const { showTip, copyCode } = useCopyCode(decodedCode);

const expand = ref(props.defaultExpand);
const toggleExpand = () => {
  expand.value = !expand.value;
};

const editor = ref<InstanceType<typeof MonacoEditor> | null>();
const EDITOR_MAX_HEIGHT = 500;
const style = computed(() => {
  if (expand.value) {
    const height = Math.min(EDITOR_MAX_HEIGHT, editor.value?.getEditor()?.getContentHeight());
    return {
      height: height ? `${height}px` : 'auto',
    };
  }
  return { height: 0 };
});

function resetCode() {
  decodedCode.value = decodeURIComponent(props.highlightedCode);
}

const showEditorToolbar = ref(false);
function handleMouseEnter() {
  showEditorToolbar.value = true;
}

function handleMouseLeave() {
  showEditorToolbar.value = false;
}
const editorTheme = computed(() => {
  return config.mode === 'light' ? 'github-light' : 'github-dark';
});
</script>

<template>
  <div :id="fileName" class="example-block">
    <div v-show="title || desc" class="example-title-desc">
      <span class="example-title">{{ title }}</span>
      <slot name="content" />
    </div>

    <div class="example-slot">
      <p-live :code="decodedCode" :show="true" :file-name="fileName" />

      <!-- <vue-live-preview
        :code="decodedCode"
        class="editor-preview"
        :check-variable-availability="false"
        @success="cleanError"
        @error="handleError"
      /> -->
      <code v-show="errMsg" class="editor__error">{{ errMsg }}</code>
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
        <refreshSvg title="重置" @click="resetCode" />
        <codeSvg
          class="example-actions-expand"
          title="展开"
          @click="toggleExpand()"
        />
      </div>
    </div>
    <div
      :class="`language-${lang}`"
      :style="style"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <monaco-editor
        ref="editor"
        v-model="decodedCode"
        language="vue"
        :theme="editorTheme"
        style="height: 100%;"
        :options="{
          automaticLayout: true,
          scrollBeyondLastLine: false,
          fixedOverflowWidgets: true,
          minimap: {
            autohide: true,
          },
        }"
      />

      <Transition name="editor-toolbar">
        <div v-show="showEditorToolbar" class="editor-toolbar">
          <div class="editor-tag">
            可实时编辑
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss">
.example-block {
  --example-border-color: #ebedf1;
  --example-bg: #ffffff;
  --example-text-1: #213547;
}

[#{$dark-mode-attr}] .example-block {
  --example-border-color: #6b6c6d;
  --example-bg: #242424;
  --example-text-1: rgba(255, 255, 255, .87);
}

@mixin svg-icon() {
  & svg {
    width: 16px;
    height: 16px;
    cursor: pointer;

    &:not(:last-of-type) {
      margin-left: 16px
    }

    &:hover {
      color: var(--p-primary-4);
    }
  }
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
  position: relative;

  .editor-toolbar {
    position: absolute;
    top: 0px;
    right: 16px;

    .editor-tag {
      @include font-size(1);
      color: var(--p-color-text-1);
      background-color: var(--p-color-bg-2);
      padding: 4px 8px;
      border-radius: var(--p-border-radius-small);
    }
  }
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

  @include svg-icon()
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

  @include svg-icon()
}

.example-title-desc {
  border-bottom: 1px dashed var(--example-border-color);
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
  font-weight: 600;
  font-size: 18px;
}

.editor {
  &__error {
    background-color: var(--p-danger-6);
    color: var(--p-danger-1);
  }
}

.editor-toolbar-enter-active,
.editor-toolbar-leave-active {
  transition: opacity 0.3s ease;
}

.editor-toolbar-enter-from,
.editor-toolbar-leave-to {
  opacity: 0;
}

.VueLive-error {
  display: none;
}
</style>
