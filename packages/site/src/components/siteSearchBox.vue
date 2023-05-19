<script lang="ts" setup>
import { onKeyStroke } from '@vueuse/core';
import { type Ref, ref, shallowRef } from 'vue';
import MiniSearch, { type SearchResult } from 'minisearch';
import { useRouter } from 'vue-router';

interface Result {
  title: string
  titles: string[]
  text?: string
}

defineProps<{
  placeholder: string
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

const router = useRouter();
const results: Ref<(SearchResult & Result)[]> = shallowRef([]);
const selectedIndex = ref(0);
onKeyStroke('Enter', () => {
  const selectedPackage = results.value[selectedIndex.value];
  if (selectedPackage) {
    router.go(selectedPackage.id);
    emit('close');
  }
});

onKeyStroke('Escape', () => {
  emit('close');
});

const searchInput = ref<HTMLInputElement>();
function focusSearchInput() {
  searchInput.value?.focus();
  searchInput.value?.select();
}

function onSearchBarClick(event: PointerEvent) {
  if (event.pointerType === 'mouse') {
    focusSearchInput();
  }
}

const filterText = ref('');
const disableDetailedView = ref('true');
</script>

<template>
  <Teleport to="body">
    <div class="searchBox">
      <div class="backdrop" @click="$emit('close')" />

      <div class="searchBox-container">
        <div class="search-bar" @pointerup="onSearchBarClick($event)">
          <svg
            class="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21l-4.35-4.35" />
            </g>
          </svg>
          <div class="search-actions before">
            <button
              class="back-button"
              title="Close search"
              @click="$emit('close')"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 12H5m7 7l-7-7l7-7"
                />
              </svg>
            </button>
          </div>
          <input
            ref="searchInput"
            v-model="filterText"
            :placeholder="placeholder"
            class="search-input"
          >
          <div class="search-actions">
            <div
              class="clear-button"
              title="Reset search"
              @click="filterText = ''"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 5H9l-7 7l7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-2 4l-6 6m0-6l6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="search-keyboard-shortcuts">
          <span>
            <kbd aria-label="up arrow">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19V5m-7 7l7-7l7 7"
                />
              </svg>
            </kbd>
            <kbd aria-label="down arrow">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v14m7-7l-7 7l-7-7"
                />
              </svg>
            </kbd>
            {{ 'to navigate' }}
          </span>
          <span>
            <kbd aria-label="enter">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <g
                  fill="none"
                  stroke="currentcolor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path d="m9 10l-5 5l5 5" />
                  <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                </g>
              </svg>
            </kbd>
            {{ 'to select' }}
          </span>
          <span>
            <kbd aria-label="escape">esc</kbd>
            {{ 'to close' }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.searchBox {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;

  @media (max-width: 768px) {
    .searchBox-container {
      margin: 0;
      width: 100vw;
      height: 100vh;
      max-height: none;
      border-radius: 0;
    }
  }

  &-container {
    position: relative;
    padding: 12px;
    margin: 64px auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: var(--p-color-bg-1);
    width: min(100vw - 60px, 900px);
    height: min-content;
    max-height: min(100vh - 128px, 900px);
    border-radius: 6px;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    transition: opacity 0.5s;
  }

  .search-bar {
    border: 1px solid var(--p-primary-6);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: text;

    &:focus-within {
      border-color: var(--p-primary-6);
    }
  }

  @media (max-width: 768px) {
    .search-bar {
      padding: 0 8px;
    }
  }

  .search-actions {
    display: flex;
    gap: 4px;
  }

  @media (any-pointer: coarse) {
    .search-actions {
      gap: 8px;
    }
  }

  @media (min-width: 769px) {
    .search-actions.before {
      display: none;
    }
  }

  .search-actions button {
    padding: 8px;
  }

  .search-actions button:hover,
  .toggle-layout-button.detailed-list {
    color: var(--p-color-bg-0);
  }

  .search-icon {
    margin: 8px;
    color: var(--p-color-text-0);
  }

  @media (max-width: 768px) {
    .search-icon {
      display: none;
    }
  }

  .clear-button {
    color: var(--p-color-text-0);
    &:hover {
      color: var(--p-primary-6);
      cursor: pointer;
    }
  }

  .search-input {
    padding: 6px 12px;
    font-size: inherit;
    width: 100%;
    background-color: transparent;
    border: 0;
    outline: none;
  }

  .search-keyboard-shortcuts {
    font-size: 0.8rem;
    opacity: 75%;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    line-height: 14px;

    span {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--p-color-text-0);
    }

    kbd {
      background: rgba(128, 128, 128, 0.1);
      border-radius: 4px;
      padding: 3px 6px;
      min-width: 24px;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      border: 1px solid rgba(128, 128, 128, 0.15);
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);

      svg {
        color: var(--p-color-text-0);
      }
    }
  }

}
</style>
