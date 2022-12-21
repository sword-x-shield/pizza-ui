<script lang="ts" setup>
import { ref } from 'vue';
import siteHeader from '@/components/siteHeader.vue';

type ThemeMode = 'light' | 'dark'

const mode = ref<ThemeMode>('light');

function toggleMode() {
  mode.value = mode.value === 'light' ? 'dark' : 'light';
  const body = document.body;
  body.setAttribute('pizza-theme', mode.value);
}
</script>

<template>
  <p-config-provider :mode="mode">
    <site-header :mode="mode" @toggle-mode="toggleMode" />
    <router-view />
  </p-config-provider>
</template>

<style>
@import './style/global.css';
</style>
