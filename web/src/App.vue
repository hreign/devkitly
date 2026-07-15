<script setup lang="ts">
import { computed } from 'vue';
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
</script>

<template>
  <NConfigProvider
    :theme="themeStore.naiveTheme"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
    :hljs="hljs"
  >
    <NMessageProvider>
      <AppLayout />
    </NMessageProvider>
  </NConfigProvider>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app,
.n-config-provider {
  height: 100%;
  width: 100%;
}
</style>
