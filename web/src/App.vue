<script setup lang="ts">
import { computed, watch } from 'vue';
import {
  NConfigProvider,
  NMessageProvider,
  zhCN,
  dateZhCN,
  enUS,
  dateEnUS,
} from 'naive-ui';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import AppLayout from './components/AppLayout.vue';
import { useThemeStore } from './stores/theme';
import { useLocaleStore } from './stores/locale';

// 引入设计系统样式
import './styles/variables.css';
import './styles/global.css';
import './styles/transitions.css';

hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);

const themeStore = useThemeStore();
const localeStore = useLocaleStore();

const naiveLocale = computed(() =>
  localeStore.locale === 'zh-CN' ? zhCN : enUS,
);
const naiveDateLocale = computed(() =>
  localeStore.locale === 'zh-CN' ? dateZhCN : dateEnUS,
);

// 动态引入 highlight.js 主题
const hljsTheme = computed(() =>
  themeStore.isDark
    ? 'highlight.js/styles/github-dark.css'
    : 'highlight.js/styles/github.css',
);

watch(
  hljsTheme,
  (newTheme) => {
    // 移除旧的 hljs 样式
    const oldLink = document.getElementById('hljs-theme');
    if (oldLink) {
      oldLink.remove();
    }
    // 添加新的 hljs 样式
    const link = document.createElement('link');
    link.id = 'hljs-theme';
    link.rel = 'stylesheet';
    link.href = newTheme;
    document.head.appendChild(link);
  },
  { immediate: true },
);
</script>

<template>
  <NConfigProvider
    :theme="themeStore.naiveTheme"
    :theme-overrides="themeStore.naiveThemeOverrides"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
    :hljs="hljs"
  >
    <NMessageProvider>
      <AppLayout />
    </NMessageProvider>
  </NConfigProvider>
</template>
