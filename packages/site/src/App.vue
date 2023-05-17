<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';
import siteHeader from '@/components/siteHeader.vue';

type ThemeMode = 'light' | 'dark'

const mode = ref<ThemeMode>('light');
const isDark = computed<boolean>({
  get() {
    return mode.value === 'dark';
  },
  set() {
    mode.value = isDark.value ? 'light' : 'dark';
    const body = document.body;
    const root = document.documentElement;
    body.setAttribute('pizza-theme', mode.value);
    root.setAttribute('pizza-theme', mode.value);
  },
});

// @ts-expect-error: Transition API
const isAppearanceTransition = document.startViewTransition
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggleMode(event: MouseEvent) {
  if (!isAppearanceTransition || !event) {
    isDark.value = !isDark.value;
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );

  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    );
  });
}
</script>

<template>
  <p-config-provider :mode="mode">
    <site-header :mode="mode" @toggle-mode="toggleMode($event)" />
    <router-view />
  </p-config-provider>
</template>

<style>
@import './style/index.css';
@import './style/global.css';
</style>
